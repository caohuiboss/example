<template>
  <div class="examinterface">
    <Card :bordered="false">
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline size="mini">
          <FormItem prop="user">
            <Input type="text" placeholder="考试主题" v-model="listQuery.user" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('listQuery')">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <Card dis-hover>
        <List item-layout="vertical">
          <ListItem>
            <ListItemMeta title="等级考试-手术刀卷" description="主刀实习生专考" />
            <template slot="action">
              <li>考试时间：2020-10-01</li>
              <li>考试时长：120分钟</li>
              <li>考试状态：未考</li>
            </template>
            <template slot="extra">
              <li>
                <Button @click="openModel">开始考试</Button>
              </li>
              <br />
            </template>
          </ListItem>
          <ListItem>
            <ListItemMeta title="等级考试-手术刀卷" description="主刀实习生专考" />
            <template slot="action">
              <li>考试时间：2020-10-01</li>
              <li>考试时长：120分钟</li>
              <li>考试状态：未考</li>
            </template>
            <template slot="extra">
              <li>
                <Button @click="openModel">开始考试</Button>
              </li>
              <br />
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
          <li>考生：张三</li>
          <li>考试剩余时间：120分钟</li>
        </span>
        <h3>等级考试-手术刀卷</h3>
        <span>
          <Button @click="modalShow = false">交卷</Button>
        </span>
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
  UpdateTotalScore
} from "@/api/KS_AnswerPaper";

export default {
  name: "examinterface",
  data() {
    return {
      listQuery: {
        pageIndex: 1,
        pageSize: 15
      },
      modalShow: false
    };
  },
  created() {},
  methods: {
    openModel() {
      this.modalShow = true;
    },

    submit() {},
    cancel() {},
    handleSubmit() {}
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