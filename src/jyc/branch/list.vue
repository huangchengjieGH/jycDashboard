<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">支部列表</span>
            <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">新增支部</el-button>
        </header>
        <my-table :data="branchList" :config="tableConfig">
            <div slot="operating" slot-scope="branch">
                <el-button @click="prevShowEditModal(branch.item)" size="small" type="success">编辑</el-button>
                <el-button @click="deleteBranchItem(branch.item,branch.index)" size="small" type="danger">删除</el-button>
            </div>
        </my-table>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm">
                <div class="edit-modal-item">
                    <span class="plr-sm">名称</span>
                    <el-input v-model="branchItem.name" class="w-5"></el-input>
                </div>
            </div>
            <div slot="footer" class="text-center">
                <el-button @click="commitBranchItem()" type="primary">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Branch from '@/tool/classFactory/Branch.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: "branch-list",
        data() {
            return {
                showEditModal: false,
                branchItem: {},
                branchList: [],
                tableConfig: [
                    {
                        label: '名称',
                        property: 'name'
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

        activated() {
            this.getBranchList();
        },

        methods: {
            deleteBranchItem(obj, index) {
                const that = this;
                that.$Modal.confirm({
                    title: '提示',
                    content: '是否删除，请确认',
                    onOk: () => {
                        let branch = new Branch(obj);
                        branch.delete().then(() => {
                            that.branchList.splice(index, 1);
                        });
                    }
                });
            },

            commitBranchItem() {
                const that = this;
                let branch = new Branch(that.branchItem);
                let thenObj = null;
                if (branch.id) {
                    thenObj = branch.edit();
                } else {
                    thenObj = branch.add();
                }
                thenObj.then(() => {
                    that.showEditModal = false;
                    that.getBranchList();
                });
            },

            prevShowEditModal(obj) {
                this.branchItem = obj || {};
                this.showEditModal = true;
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
        text-align: right;
    }
</style>
