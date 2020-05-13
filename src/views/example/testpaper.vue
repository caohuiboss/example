<template>
  <div class="testpaper">
    <Card :bordered="false">
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline size="mini">
          <FormItem>
            <Button type="primary" @click="openModel" :disabled="modalShow">制作试卷</Button>
          </FormItem>
          <FormItem>
            <Input placeholder="试卷标题" v-model="listQuery.paperTitle" />
          </FormItem>
          <FormItem>
            <Input placeholder="出卷人" v-model="listQuery.Unwinder" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickSelectPaper('listQuery')">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <Modal
        id="modalShow"
        v-model="modalShow"
        :mask-closable="false"
        mask
        @on-ok="submit('_TopicFormData')"
        @on-cancel="cancel()"
        scrollable
        fullscreen
        :footer-hide="true"
        :title="modalTitle"
      >
        <Card dis-hover>
          <div slot="title">
            <Form
              :label-width="80"
              ref="_TopicFormData"
              :model="PaperFormData"
              :rules="ruleValidate"
            >
              <FormItem label="考试主题" prop="paperTitle">
                <Input v-model="PaperFormData.paperTitle" />
              </FormItem>
              <Row type="flex">
                <Col span="6">
                  <FormItem label="总分" prop="paperGrade">
                    <Input disabled v-model="PaperFormData.paperGrade" />
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="及格分数" prop="PassGrade">
                    <Input v-model="PaperFormData.PassGrade" />
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="优秀分数" prop="GoodGrade">
                    <Input v-model="PaperFormData.GoodGrade" />
                  </FormItem>
                </Col>
                <Col span="6">
                  <FormItem label="考试时长" prop="extime">
                    <Input v-model="PaperFormData.extime" />
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
          <Row type="flex" :gutter="16">
            <Col span="8">
              <Card dis-hover :style="{height:'620px',overflow:'auto'}">
                <div slot="title">
                  <Form ref="TopicListQuery" :model="TopicListQuery" inline>
                    <FormItem>
                      <Input
                        type="text"
                        v-model="TopicListQuery.topicTitle"
                        clearable
                        placeholder="试题内容"
                      />
                    </FormItem>
                    <FormItem>
                      <Select v-model="TopicListQuery.topicType" clearable placeholder="试题类型">
                        <Option
                          v-for="item in topicTypes"
                          :value="item.value"
                          :key="item.value"
                        >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem>
                      <Button type="primary" @click="SelectTopic()">搜索</Button>
                    </FormItem>
                  </Form>
                </div>
                <Table
                  border
                  ref="selectionName"
                  @on-select-cancel="onSelectCancel"
                  @on-select="onSelect"
                  @on-select-all="onSelectAll"
                  @on-select-all-cancel="onSelectAllCancel"
                  @on-selection-change="onSelectionChange"
                  size="small"
                  height="500"
                  :columns="TopicColumns"
                  :data="nameTableData"
                ></Table>
              </Card>
            </Col>
            <Col span="16">
              <Card dis-hover :style="{height:'610px',overflow:'auto'}">
                <div slot="title">试卷预览</div>
                <List border item-layout="vertical" v-if="selectTopicSelection.length">
                  <ListItem v-for="(item,index) in selectTopicSelection" :key="item.topicID">
                    <ListItem>
                      <ListItemMeta :title="index+1+'、'+item.topicTitle" />
                      <div v-if="['单选题','判断题'].includes(item.topicType)">
                        <RadioGroup vertical>
                          <Radio
                            :key="it.ID"
                            :label="it.topicOptions"
                            v-for="(it) in item.topic_Contents"
                          >{{it.topicOptions}}:{{it.topicValue}}</Radio>
                        </RadioGroup>
                      </div>
                      <div v-if="item.topicType === '多选题'" class="Checkbox">
                        <CheckboxGroup vertical>
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
                        <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
                      </div>
                      <template slot="action">
                        <li>类型：{{item.topicType}}</li>
                        <li>答案：{{item.topicAnswer}}</li>
                        <li>分数: {{item.topicFraction}}分</li>
                      </template>
                    </ListItem>
                  </ListItem>
                </List>
              </Card>
            </Col>
          </Row>
        </Card>
        <div class="card-footer-button">
          <Button @click="cancel('_TopicFormData')">取消</Button>
          <Button type="primary" @click="submit('_TopicFormData')">提交</Button>
        </div>
      </Modal>

      <div>
        <Table border :columns="columns" size="small" :data="tableData" height="710">
          <template slot-scope="{ row }" slot="crateTime">{{row.crateTime.replace('T',' ')}}</template>
          <template slot-scope="{ row }" slot="paperState">
            <Tag color="warning" v-if="row.paperState === 0">未用</Tag>
            <Tag color="success" v-else>已用</Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="InsertTask(row)"
            >发布</Button>
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="UpdatePaper(row)"
            >编辑</Button>
            <!-- <Poptip
              confirm
              placement="left"
              :title="'确定删除'+row.paperTitle+'?'"
              @on-ok="DeletePaper(row)"
            >-->
            <Button type="error" size="small" @click="DeletePaper(row)">删除</Button>
            <!-- </Poptip> -->
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

    <Modal
      id="modalShowR"
      v-model="modalShowR"
      @on-cancel="cancel()"
      :mask-closable="false"
      mask
      scrollable
      :footer-hide="true"
      :title="modalTitleR"
      width="600"
    >
      <Form ref="taskFormData" :model="taskFormData" :rules="ruleValidate">
        <FormItem label="任务名称" prop="taskName">
          <Input v-model="taskFormData.taskName" />
        </FormItem>
        <Row type="flex" :gutter="16">
          <Col span="8">
            <FormItem label="开始时间" prop="starDate">
              <DatePicker
                v-model="taskFormData.starDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value="yyyy-MM-dd HH:mm"
                @on-change="onChangeDateS"
                placeholder="选择开始时间"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="结束时间" prop="endDate">
              <DatePicker
                v-model="taskFormData.endDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value="yyyy-MM-dd HH:mm"
                @on-change="onChangeDateE"
                placeholder="选择结束时间"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="任务类型" prop="taskType">
              <Select v-model="taskFormData.taskType">
                <Option
                  v-for="item in taskTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex" :gutter="16">
          <Col span="12">
            <Card dis-hover :style="{height:'410px',overflow:'auto'}">
              <div slot="title">人员列表</div>
              <Tree
                :data="usersTree"
                ref="usersTree"
                show-checkbox
                :render="renderContent"
                @on-check-change="onTreeCheckChange"
              ></Tree>
            </Card>
          </Col>
          <Col span="12">
            <Card dis-hover :style="{height:'410px',overflow:'auto'}">
              <div slot="title">已选中人员列表</div>
              <div>{{names}}</div>
            </Card>
          </Col>
        </Row>
      </Form>
      <div class="card-footer-button">
        <Button @click="modalShowR = false">取消</Button>
        <Button type="primary" @click="submitR()">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  InsertPaper,
  SelectPaper,
  DeletePaper,
  UpdateUser,
  SelectPaperDetailById,
  InsertTask
} from "@/api/KS_Paper";

import { SelectDeptorUser } from "@/api/User";

import { SelectAllTopicDetail } from "@/api/KS_Topic";

export default {
  name: "testpaper",
  data() {
    return {
      modalShow: false,
      modalTitle: "制作试卷",
      modalShowR: false,
      modalTitleR: "发布考试",
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        Unwinder: "",
        paperTitle: ""
      },
      TopicListQuery: {
        pageIndex: 1,
        pageSize: 500,
        topicTitle: "",
        topicType: ""
      },
      value1: 1,
      total: 0,
      departmentData: [],
      department: [],
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "试卷内容",
          key: "paperTitle",
          minWidth: 200
        },
        {
          title: "试卷总分",
          key: "paperGrade",
          align: "center",
          width: 100
        },
        {
          title: "优秀分数",
          key: "GoodGrade",
          align: "center",
          width: 100
        },
        {
          title: "及格分数",
          key: "PassGrade",
          align: "center",
          width: 100
        },
        {
          title: "出卷人",
          key: "Unwinder",
          align: "center",
          width: 100
        },
        {
          title: "创建时间",
          slot: "crateTime",
          align: "center",
          key: "crateTime",
          width: 160
        },
        {
          title: "考试时长",
          key: "extime",
          align: "center",
          width: 100
        },
        {
          title: "试卷状态",
          slot: "paperState",
          align: "center",
          key: "paperState",
          width: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 180
        }
      ],
      tableData: [],
      PaperFormData: {
        paperID: 0,
        paperTitle: "",
        Unwinder: "测试人员",
        crateTime: new Date(),
        paperGrade: 0,
        PassGrade: 0,
        GoodGrade: 0,
        paperState: 0,
        extime: 0,
        topicIDs: [],
        topicList: []
      },
      ruleValidate: {
        paperTitle: [{ required: true, message: "请填写考试主题" }],
        PassGrade: [{ required: true, message: "请填写及格分数" }],
        GoodGrade: [{ required: true, message: "请填写优秀分数" }],
        extime: [{ required: true, message: "请设置考试时长" }],
        taskName: [{ required: true, message: "请填写任务名称" }],
        starDate: [{ required: true, message: "请选择开始时间" }],
        endDate: [{ required: true, message: "请选择结束时间" }],
        taskType: [{ required: true, message: "请设置任务类型" }]
      },
      TopicColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "试题内容",
          key: "topicTitle"
        },
        {
          title: "试题类型",
          align: "center",
          width: 90,
          key: "topicType"
        },
        {
          title: "分数",
          align: "center",
          width: 80,
          key: "topicFraction"
        }
      ],
      topicTypes: [
        {
          value: "单选题",
          label: "单选题"
        },
        {
          value: "多选题",
          label: "多选题"
        },
        {
          value: "填空题",
          label: "填空题"
        },
        {
          value: "判断题",
          label: "判断题"
        },
        {
          value: "简答题",
          label: "简答题"
        }
      ],
      nameTableData: [],
      topicIDs: [],
      selectTopicSelection: [],
      taskFormData: {
        taskID: 0,
        taskName: "",
        paperID: 0,
        starDate: "",
        endDate: "",
        createDate: new Date(),
        DeptIDs: "",
        Uids: "",
        taskType: 0
      },
      taskTypeList: [
        {
          label: "正式考试",
          value: 0
        },
        {
          label: "补考",
          value: 1
        }
      ],
      deptsTree: [],
      usersTree: [],
      names: ""
    };
  },
  created() {
    this.SelectPaper();
    this.SelectTopic();
  },
  methods: {
    onChangeDateS(r) {
      this.taskFormData.starDate = r;
    },
    onChangeDateE(r) {
      this.taskFormData.endDate = r;
    },
    onTreeCheckChange(data) {
      const names = [];
      data.forEach(item => {
        names.push(item.Name);
      });
      this.names = names.join(",");
    },
    async SelectDeptorUser() {
      const { data } = await SelectDeptorUser();
      this.usersTree = data;
    },
    restFormData(name) {
      this.taskFormData = {
        taskID: 0,
        taskName: "",
        paperID: 0,
        starDate: "",
        endDate: "",
        createDate: new Date(),
        DeptIDs: "",
        Uids: "",
        taskType: 0
      };
      this.PaperFormData = {
        paperID: 0,
        paperTitle: "",
        Unwinder: "测试人员",
        crateTime: new Date(),
        paperGrade: 0,
        PassGrade: 0,
        GoodGrade: 0,
        paperState: 0,
        extime: 0,
        topicIDs: [],
        topicList: []
      };
      this.usersTree = [];
      this.selectTopicSelection = [];
      this.SelectTopic()
      this.$refs["_TopicFormData"] &&
        this.$refs["_TopicFormData"].resetFields();
    },
    submitR() {
      this.$refs["taskFormData"].validate(async v => {
        if (v) {
          try {
            const Uids = [];
            const usersTree = this.$refs.usersTree.getCheckedNodes();
            usersTree.forEach(item => {
              if (item.ID === item.UserID) {
                Uids.push(item.UserID);
              }
            });
            const form = this.taskFormData;
            form.Uids = Uids.join(",");
            const { msg } = await InsertTask(form);
            this.$Message.info(msg);
            this.modalShowR = false;
          } catch (error) {
            this.$Message.error(error);
          }
        } else {
          this.$Message.error("你有必填项没填写");
        }
      });
    },
    InsertTask(row) {
      this.modalTitleR = `发布试卷：${row.paperTitle}`;
      this.taskFormData.paperID = row.paperID
      this.SelectDeptorUser();
      this.modalShowR = true;
    },
    renderContent(h, { root, node, data }) {
      return h("span", [h("span", [h("span", data.Name)])]);
    },
    async DeletePaper(row) {
      const { paperID } = row;
      this.$Modal.confirm({
        title: "警告",
        content: `是否删除试卷${row.paperTitle}`,
        onOk: async () => {
          const { msg } = await DeletePaper({ paperID });
          this.$Message.info(msg);
          this.clickSelectPaper();
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    },
    async UpdatePaper(row) {
      const { data } = await SelectPaperDetailById({ PaperID: row.paperID });
      this.PaperFormData = data;
      this.selectTopicSelection = data.topicList;
      this.SelectTopic();
      this.topicIDs = data.topicIDs;
      this.modalTitle = "编辑试卷：" + row.paperTitle;
      this.modalShow = true;
      // console.log(data);
    },
    async onSelectCancel(selection, row) {
      this.selectTopicSelection.forEach((item, index) => {
        if (item.topicID === row.topicID) {
          this.selectTopicSelection.splice(index, 1);
        }
      });
    },
    onSelectAllCancel() {
      this.selectTopicSelection = [];
    },
    onSelectAll(selection) {
      this.selectTopicSelection = selection;
    },
    onSelect(selection, row) {
      // console.log(selection);
      this.selectTopicSelection.push(row);
    },
    onSelectionChange(selection) {
      // console.log(selection);
      const topicIDs = [];
      const topicFraction = [];
      selection.forEach(item => {
        topicIDs.push(item.topicID);
        topicFraction.push(item.topicFraction);
      });
      this.PaperFormData.paperGrade = topicFraction.reduce((a, b) => a + b, 0);
      this.PaperFormData.topicIDs = topicIDs;
      this.PaperFormData.topicList = selection;
    },
    submit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          try {
            const formData = this.PaperFormData;
            const { msg } =
              this.modalTitle === "制作试卷"
                ? await InsertPaper(formData)
                : await UpdateUser(formData);
            this.$Message.info(msg);
            this.modalShow = false;
          } catch (error) {
            this.$Message.error(error);
          }
          this.SelectPaper();
        } else {
          this.$Message.error("你有必填项没填写");
          this.modalLoading = false;
        }
      });
    },
    cancel() {
      this.modalShow = false;
      this.restFormData()
    },
    openModel() {
      this.modalTitle = "制作试卷";
      this.modalShow = true;
    },
    async SelectPaper() {
      try {
        this.listLoading = true;
        const { data } = await SelectPaper(this.listQuery);
        this.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectPaper() {
      this.listQuery.pageIndex = 1;
      this.SelectPaper();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectPaper();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectPaper();
    },
    async SelectTopic() {
      const { data } = await SelectAllTopicDetail(this.TopicListQuery);
      const topicIDs = this.PaperFormData.topicIDs;
      data.forEach(item => {
        if (topicIDs.includes(item.topicID)) {
          item._checked = true;
        }
      });
      this.nameTableData = data;
    }
  }
};
</script>

<style scoped>
.testpaper /deep/ .ivu-card-head {
  border-bottom: 1px solid #e8eaec;
  padding: 6px 10px !important;
  line-height: 1;
}

.Checkbox /deep/ .ivu-checkbox-group-item {
  display: block !important;
  margin: 2px 0;
}

#modalShow /deep/ .card-footer-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

#modalShow /deep/ .card-footer-button > .ivu-btn {
  margin-right: 10px;
}

#modalShowR /deep/ .card-footer-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

#modalShowR /deep/ .card-footer-button > .ivu-btn {
  margin-right: 10px;
}
</style>

<style lang='scss' scoped>
.testpaper {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>