<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">积分项列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">新增加分项</el-button>
    </header>
    <my-table :data="pointsList" :config="tableConfig">
      <div slot="operating" slot-scope="points">
        <el-button @click="prevShowEditModal(points.item)" size="small" type="success">编辑</el-button>
        <el-button @click="deletePointsItem(points.item,points.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="p-sm">
        <div class="edit-modal-item">
          <span class="plr-sm">名称</span>
          <el-input v-model="pointsItem.name" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">分类名</span>
          <el-select class="w-5" v-model="pointsItem.classify.id" placeholder="请选择">
            <el-option
              v-for="classify in classifyList"
              :key="classify.id"
              :label="classify.name"
              :value="classify.id">
            </el-option>
          </el-select>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">积分</span>
          <el-input type="number" v-model="pointsItem.points" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitPointsItem()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Points from '@/tool/classFactory/Points.js';
  import Classify from '@/tool/classFactory/Classify.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "points-list",
    data() {
      return {
        showEditModal: false,
        pointsItem: {classify: {}},
        pointsList: [],
        classifyList: [],
        tableConfig: [
          {
            label: '名称',
            property: 'name'
          },
          {
            label: '分类名',
            property: 'classify.name'
          },
          {
            label: '加分对象',
            property: 'classify.typeName'
          },
          {
            label: '积分',
            property: 'points'
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
      this.getPointsList();
      this.getClassifyList();
    },

    methods: {
      deletePointsItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let points = new Points(obj);
            points.delete().then(() => {
              that.pointsList.splice(index, 1);
            });
          }
        });
      },

      commitPointsItem() {
        const that = this;
        let points = new Points(that.pointsItem);
        let thenObj = null;
        if (points.id) {
          thenObj = points.edit();
        } else {
          thenObj = points.add();
        }
        thenObj.then(() => {
          that.showEditModal = false;
          that.getPointsList();
        });
      },

      prevShowEditModal(obj) {
        this.pointsItem = obj || {classify: {}};
        this.showEditModal = true;
      },

      filterPointsList(list) {
        list.map(item => {
          item.classify.typeName = item.classify.type === 1 ? '党员' : '非党员';
        });
      },

      getPointsList() {
        const that = this;
        Points.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterPointsList(list);
          that.pointsList.splice(0, that.pointsList.length, ...list);
        });
      },

      getClassifyList() {
        const that = this;
        Classify.prototype.getList().then(res => {
          let list = res.data.data || [];
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
