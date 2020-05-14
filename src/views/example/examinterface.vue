<template>
  <div class="examinterface">
    <Card :bordered="false">
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline size="mini">
          <FormItem prop="user">
            <Input type="text" placeholder="任务名称" v-model="listQuery.taskName" />
          </FormItem>
          <FormItem prop="user">
            <Input type="text" placeholder="试卷标题" v-model="listQuery.paperTitle" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('listQuery')">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <Card dis-hover :style="{height:'750px',overflow:'auto'}">
        <List item-layout="vertical">
          <ListItem v-for="(item,index) in userPaperList" :key="index">
            <ListItemMeta :title="item.taskName" :description="item.paperTitle" />
            <template slot="action">
              <li>考试开始时间：{{item.starDate.replace('T',' ')}}</li>
              <li>考试结束时间：{{item.endDate.replace('T',' ')}}</li>
              <li>考试时长：{{item.extime || 0}}分钟</li>
              <li>考试状态：{{item.State === 0 ? '未考':'已考'}}</li>
            </template>
            <template slot="extra">
              <Button @click="openModel(item)" :disabled="item.State === 1">开始考试</Button>
            </template>
          </ListItem>
        </List>
      </Card>
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
      footer-hide
      :closable="false"
    >
      <div slot="header" style="display:flex;justify-content:space-between;align-items:center;">
        <span>
          <li>考生：{{paperInfo.Unwinder}}</li>
          <li>
            考试剩余时间：
            <span style="color:red;font-weight:bold;">{{extime}}</span>
          </li>
        </span>
        <h3>{{paperInfo.paperTitle}}</h3>
        <span>
          <Button @click="submit()">交卷</Button>
        </span>
      </div>
      <Card dis-hover :style="{height:'850px',overflow:'auto'}">
        <List border item-layout="vertical" v-if="selectTopicSelection.length">
          <ListItem v-for="(item,index) in selectTopicSelection" :key="item.topicID">
            <ListItem>
              <ListItemMeta :title="index+1+'、'+item.topicTitle" />
              <div v-if="['单选题','判断题'].includes(item.topicType)">
                <RadioGroup vertical v-model="item.Reply">
                  <Radio
                    :key="it.ID"
                    :label="it.topicOptions"
                    v-for="(it) in item.topic_Contents"
                  >{{it.topicOptions}}:{{it.topicValue}}</Radio>
                </RadioGroup>
              </div>
              <div v-if="item.topicType === '多选题'" class="Checkbox">
                <CheckboxGroup vertical v-model="item.Reply">
                  <Checkbox
                    :key="it.ID"
                    :label="it.topicOptions"
                    v-for="(it) in item.topic_Contents"
                  >
                    {{it.topicOptions}}:{{it.topicValue}}
                    <div></div>
                  </Checkbox>
                </CheckboxGroup>
              </div>
              <div v-if="['填空题','简答题'].includes(item.topicType)">
                <Input type="textarea" v-model="item.Reply" :autosize="{minRows: 2,maxRows: 5}" />
              </div>
              <template slot="action">
                <li>类型：{{item.topicType}}</li>
                <li>分数: {{item.topicFraction}}分</li>
              </template>
            </ListItem>
          </ListItem>
        </List>
      </Card>
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

import { SelectPaperDetailById } from "@/api/KS_Paper";

export default {
  name: "examinterface",
  data() {
    return {
      listQuery: {
        paperTitle: "",
        taskName: "",
        Uid: 1001
      },
      modalShow: false,
      userPaperList: [],
      selectTopicSelection: [],
      paperInfo: {},
      exampleFormData: {
        AnswerPaperID: 0,
        UserID: 0,
        ReplyTime: "",
        ReviewTime: "",
        ReviewUser: 0,
        ReplyGrade: 0,
        paperID: 0,
        PassState: 0,
        GoodState: 0,
        TaskID: 0,
        RetakeReplyTime: "",
        RetakeReviewTime: "",
        RetakeState: 0,
        ReTaskID: 0,
        RetakeUser: 0,
        ks_detailcontent: []
      },
      row: {},
      timer: null,
      extime: ""
    };
  },
  created() {
    this.SelectUserPaper();
  },
  methods: {
    openModel(row) {
      this.$Modal.confirm({
        title: `${row.taskName}`,
        content: `<div>
          <h4>请阅读以下考试规章制度:</h4>
          <p>1.禁止切换窗口，都会被检测到</p>
          <p>2.请注意考试时间</p>
          <p>3.不要刷新页面，否则考试作废</p>
        </div>`,
        onOk: async () => {
          const { data } = await SelectPaperDetailById({
            paperID: row.paperID
          });
          this.selectTopicSelection = data.topicList;
          this.paperInfo = data;
          this.timerComputed(data.extime);
          this.row = row;
          this.modalShow = true;
        },
        onCancel: () => {
          this.$Message.info("你已取消考试");
        }
      });
    },
    timerComputed(minute) {
      let second = Number.isNaN(minute * 60) ? 0 : minute * 60;
      this.timer = setInterval(() => {
        if (second <= 1) {
          this.InsertAnswerPaper()
          clearInterval(this.timer);
        }
        second--;
        this.extime = [
          parseInt(second / 60 / 60),
          parseInt((second / 60) % 60),
          parseInt(second % 60)
        ]
          .join(":")
          .replace(/\b(\d)\b/g, "0$1");
      }, 1000);
    },
    async InsertAnswerPaper() {
      clearInterval(this.timer);
      const { taskID, paperID } = this.row;
      const form = {
        UserID: 1001,
        paperID,
        TaskID: taskID,
        ks_detailcontent: this.selectTopicSelection.map(item => {
          return {
            Reply: Array.isArray(item.Reply)
              ? item.Reply.join(",")
              : item.Reply || '未填写',
            TopicID: item.topicID
          };
        })
      };
      const { data } = await InsertAnswerPaper(form);
      this.modalShow = false;
    },
    submit() {
      this.$Modal.confirm({
        title: `你确定要交卷了吗？`,
        content: `请再三检查后交卷`,
        onOk: async () => {
          this.InsertAnswerPaper();
        },
        onCancel: () => {
          this.$Message.info("耐心检查");
        }
      });
    },
    cancel() {},
    handleSubmit() {
      this.SelectUserPaper();
    },
    async SelectUserPaper() {
      const { data } = await SelectUserPaper(this.listQuery);
      // console.log(data);
      this.userPaperList = data;
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style scoped>
.examinterface /deep/ .ivu-card-head {
  border-bottom: 1px solid #e8eaec;
  padding: 6px 10px !important;
  line-height: 1;
}
</style>

<style lang='scss' scoped>
.examinterface {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>