<template>
  <div class="Plan-">
    <Card :bordered="false">
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline size="mini">
          <FormItem>
            <Button type="primary" @click="openModel" :disabled="modalShow">新增课件</Button>
          </FormItem>
          <FormItem>
            <Input placeholder="培训名称" v-model="listQuery.planName" />
          </FormItem>
          <FormItem>
            <Input placeholder="培训类型" v-model="listQuery.trainType" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickSelectPlan('listQuery')">搜索</Button>
          </FormItem>
        </Form>
      </div>

      <div>
        <Table border :columns="columns" size="small" :data="tableData" height="710">
          <template slot-scope="{ row }" slot="crateTime">{{row.crateTime.replace('T',' ')}}</template>
          <template slot-scope="{ row }" slot="paperState">
            <Tag color="warning" v-if="row.paperState === 0">未用</Tag>
            <Tag color="success" v-else>已用</Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px">发布</Button>
            <Button type="success" size="small" style="margin-right: 5px">编辑</Button>
          </template>
        </Table>
        <Spin size="large" fix v-if="listLoading"></Spin>
        <Page
          :total="total"
          show-sizer
          show-elevator
          show-total
          :style="{margin:'8px 0'}"
          :page-size="15"
          :page-size-opts="[15, 20, 30, 40]"
          @on-change="handleCurrentChange"
          @on-page-size-change="handleSizeChange"
        />
      </div>
    </Card>
  </div>
</template>
<script>
import {
  InsertPlan,
  SelectPlan,
  SelectTopicDetailByTopicID,
  DeleteTopic,
  UpdateTopic
} from "@/api/PX_Plan.js";

export default {
  name: "Plan-",
  data() {
    return {
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        planName: "",
        trainType: ""
      },
      total: 0,
      modalShow:false,
      columns: [],
      tableData: []
    };
  },
  created() {
    this.SelectPlan()
  },
  methods: {
    openModel() {},
    clickSelectPlan() {
      this.listQuery.pageIndex = 1;
      this.SelectPlan();
    },
    async SelectPlan() {
      try {
        this.listLoading = true;
        const { data } = await SelectPlan(this.listQuery);
        this.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectPlan();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.SelectPlan();
    }
  }
};
</script>

<style lang='scss' scoped>
.Plan- {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>