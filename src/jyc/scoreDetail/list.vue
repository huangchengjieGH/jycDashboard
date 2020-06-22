<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">加分明细</span>
            <el-select placeholder="根据支部导出"  :clearable="true" v-model="search.memberClassifyId" style="margin-left: 10px;">
                <el-option v-for="branch in branchList" :label="branch.name" :value="branch.id"></el-option>
            </el-select>
            <el-select placeholder="根据转态导出"  :clearable="true" v-model="search.status" style="margin-left: 10px;">
                <el-option v-for="status in statusList" :label="status.name" :value="status.status"></el-option>
            </el-select>
            <el-select placeholder="根据年份导出"  :clearable="true" v-model="search.year" style="margin-left: 10px;">
                <el-option v-for="year in yearList" :label="year" :value="year"></el-option>
            </el-select>
            <el-select placeholder="根据季度导出"  :clearable="true" v-model="search.quarter" style="margin-left: 10px;">
                <el-option v-for="quarter in quarterList" :label="quarter" :value="quarter"></el-option>
            </el-select>
            <el-button @click="exportExcel()" class="mlr-sm" size="small" type="primary">导出Excel</el-button>
            <el-button @click="getPointList()" class="mlr-sm" size="small" type="primary">搜索</el-button>
<!--            <el-button @click="publishQuarterTap()" class="mlr-sm" size="small" type="primary">发布季度排行榜</el-button>-->
<!--            <el-button @click="publishYearTap()" class="mlr-sm" size="small" type="primary">发布年度排行榜</el-button>-->
        </header>
        <my-table :data="memberList" :config="tableConfig" @on-name="onNameTap">
            <div slot="operating" slot-scope="member">
                <el-button @click="prevResetPassword(member.item)" size="small" type="info">重置密码</el-button>
                <el-button @click="prevShowEditModal(member.item)" size="small" type="success">编辑</el-button>
                <el-button @click="deleteMemberItem(member.item,member.index)" size="small" type="danger">删除</el-button>
            </div>
        </my-table>
        <div v-if="memberList.length" class="text-center p-sm">
            <el-pagination
                    @current-change="getMemberList(false)"
                    :current-page.sync="search.page"
                    :page-size="search.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="memberNum">
            </el-pagination>
        </div>
        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm" v-if="operateStatus==0">

                <div class="edit-modal-item">
                    <span class="plr-sm">姓名</span>
                    <el-input v-model="memberItem.name" class="w-5"></el-input>
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
                        <el-option :value="5" label="中共预备党员"></el-option>
                        <el-option :value="6" label="入党积极分子"></el-option>
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



            <div v-if="operateStatus==2">
                <div class="edit-modal-item">
                    <span class="plr-sm">年份</span>
                    <el-input v-model="year" class="w-5" placeholder="如：2019"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">季度</span>
                    <el-input v-model="quarter" class="w-5" placeholder="如：1"></el-input>
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
    import Admin from '../../tool/Admin';
    import myTable from '@/common/m-table.vue';

    export default {
        name: "member-list",
        data() {
            return {
                search: {
                    page: 1,
                    pageSize: 5
                },
                showEditModal: false,
                memberItem: {classify: {}},
                memberList: [],
                branchList: [],
                tableConfig: [
                    // {
                    //     label: '序号',
                    //     index: 'rowIndex',
                    //     property: 'base'
                    // },
                    {
                        label: '姓名',
                        property: 'memberName',
                        // color: '#409eff'
                    },
                    {
                        label: '支部',
                        property: 'branch'
                    },
                    {
                        label: '加分项',
                        property: 'pointsItemName'
                    },
                    {
                        label: '分类',
                        property: 'classifyName'
                    },
                    {
                        label: '内容',
                        property: 'name'
                    },
                    {
                        label: '分数',
                        property: 'points'
                    },
                    {
                        label: '状态',
                        property: 'statusName'
                    }
                ],
                statusList:[
                    {
                        status:1,
                        name:'申请中'
                    },
                    {
                        status:2,
                        name:'初审通过'
                    },
                    {
                        status:3,
                        name:'复审通过'
                    },
                    {
                        status:4,
                        name:'终审通过'
                    },
                    {
                        status:-2,
                        name:'初审不通过'
                    },
                    {
                        status:-3,
                        name:'复审不通过'
                    },
                    {
                        status:-4,
                        name:'终审不通过'
                    }

                ],
                yearList:[2019,2020,2021],
                quarterList:[1,2,3,4],
                operateStatus: 0,
                quarter: '',
                year: '',
                memberNum: 0
            }
        },

        components: {
            myTable
        },

        activated() {
            this.getMemberList();
            this.getBranchList();
            this.getPointList();
            // this.exportExcel();
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
                const that = this
                list.map((item,index) => {
                  if(item.status === 1) {
                      item.statusName = '申请中'
                  }
                    if(item.status === 2) {
                        item.statusName = '初审通过'
                    }
                    if(item.status === 3) {
                        item.statusName = '复审通过'
                    }
                    if(item.status === 4) {
                        item.statusName = '终审通过'
                    }
                    if(item.status === -2) {
                        item.statusName = '初审不通过'
                    }
                    if(item.status === -3) {
                        item.statusName = '复审不通过'
                    }
                    if(item.status === -4) {
                        item.statusName = '终审不通过'
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
                    // that.filterMemberList(list);
                    that.memberList.splice(0, that.memberList.length, ...list);
                    that.memberNum = res.data.extra.count || list.length;
                });
            },

            getBranchList() {
                const that = this;
                Branch.prototype.getList().then(res => {
                    let list = res.data.data || [];
                    that.branchList.splice(0, that.branchList.length, ...list);
                });
            },
            getPointList() {
                const that = this;
                Admin.prototype.getPointList(this.search).then(res => {
                    let list = res.data.data || [];
                    that.filterMemberList(list);
                    that.memberList.splice(0, that.memberList.length, ...list);
                    that.memberNum = res.data.extra.count || list.length;
                })
            },
            exportExcel() {
                const search = {
                    memberClassifyId:this.search.memberClassifyId,
                    year:this.search.year,
                    quarter:this.search.quarter
                }
                // const query = {
                //     memberClassifyId:1,
                //     status:1,
                //     year:2020,
                //     quarter:2
                // }
                Admin.prototype.ExportExcel(search).then(res => {
                    console.log(res);
                    // 创建一个新的url，此url指向新建的Blob对象
                    let content = res;
                    let fileName = '加分明细.xls'
                    const blob = new Blob([content]);
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(content)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(content, fileName)
                    }
                })
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
