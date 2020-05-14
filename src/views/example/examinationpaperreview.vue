<template>
  <div class="examinationpaperreview">
    <Card :bordered="false" dis-hover>
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline>
          <FormItem>
            <Input clearable placeholder="任务名称" />
          </FormItem>
          <FormItem>
            <Input clearable placeholder="科室" />
          </FormItem>
          <FormItem>
            <Input clearable placeholder="考生" />
          </FormItem>
          <FormItem prop="password">
            <Select style="width:120px" clearable placeholder="是否补考">
              <Option
                v-for="item in RetakeStates"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickSelectAnswerPaper()">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <Table border size="small" :columns="columns" :data="tableData" height="710">
          <template slot-scope="{ row, index }" slot="RetakeState">
            <span>{{row.RetakeState === 0?'否':"是"}}</span>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button type="success" size="small" @click="DetailById(row)">阅卷</Button>
          </template>
        </Table>
        <Spin size="large" fix v-if="listLoading"></Spin>
        <Page
          :total="Total"
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

    <Modal
      id="modalShow"
      v-model="modalShow"
      @on-ok="submit"
      @on-cancel="cancel"
      :mask-closable="false"
      mask
      scrollable
      fullscreen
      title="等级考试-手术刀卷"
      :closable="false"
    >
      等级考试-手术刀卷
      <div slot="footer">
        <Button type="primary" @click="clickSelectAnswerPaper()">搜索</Button>
        <Button type="primary" @click="clickSelectAnswerPaper()">搜索</Button>
        <Button type="primary" @click="clickSelectAnswerPaper()">搜索</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  SelectAnswerPaper,
  SelectAnswerPaperDetailById,
  InsertAnswerPaper,
  InsertRetakeAnswerPaper,
  AutomaticScore,
  UpdateTotalScore,
  SelectUserPaper
} from "@/api/KS_AnswerPaper";
export default {
  name: "examinationpaperreview",
  data() {
    return {
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 15
      },
      modalShow: false,
      columns: [
        {
          type: "index",
          title: "序号",
          width: 80,
          align: "center"
        },
        {
          title: "试卷主题",
          key: "age",
          minWidth: 300
        },
        {
          title: "考生姓名",
          key: "name",
          width: 180,
          align: "center"
        },
        {
          title: "所属科室",
          key: "name",
          width: 180,
          align: "center"
        },
        {
          title: "答题时间",
          key: "ReplyTime",
          width: 180,
          align: "center"
        },
        {
          title: "是否补考",
          key: "RetakeState",
          slot: "RetakeState",
          width: 120,
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          slot: "action",
          fixed: "right",
          align: "center",
          width: 180
        }
      ],
      RetakeStates: [
        {
          label: "是",
          value: 0
        },
        {
          label: "否",
          value: 1
        }
      ],
      Total: 0,
      tableData: []
    };
  },
  created() {
    this.SelectAnswerPaper();
  },
  methods: {
    async DetailById(row) {
      const { data } = await SelectAnswerPaperDetailById({
        AnswerPaperID: row.AnswerPaperID,
        RetakeState: row.RetakeState
      });
      this.modalShow = true;
      console.log(data);
    },
    submit() {},
    cancel() {
      console.log(1);
    },
    async SelectAnswerPaper() {
      this.listLoading = true;
      const { data } = await SelectAnswerPaper(this.listQuery);
      this.Total = data.Total;
      this.tableData = data.DataList;
      this.listLoading = false;
    },
    async clickSelectAnswerPaper() {
      this.listQuery.pageIndex = 1;
      this.SelectAnswerPaper();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectAnswerPaper();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectAnswerPaper();
    }
  }
};
</script>

<style scoped>
.examinationpaperreview /deep/ .ivu-card-head {
  border-bottom: 1px solid #e8eaec;
  padding: 6px 10px !important;
  line-height: 1;
}

#modalShow /deep/ .ivu-input-group-prepend {
  padding: 3px 7px !important;
}

#modalShow >>> .footer {
  margin-top: 10px;
}

#modalShow >>> .footer button {
  margin: 0 5px;
}

#modalShow >>> .footer button:first-child {
  margin-left: 0px;
}
</style>

<style lang='scss' scoped>
.examinationpaperreview {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>