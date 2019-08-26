<template>
    <section class="plr-sm">
        <header class="y-center ptb-md sticky">
            <span class="size-md bolder">账号信息</span>
        </header>
        <el-card>
            <div>
                <span>账号名:</span>
                <el-button type="primary" style="margin-left: 30px">{{user.username}}</el-button>
            </div>
            <div style="display: flex;align-items: center;margin: 10px 0">
                <span>所属角色:</span>
                <div v-for="item in user.roles">
                    <el-button type="primary" style="margin-left: 20px">{{item.role}}</el-button>
                </div>
            </div>
            <div>
                <span>权限:</span>
                <div style="display: flex;flex-wrap: wrap;">
                    <div v-for="item in user.permissions">
                        <el-button style="margin-left: 50px;margin-top: 10px">{{item}}</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </section>
</template>

<script>
    import My from '@/tool/classFactory/my.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: 'my-list',
        data () {
            return {
                showEditModal: false,
                type: 'classify',
                adItem: {},
                adList: [],
                user: {},
                permissionList: [],
                tableConfig: [
                    {
                        label: '图片',
                        property: '',
                        img: 'imgUrl'
                    },
                    {
                        label: '名称',
                        property: 'name',
                    },
                    {
                        label: '操作',
                        type: 'operating'
                    }
                ]
            }
        },

        components: {
            myTable
        },

        activated () {
            // this.getADList();
            this.getCurrentUser();
        },

        methods: {
            uploadBanner(res) {
                this.adItem.imgUrl = res.data;
                this.$forceUpdate();
            },

            deleteADItem(obj, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let ad = new AD(obj);
                        ad.delete().then(() => {
                            that.adList.splice(index, 1);
                        });
                    }
                });
            },

            commitADItem() {
                const that = this;
                let ad = new AD(that.adItem);
                let ajax = 'add';
                ad.id && (ajax = 'edit');
                ad[ajax]().then(() => {
                    that.showEditModal = false;
                    that.getADList();
                });
            },

            prevShowEditModal(obj) {
                const that = this;
                this.adItem = obj ? {...obj} : {seq: 1};
//        this.showEditModal = true;
                that.$router.push('/function/edit/?adId=' + this.adItem.id);
            },

            filterADList(list) {
                list.sort((x, y) => {
                    return x.seq - y.seq;
                });
            },

            getCurrentUser () {
                const that = this;
                My.prototype.currentUser().then(res => {
                    let list = res.data.data || [];
                    that.user = res.data.data
                    // that.permissionList = res.data.permissions;
                    console.log('hcj')
                    console.log(res.data.data)
                    // that.filterADList(list);
                    // that.adList.splice(0, that.adList.length, ...list);
                });
            }
        }
    }
</script>

<style scoped>
    .edit-modal-item {
        display: flex;
        align-items: center;
        padding: var(--sm);
        justify-content: center;
    }

    .edit-modal-item span {
        display: inline-block;
        min-width: 6em;
        text-align: right;
    }

    .uploader {
        width: 150px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: inline-block;
    }

    .uploader:hover {
        border-color: #409EFF;
    }

    .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        line-height: 150px;
        text-align: center;
    }

    .uploader-icon.sub {
        width: 65px;
        line-height: 65px;
    }

    .banner {
        width: 150px;
        height: 150px;
        vertical-align: middle;
    }
</style>
