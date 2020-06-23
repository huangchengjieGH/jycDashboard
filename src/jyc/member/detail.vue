<template>
    <section class="plr-sm">
        <header class="y-center ptb-xs sticky">
            <span class="size-md bolder">积分详情</span>
            <span style="margin:0 10px 0 20px">年份:</span>
            <el-select v-model="yearValue" placeholder="请选择年份" @change='onYearChange'>
                <el-option
                        v-for="item in yearList"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <!--<el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">新增分类</el-button>-->
        </header>
        <!--<my-table :data="classifyList" :config="tableConfig">-->
        <!--<div slot="operating" slot-scope="classify">-->
        <!--<el-button @click="prevShowEditModal(classify.item)" size="small" type="success">编辑</el-button>-->
        <!--<el-button @click="deleteClassifyItem(classify.item,classify.index)" size="small" type="danger">删除</el-button>-->
        <!--</div>-->
        <!--</my-table>-->

        <el-card v-if="member" class="customer-card">
            <div>
                <el-row class="y-center ptb-sm">
                    <el-col :sm="24" :lg="2">季度基础分</el-col>
                    <div style="display: flex;align-items: center;width: 90%;">
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="member.seasonBasePoints"></el-input>
                        </el-col>
                        <!--<el-col :sm="24" :lg="16" style="visibility: hidden">-->
                        <!--<el-button class="mlr-sm" size="small" type="primary">录入</el-button>-->
                        <!--</el-col>-->
                        <el-select v-model="quarter" placeholder="请选择" @change='quarterChange'>
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-row>
                <el-row class="y-center ptb-sm">
                    <el-col :sm="24" :lg="2">群众评测分</el-col>
                    <div style="display: flex;align-items: center;width: 90%;">
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="member.massesPoints"></el-input>
                        </el-col>
                        <el-col :sm="24" :lg="16">
                            <el-button class="mlr-sm" size="small" type="primary" @click="onEditTap(1)">录入</el-button>
                        </el-col>
                    </div>
                </el-row>
                <el-row class="y-center ptb-sm">
                    <el-col :sm="24" :lg="2">组织评测分</el-col>
                    <div style="display: flex;align-items: center;width: 90%;">
                        <el-col :sm="24" :lg="16">
                            <el-input v-model="member.organizePoints" placeholder="请输入内容"></el-input>
                        </el-col>
                        <el-col :sm="24" :lg="16">
                            <el-button class="mlr-sm" size="small" type="primary" @click="onEditTap(2)">录入</el-button>
                        </el-col>
                    </div>
                </el-row>
                <!--<div>-->
                <!--<span>季度基础分：</span>-->
                <!--<span class="text-warning size-md">{{member.seasonBasePoints}}</span>-->
                <!--</div>-->

                <!--<div>-->
                <!--<span>群众评测分：</span>-->
                <!--<span class="text-warning size-md">{{member.peoplePoints}}</span>-->
                <!--</div>-->
                <!--<div>-->
                <!--<span>组织评测分：</span>-->
                <!--<span class="text-warning size-md">{{member.organizePoints}}</span>-->
                <!--</div>-->
            </div>
        </el-card>

        <el-card v-if="member" class="customer-card" style="margin-top: 10px;">
            <span class="size-md bolder">月岗位绩效分</span>
            <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">设置</el-button>

            <!--<el-date-picker-->
                    <!--v-model="yearValue"-->
                    <!--type="year"-->
                    <!--placeholder="选择年">-->
            <!--</el-date-picker>-->
            <!--<el-button @click="onYearChange" class="mlr-sm" size="small" type="primary">查询</el-button>-->

            <div style="    display: flex;margin-top: 10px;">
                <div v-for="item  in monthList" style="padding: 5px;width: 10%;    border: 1px solid #eee;">
                    <div style="    display: flex;flex-direction: column;align-items: center;">
                        <span>{{item.name}}月</span>
                        <span style="font-size: 20px;color: #ffad33;">{{item.value}}</span>
                    </div>
                </div>
            </div>
        </el-card>

        <!--编辑套餐-->
        <el-dialog
                :append-to-body="true"
                :visible.sync="showEditModal">
            <div class="p-sm" v-if="operateStatus == 0">
                <div class="edit-modal-item">
                    <span class="plr-sm">年份</span>
                    <el-input v-model="monthBasePoints.year" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">月份</span>
                    <el-input v-model="monthBasePoints.month" placeholder="如：10" class="w-5"></el-input>
                </div>
                <div class="edit-modal-item">
                    <span class="plr-sm">分数</span>
                    <el-input v-model="monthBasePoints.points" class="w-5"></el-input>
                </div>
            </div>
            <div class="p-sm" v-if="operateStatus == 2">
                <div class="edit-modal-item">
                    <span class="plr-sm">分数</span>
                    <el-input v-model="organizePoints.points" class="w-5"></el-input>
                </div>
            </div>
            <div class="p-sm" v-if="operateStatus == 1">
                <div class="edit-modal-item">
                    <span class="plr-sm">分数</span>
                    <el-input v-model="massesPoints.points" class="w-5"></el-input>
                </div>
            </div>
            <div slot="footer" class="text-center">
                <el-button @click="commitClassifyItem()" type="primary">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import Member from '@/tool/classFactory/Member.js';
    import myTable from '@/common/m-table.vue';

    export default {
        name: "member-detail",
        data() {
            return {
                showEditModal: false,
                classifyItem: {type: 1},
                classifyList: [],
                yearValue: '2020',
                memberId: '',
                operateStatus: 0,
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
                ],
                yearList:[2019,2020,2021],
                member: {
                    'seasonBasePoints': 0.00,
                    'massesPoints': 0.00,
                    'organizePoints': 0.00
                },
                monthBasePoints: {
                    'memberId': '',
                    'year': '2020',
                    'month': '',
                    'points': 0
                },
                organizePoints: {
                    'memberId': '',
                    'year': '2020',
                    'points': 0
                },
                massesPoints: {
                    'memberId': '',
                    'year': '2020',
                    'points': 0
                },
                seasonBasePoints: {
                    'memberId': '',
                    'year': '2020',
                    'quarter': ''
                },
                options: [{
                    value: '1',
                    label: '第一季度'
                }, {
                    value: '2',
                    label: '第二季度'
                }, {
                    value: '3',
                    label: '第三季度'
                }, {
                    value: '4',
                    label: '第四季度'
                }
                ],
                quarter: '4',
                monthList: [
                    {
                        'name': '1',
                        'value': 0
                    },
                    {
                        'name': '2',
                        'value': 0
                    },
                    {
                        'name': '3',
                        'value': 0
                    },
                    {
                        'name': '4',
                        'value': 0
                    },
                    {
                        'name': '5',
                        'value': 0
                    },
                    {
                        'name': '6',
                        'value': 0
                    },
                    {
                        'name': '7',
                        'value': 0
                    },
                    {
                        'name': '8',
                        'value': 0
                    },
                    {
                        'name': '9',
                        'value': 0
                    },
                    {
                        'name': '10',
                        'value': 0
                    },
                    {
                        'name': '11',
                        'value': 0
                    },
                    {
                        'name': '12',
                        'value': 0
                    }
                ]
            };
        },

        components: {
            myTable
        },

        activated() {
            this.seasonBasePoints.memberId = this.memberId = this.monthBasePoints.memberId = this.massesPoints.memberId = this.organizePoints.memberId = this.$route.query.memberId || null;
            this.quarter = this.getQuarter();
            this.getMonthBasePoints();
            this.getOrganizePoints();
            this.getMassesPoints();
            this.getSeasonBasePoints();
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
            getQuarter(e) {
                var date = new Date();
                var month = date.getMonth() + 1;
                if (month < 3) {
                    return '1'
                } else if (month < 6) {
                    return '2';
                } else if (month < 9) {
                    return '3';
                } else if (month < 12) {
                    return '4';
                }
            },
            commitClassifyItem() {
                const that = this;
                if (this.operateStatus == 0) {
                    this.setMonthBasePoints();
                }
                if (this.operateStatus == 2) {
                    this.setOrganizePoints();
                }
                if (this.operateStatus == 1) {
                    this.setMassesPoints();
                }
            },
            quarterChange(e) {
                console.log(e)
                console.log(this.quarter)

            },
            getSeasonBasePoints() {
                const that = this;
                that.seasonBasePoints.year = this.yearValue
                that.seasonBasePoints.quarter = this.quarter
                Member.prototype.getSeasonBasePoints(that.seasonBasePoints).then(res => {
                    let list = res.data.data || [];
                    console.log(list);
                    that.member.seasonBasePoints = list.points;
                });
            },
            setMassesPoints() {
                const that = this;
                Member.prototype.setMassesPoints(that.massesPoints).then(res => {
                    console.log(res);
                    that.getMassesPoints();
                    that.showEditModal = false;
                });
            },
            setMonthBasePoints() {
                const that = this;
                Member.prototype.setMonthBasePoints(that.monthBasePoints).then(res => {
                    console.log(res);
                    that.getMonthBasePoints();
                    that.showEditModal = false;
                });
            },
            setOrganizePoints() {
                const that = this
                Member.prototype.setOrganizePoints(that.organizePoints).then(res => {
                    console.log(res);
                    that.getOrganizePoints();
                    that.showEditModal = false;
                });
            },
            onEditTap(e) {
                this.operateStatus = e;
                this.showEditModal = true;
            },
            getMonthBasePoints() {
                const that = this;
                console.log(that.monthBasePoints.memberId)
                var data = {
                    'memberId': that.monthBasePoints.memberId,
                    'year': that.yearValue
                }
                Member.prototype.getMonthBasePoints(data).then(res => {
                    let list = res.data.data || [];
                    console.log(list)
                    for (var idx in that.monthList) {
                        that.monthList[idx].value = 0.00
                        for (var i in list) {
                            if (that.monthList[idx].name == list[i].month) {
                                that.monthList[idx].value = list[i].points;
                            }
                        }

                    }
                });
            },
            getOrganizePoints() {
                const that = this;
                var data = {
                    'memberId': that.monthBasePoints.memberId,
                    'year': that.yearValue
                }
                Member.prototype.getOrganizePoints(data).then(res => {
                    let list = res.data.data || [];
                    console.log(list);
                    that.member.organizePoints = list.points;
                });
            },
            getMassesPoints() {
                const that = this;
                var data = {
                    'memberId': that.monthBasePoints.memberId,
                    'year': that.yearValue
                }
                Member.prototype.getMassesPoints(data).then(res => {
                    let list = res.data.data || [];
                    console.log(list);
                    that.member.massesPoints = list.points;
                });
            },
            onYearChange(e) {

                // this.getMonthBasePoints();

                this.quarter = this.getQuarter();
                this.getMonthBasePoints();
                this.getOrganizePoints();
                this.getMassesPoints();
                this.getSeasonBasePoints();
            },
            prevShowEditModal() {
                this.operateStatus = 0
                this.showEditModal = true;
            },

            filterClassifyList(list) {
                list.map(item => {
                    item.typeName = item.type === 1 ? '党员' : '非党员';
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

    .customer__wrapper {
        display: flex;
        align-items: center;
    }

    .customer__wrapper img {
        width: 100px;
        height: 100px;
        border-radius: 100px;
        object-fit: cover;
        margin-right: 10px;
    }

    .customer__wrapper__info {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .customer__wrapper__info > * {
        flex: none;
        width: 50%;
        padding: 10px;
    }

</style>
