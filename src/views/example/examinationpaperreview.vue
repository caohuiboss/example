<template>
  <div class="examinationpaperreview">
    <Card :bordered="false" dis-hover>
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline>
          <FormItem>
            <Input clearable placeholder="任务名称" v-model="listQuery.taskName"/>
          </FormItem>
          <FormItem>
            <Input clearable placeholder="科室" v-model="listQuery.deptName"/>
          </FormItem>
          <FormItem>
            <Input clearable placeholder="考生" v-model="listQuery.userName"/>
          </FormItem>
          <FormItem prop="password">
            <Select style="width:120px" clearable placeholder="是否补考" v-model="listQuery.State">
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
            <Button type="success" size="small" v-if="!row.ReviewUser" @click="DetailById(row)">阅卷</Button>
            <Button type="primary" size="small" v-else @click="DetailById(row)">查看</Button>
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
      :title="taskName"
    >
      <Card dis-hover :style="{height:'790px',overflow:'auto'}">
        <List border item-layout="vertical" v-if="selectTopicSelection.length">
          <ListItem v-for="(item,index) in selectTopicSelection" :key="item.topicID">
            <ListItem>
              <ListItemMeta :title="index+1+'、'+item.TopicList[0].topicTitle" />
              <div v-if="['单选题','判断题'].includes(item.TopicList[0].topicType)">
                <RadioGroup vertical v-model="item.Reply">
                  <Radio
                    :key="it.ID"
                    :label="it.topicOptions"
                    v-for="(it) in item.TopicList[0].topic_Contents"
                    disabled
                  >{{it.topicOptions}}:{{it.topicValue}}</Radio>
                </RadioGroup>
              </div>
              <div v-if="item.TopicList[0].topicType === '多选题'" class="Checkbox">
                <CheckboxGroup vertical v-model="item.Reply.split(',')">
                  <Checkbox
                    :key="it.ID"
                    :label="it.topicOptions"
                    v-for="(it) in item.TopicList[0].topic_Contents"
                    disabled
                  >
                    {{it.topicOptions}}:{{it.topicValue}}
                    <div></div>
                  </Checkbox>
                </CheckboxGroup>
              </div>
              <div v-if="['填空题','简答题'].includes(item.TopicList[0].topicType)">
                <Input
                  type="textarea"
                  v-model="item.Reply"
                  disabled
                  :autosize="{minRows: 2,maxRows: 5}"
                />
              </div>
              <template slot="action">
                <li>类型：{{item.TopicList[0].topicType}}</li>
                <li>正确答案：{{item.TopicAnswer}}</li>
                <li>考生答案：{{item.Reply}}</li>
                <li>分数: {{item.TopicList[0].topicFraction}}分</li>
                <li v-if="['简答题'].includes(item.TopicList[0].topicType)">
                  最终分数:
                  <InputNumber :max="item.TopicList[0].topicFraction" :min="0" :step="0.1" v-model="item.AnswerGrade"></InputNumber>
                </li>
                <li v-else>最终分数: {{item.AnswerGrade}}分</li>
              </template>
            </ListItem>
          </ListItem>
        </List>
      </Card>
      <div slot="footer">
        <Button type="primary" @click="UpdateTotalScore()" v-if="!ReviewUserName">提交阅卷</Button>
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
        pageSize: 15,
        userName: "",
        deptName: "",
        taskName: "",
        State: ""
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
          key: "taskName",
          minWidth: 300
        },
        {
          title: "阅卷者",
          key: "ReviewUserName",
          width: 100,
          align: "center"
        },
        {
          title: "试卷得分",
          key: "ReplyGrade",
          width: 100,
          align: "center"
        },
        {
          title: "考生姓名",
          key: "UserName",
          width: 100,
          align: "center"
        },
        {
          title: "所属科室",
          key: "DeptName",
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
          key: "State",
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
          width: 120
        }
      ],
      RetakeStates: [
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      Total: 0,
      tableData: [],
      selectTopicSelection: [],
      row: null,
      ReviewUserName: null,
      taskName: null
    };
  },
  created() {
    this.SelectAnswerPaper();
  },
  methods: {
    async UpdateTotalScore() {
      const { AnswerPaperID, RetakeState, paperID } = this.row;
      const form = {
        AnswerPaperID,
        RetakeState,
        paperID,
        ReviewUser: 1001,
        ks_detailcontent: this.selectTopicSelection
      };
      const { msg } = await UpdateTotalScore(form);
      this.$Message.info(msg);
      this.SelectAnswerPaper()
      this.modalShow = false;
    },
    async DetailById(row) {
      const { data } = await SelectAnswerPaperDetailById({
        AnswerPaperID: row.AnswerPaperID,
        RetakeState: row.RetakeState
      });
      this.taskName = row.taskName;
      this.row = row;
      this.ReviewUserName = row.ReviewUserName;
      this.selectTopicSelection = data.ks_detailcontent;
      this.modalShow = true;
      // console.log(data);
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