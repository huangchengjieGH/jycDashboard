<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">分类列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">新增分类</el-button>
    </header>
    <my-table :data="classifyList" :config="tableConfig">
      <div slot="operating" slot-scope="classify">
        <el-button @click="prevShowEditModal(classify.item)" size="small" type="success">编辑</el-button>
        <el-button @click="deleteClassifyItem(classify.item,classify.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="p-sm">
        <div class="edit-modal-item">
          <span class="plr-sm">名称</span>
          <el-input v-model="classifyItem.name" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">加分对象</span>
          <el-select v-model="classifyItem.type" class="w-5">
            <el-option label="党员" :value="1"></el-option>
            <el-option label="非党员" :value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitClassifyItem()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Classify from '@/tool/classFactory/Classify.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "classify-list",
    data() {
      return {
        showEditModal: false,
        classifyItem: {type: 1},
        classifyList: [],
        tableConfig: [
          {
            label: '名称',
            property: 'name'
          },
          {
            label: '加分对象',
            property: 'typeName'
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
      this.getClassifyList();
    },

    methods: {
      deleteClassifyItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let classify = new Classify(obj);
            classify.delete().then(() => {
              that.classifyList.splice(index, 1);
            });
          }
        });
      },

      commitClassifyItem() {
        const that = this;
        let classify = new Classify(that.classifyItem);
        let thenObj = null;
        if (classify.id) {
          thenObj = classify.edit();
        } else {
          thenObj = classify.add();
        }
        thenObj.then(() => {
          that.showEditModal = false;
          that.getClassifyList();
        });
      },

      prevShowEditModal(obj) {
        this.classifyItem = obj || {type: 1};
        this.showEditModal = true;
      },

      filterClassifyList(list) {
        list.map(item => {
          item.typeName = item.type === 1 ? '党员' : '非党员';
        });
      },

      getClassifyList() {
        const that = this;
        Classify.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterClassifyList(list);
          that.classifyList.splice(0, that.classifyList.length, ...list);
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
</style>
