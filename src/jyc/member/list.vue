<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">会员列表</span>
            <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">新增会员</el-button>
            <el-select placeholder="根据支部搜索" @change="getMemberList" :clearable="true" v-model="search.classifyId">
                <el-option v-for="branch in branchList" :label="branch.name" :value="branch.id"></el-option>
            </el-select>
            <el-button @click="publishQuarterTap()" class="mlr-sm" size="small" type="primary">发布季度排行榜</el-button>
            <el-button @click="publishYearTap()" class="mlr-sm" size="small" type="primary">发布年度排行榜</el-button>
        </header>
        <my-table :data="memberList" :config="tableConfig" @on-name="onNameTap">
            <div slot="operating" slot-scope="member">
                <el-button @click="prevResetPassword(member.item)" size="small" type="info">重置密码</el-button>
                <el-button @click="prevShowEditModal(member.item)" size="small" type="success">编辑</el-button>
                <el-button @click="deleteMemberItem(member.item,member.index)" size="small" type="danger">删除</el-button>
            </div>
        </my-table>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm" v-if="operateStatus==0">
                <div class="edit-modal-item">
                    <span class="plr-sm">头像</span>
                    <div class="w-5">
                        <div class="avatar-img">
                            <el-upload
                                    class="img-uploader"
                                    action="/api/upload"
                                    :show-file-list="false"
                                    :on-success="imgUpload">
                                <img v-if="memberItem.headImgUrl" :src="memberItem.headImgUrl" class="avatar-img">
                                <i v-else class="el-icon-plus img-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">姓名</span>
                    <el-input v-model="memberItem.name" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">账号</span>
                    <el-input v-model="memberItem.username" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">支部</span>
                    <el-select class="w-5" v-model="memberItem.classify.id" placeholder="请选择">
                        <el-option v-for="item in branchList" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">政治面貌</span>
                    <el-select class="w-5" v-model="memberItem.politicalStatus" placeholder="请选择">
                        <el-option :value="1" label="中共党员"></el-option>
                        <el-option :value="3" label="共青团员"></el-option>
                        <el-option :value="4" label="群众"></el-option>
                    </el-select>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">会员角色</span>
                    <div class="w-5">
                        <el-checkbox v-model="memberItem.isScorer">记分员</el-checkbox>
                        <el-checkbox v-model="memberItem.isSecretary">书记</el-checkbox>
                        <el-checkbox v-model="memberItem.isAdmin">管理员</el-checkbox>
                    </div>
                </div>
            </div>

            <div v-if="operateStatus==1">
                <div class="edit-modal-item">
                    <span class="plr-sm">年份</span>
                    <el-input v-model="year" class="w-5"></el-input>
                </div>
            </div>

            <div v-if="operateStatus==2">
                <div class="edit-modal-item">
                    <span class="plr-sm">年份</span>
                    <el-input v-model="year" class="w-5" placeholder="如：2019"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">季度</span>
                    <el-input v-model="quarter" class="w-5"  placeholder="如：1"></el-input>
                </div>
            </div>

            <div slot="footer" class="text-center">
                <el-button @click="commitMemberItem()" type="primary">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Member from '@/tool/classFactory/Member.js';
    import Branch from '@/tool/classFactory/Branch.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: "member-list",
        data() {
            return {
                search: {},
                showEditModal: false,
                memberItem: {classify: {}},
                memberList: [],
                branchList: [],
                tableConfig: [
                    {
                        label: '头像',
                        img: 'headImgUrl'
                    },
                    {
                        label: '姓名',
                        property: 'name',
                        color: '#409eff'
                    },
                    {
                        label: '账号',
                        property: 'username'
                    },
                    {
                        label: '支部',
                        property: 'classify.name'
                    },
                    {
                        label: '政治面貌',
                        property: 'politicalName'
                    },
                    {
                        label: '会员角色',
                        property: 'roleName'
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ],
                operateStatus: 0,
                quarter: '',
                year: ''
            }
        },

        components: {
            myTable
        },

        activated() {
            this.getMemberList();
            this.getBranchList();
        },

        methods: {
            deleteMemberItem(obj, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let member = new Member(obj);
                        member.delete().then(() => {
                            that.memberList.splice(index, 1);
                        });
                    }
                });
            },

            commitMemberItem() {
                const that = this;
                if (that.operateStatus === 0) {
                    that.addMember();
                }
                if (that.operateStatus === 1) {
                    that.publishYear();
                }
                if (that.operateStatus === 2) {
                    that.publishQuarter();
                }
            },
            addMember() {
                const that = this
                let member = new Member(that.memberItem);
                let thenObj = null;
                if (member.id) {
                    thenObj = member.edit();
                } else {
                    thenObj = member.add();
                }
                thenObj.then(() => {
                    that.showEditModal = false;
                    that.getMemberList();
                });
            },
            imgUpload(res) {
                console.log('res')
                console.log(res.data)
                this.memberItem.headImgUrl = res.data;
                this.$forceUpdate();
            },
            prevResetPassword(obj = {}) {
                console.log(obj)
                this.$alert('确认要重置此账户密码吗？', '重置密码', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: `action: ${ action }`
                        });
                    }
                });
            },
            prevShowEditModal(obj = {}) {
                obj.classify = obj.classify || {};
                this.memberItem = obj;
                this.showEditModal = true;
                this.operateStatus = 0;
            },
            filterMemberList(list) {
                list.map(item => {
                    item.user = item.user || {};
                    item.username = item.user.username;
                    item.roleName = '会员';
                    item.politicalName = '';
                    switch (item.politicalStatus) {
                        case 1:
                            item.politicalName = '中共党员';
                            break;
                        case 3:
                            item.politicalName = '共青团员';
                            break;
                        case 4:
                            item.politicalName = '群众';
                            break;
                    }

                    if (item.isScorer) {
                        item.roleName += '、记分员';
                    }

                    if (item.isSecretary) {
                        item.roleName += '、书记';
                    }

                    if (item.isAdmin) {
                        item.roleName += '、管理员';
                    }
                });
            },
            publishQuarter() {
                const that = this
                var data = {
                    year: that.year,
                    quarter: that.quarter
                }
                if (that.year && that.quarter) {
                    Member.prototype.publishQuatar(data).then(res => {
                        let list = res.data.data || [];
                        that.$message({
                            type: 'info',
                            message: '发布成功'
                        });
                        that.showEditModal = false;
                    });
                }
            },
            publishYear() {
                const that = this
                var data = {
                    year: that.year
                };
                if (that.year) {
                    Member.prototype.publishYear(data).then(res => {
                        let list = res.data.data || [];
                        that.$message({
                            type: 'info',
                            message: '发布成功'
                        });
                        that.showEditModal = false;
                    });
                }
            },
            publishQuarterTap(e) {
                const that = this
                that.operateStatus = 2;
                that.showEditModal = true;
            },
            publishYearTap(e) {
                const that = this
                this.operateStatus = 1;
                that.showEditModal = true;

            },
            onNameTap(obj) {
                console.log(obj)
                this.$router.push('/member/detail/?memberId=' + obj.id);
            },
            getMemberList() {
                const that = this;
                let search = {...that.search};
                if (!search.classifyId) {
                    delete search.classifyId;
                }
                Member.prototype.getList(search).then(res => {
                    let list = res.data.data || [];
                    that.filterMemberList(list);
                    that.memberList.splice(0, that.memberList.length, ...list);
                });
            },

            getBranchList() {
                const that = this;
                Branch.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    that.branchList.splice(0, that.branchList.length, ...list);
                });
            }
        }
    }
</script>

<style scoped>
    .edit-modal-item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--sm);
    }

    .edit-modal-item span {
        display: inline-block;
        min-width: 6em;
        text-align: center;
    }

    .img-uploader {
        display: flex;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .img-uploader:hover {
        border-color: #409EFF;
    }

    .img-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar-img {
        width: 100px;
        display: block;
        object-fit: cover;
    }
</style>
