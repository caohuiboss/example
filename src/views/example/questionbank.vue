<template>
  <div class="questionbank">
    <Card :bordered="false" dis-hover>
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline>
          <FormItem>
            <Button type="primary" @click="openModel" :disabled="modalShow">录制题目</Button>
          </FormItem>
          <FormItem prop="topicTitle">
            <Input type="text" v-model="listQuery.topicTitle" clearable placeholder="试题内容" />
          </FormItem>
          <FormItem prop="topicType">
            <!-- <Input type="password" v-model="listQuery.topicType" placeholder="试题类型" /> -->
            <Select v-model="listQuery.topicType" clearable placeholder="试题类型">
              <Option
                v-for="item in topicTypes"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickSelectTopicr()">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <Table border :columns="columns"  size="small" :data="tableData" height="710">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="UpdateTopic(row)"
            >编辑</Button>
            <Poptip
              confirm
              placement="left"
              :title="'确定删除'+row.topicTitle+'?'"
              @on-ok="DeleteTopic(row)"
            >
              <Button type="error" size="small">删除</Button>
            </Poptip>
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
      id="modalShow"
      v-model="modalShow"
      @on-ok="submit"
      @on-cancel="cancel"
      :mask-closable="false"
      mask
      footer-hide
      scrollable
      :title="ModalTitle"
    >
      <Alert banner v-if="ModalTitle === '录制题目'">提示：切换题目类型会清空上一题目类型的内容，请谨慎切换</Alert>
      <Tabs :animated="false" v-model="tabsName" type="card" @on-click="tabsChange">
        <TabPane label="单选题" v-if="tabsNames.name1" name="name1">
          <Card dis-hover :style="{height:'460px',overflow:'auto'}">
            <Form
              :label-width="60"
              ref="_TopicFormData"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <FormItem label="题目" prop="topicTitle">
                <Input
                  type="textarea"
                  placeholder="单选题"
                  v-model="TopicFormData.topicTitle"
                  :autosize="{minRows: 2,maxRows: 5}"
                />
              </FormItem>

              <FormItem label="答案" prop="topicAnswer">
                <Select v-model="TopicFormData.topicAnswer" clearable>
                  <Option
                    v-for="item in formItems"
                    :value="item.topicOptions"
                    :key="item.id"
                  >{{ item.topicOptions }}</Option>
                </Select>
              </FormItem>

              <FormItem label="分数" prop="topicFraction">
                <Input v-model="TopicFormData.topicFraction" />
              </FormItem>

              <FormItem label="选项" v-for="item in formItems" :key="item.id">
                <Input type="text" v-model="item.topicValue">
                  <span slot="prepend" class="prepend">
                    <Input
                      type="text"
                      v-model="item.topicOptions"
                      style="width: 40px"
                      size="small"
                    />
                  </span>
                  <Button
                    slot="append"
                    icon="ios-trash"
                    @click="delFormItems(item.id,'formItems')"
                  />
                </Input>
              </FormItem>
            </Form>
          </Card>
          <div class="footer">
            <Button @click="addFormItems('formItems')">添加</Button>
            <Button
              type="primary"
              :disabled="submitStatus"
              @click="InsertTopic('单选题','_TopicFormData')"
            >提交</Button>
          </div>
        </TabPane>
        <TabPane label="多选题" v-if="tabsNames.name2" name="name2">
          <Card dis-hover :style="{height:'460px',overflow:'auto'}">
            <Form
              :label-width="60"
              ref="_multipleFormItems"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <FormItem label="题目" prop="topicTitle">
                <Input
                  type="textarea"
                  placeholder="多选题"
                  v-model="TopicFormData.topicTitle"
                  :autosize="{minRows: 2,maxRows: 5}"
                />
              </FormItem>

              <FormItem label="答案" prop="topicAnswer">
                <Select v-model="TopicFormData.topicAnswer" multiple>
                  <Option
                    v-for="item in multipleFormItems"
                    :value="item.topicOptions"
                    :key="item.id"
                  >{{ item.topicOptions }}</Option>
                </Select>
              </FormItem>

              <FormItem label="分数" prop="topicFraction">
                <Input v-model="TopicFormData.topicFraction" />
              </FormItem>

              <FormItem v-for="item in multipleFormItems" :key="item.id">
                <Input type="text" v-model="item.topicValue">
                  <span slot="prepend" class="prepend">
                    <Input
                      type="text"
                      v-model="item.topicOptions"
                      style="width: 40px"
                      size="small"
                    />
                  </span>
                  <Button
                    slot="append"
                    icon="ios-trash"
                    @click="delFormItems(item.id,'multipleFormItems')"
                  />
                </Input>
              </FormItem>
            </Form>
          </Card>
          <div class="footer">
            <Button @click="addFormItems('multipleFormItems')">添加</Button>
            <Button
              type="primary"
              :disabled="submitStatus"
              @click="InsertTopic('多选题','_multipleFormItems')"
            >提交</Button>
          </div>
        </TabPane>
        <TabPane label="判断题" v-if="tabsNames.name3" name="name3">
          <Card dis-hover :style="{height:'460px',overflow:'auto'}">
            <Form :label-width="60" ref="TrueOrFalse" :model="TopicFormData" :rules="ruleValidate">
              <FormItem label="题目" prop="topicTitle">
                <Input
                  type="textarea"
                  placeholder="判断题"
                  v-model="TopicFormData.topicTitle"
                  :autosize="{minRows: 2,maxRows: 5}"
                />
              </FormItem>

              <FormItem label="答案" prop="topicAnswer">
                <Select v-model="TopicFormData.topicAnswer" clearable>
                  <Option
                    v-for="item in TrueOrFalses"
                    :value="item.topicOptions"
                    :key="item.id"
                  >{{ item.topicOptions }}</Option>
                </Select>
              </FormItem>

              <FormItem label="分数" prop="topicFraction">
                <Input v-model="TopicFormData.topicFraction" />
              </FormItem>

              <FormItem v-for="item in TrueOrFalses" :key="item.id">
                <Input type="text" v-model="item.topicValue">
                  <span slot="prepend" class="prepend">
                    <Input
                      type="text"
                      v-model="item.topicOptions"
                      style="width: 40px"
                      size="small"
                    />
                  </span>
                </Input>
              </FormItem>
            </Form>
          </Card>
          <div class="footer">
            <Button
              type="primary"
              :disabled="submitStatus"
              @click="InsertTopic('判断题','TrueOrFalse')"
            >提交</Button>
          </div>
        </TabPane>
        <TabPane label="填空题" v-if="tabsNames.name4" name="name4">
          <Card dis-hover :style="{height:'460px',overflow:'auto'}">
            <Form
              :label-width="60"
              ref="FillInTheBlanks"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <FormItem label="题目" prop="topicTitle">
                <Input
                  type="textarea"
                  placeholder="填空题"
                  v-model="TopicFormData.topicTitle"
                  :autosize="{minRows: 2,maxRows: 5}"
                />
              </FormItem>

              <FormItem label="分数" prop="topicFraction">
                <Input v-model="TopicFormData.topicFraction" />
              </FormItem>

              <FormItem label="答案" prop="topicAnswer">
                <Input v-model="TopicFormData.topicAnswer" clearable />
              </FormItem>
            </Form>
          </Card>
          <div class="footer">
            <Button
              type="primary"
              :disabled="submitStatus"
              @click="InsertTopic('填空题','FillInTheBlanks')"
            >提交</Button>
          </div>
        </TabPane>
        <TabPane label="简答题" v-if="tabsNames.name5" name="name5">
          <Card dis-hover :style="{height:'460px',overflow:'auto'}">
            <Form
              :label-width="60"
              ref="ShortAnsweRQuestions"
              :model="TopicFormData"
              :rules="ruleValidate"
            >
              <FormItem label="题目" prop="topicTitle">
                <Input
                  type="textarea"
                  v-model="TopicFormData.topicTitle"
                  placeholder="简答题"
                  :autosize="{minRows: 2,maxRows: 5}"
                />
              </FormItem>

              <FormItem label="分数" prop="topicFraction">
                <Input v-model="TopicFormData.topicFraction" />
              </FormItem>

              <FormItem label="参考答案" prop="topicAnswer">
                <Input
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                  v-model="TopicFormData.topicAnswer"
                  clearable
                />
              </FormItem>
            </Form>
          </Card>
          <div class="footer">
            <Button
              type="primary"
              :disabled="submitStatus"
              @click="InsertTopic('简答题','ShortAnsweRQuestions')"
            >提交</Button>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>
<script>
import {
  SelectTopic,
  InsertTopic,
  DeleteTopic,
  UpdateTopic,
  SelectTopicDetailByTopicID
} from "@/api/KS_Topic";
import { uuid } from "@/utils";
export default {
  name: "questionbank",
  data() {
    return {
      listLoading: true,
      ModalTitle: "录制题目",
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        topicTitle: "",
        topicType: ""
      },
      modalShow: false,
      tabsName: "name1",
      tabsNames: {
        name1: true,
        name2: true,
        name3: true,
        name4: true,
        name5: true
      },
      total: 0,
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
      formItems: [
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: "",
          topicValue: ""
        }
      ],
      multipleFormItems: [
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: "",
          topicValue: ""
        }
      ],
      TrueOrFalses: [
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: "",
          topicValue: ""
        },
        {
          id: uuid(),
          ID: 0,
          topicID: 0,
          topicOptions: "",
          topicValue: ""
        }
      ],
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "试题内容",
          key: "topicTitle"
        },
        {
          title: "试题答案",
          key: "topicAnswer"
        },
        {
          title: "试题类型",
          align: "center",
          key: "topicType"
        },
        {
          title: "试题分数",
          align: "center",
          key: "topicFraction"
        },
        {
          title: "操作",
          slot: "action",
          width: 140
        }
      ],
      tableData: [],
      TopicFormData: {
        topicID: 0,
        topicTitle: "",
        topicType: "",
        topicAnswer: "",
        topicFraction: 0,
        topic_Contents: []
      },
      submitStatus: false,
      ruleValidate: {
        topicTitle: [{ required: true, message: "请填写题目" }],
        topicAnswer: [
          {
            required: true,
            message: "请选择答案"
          }
        ],
        topicFraction: [{ required: true, message: "请设置分数" }]
      }
    };
  },
  mounted() {
    this.SelectTopic();
  },
  methods: {
    async DeleteTopic(row) {
      const { topicID } = row;
      const { msg } = await DeleteTopic({ topicID });
      this.$Message.info(msg);
      this.clickSelectTopicr();
    },
    async UpdateTopic(row) {
      this.tabsNames = {
        name1: false,
        name2: false,
        name3: false,
        name4: false,
        name5: false
      };
      this.ModalTitle = "编辑题目:" + row.topicTitle;
      const { data } = await SelectTopicDetailByTopicID({
        topicID: row.topicID
      });
      const {
        topicType,
        topicTitle,
        topicAnswer,
        topicFraction,
        topicID,
        topic_Contents
      } = data;
      const TabPanelabels = ["单选题", "多选题", "判断题", "填空题", "简答题"];
      const TabPaneNames = ["name1", "name2", "name3", "name4", "name5"];
      const typeIndex = TabPaneNames[TabPanelabels.indexOf(topicType)];
      this.tabsName = typeIndex;
      this.tabsNames[typeIndex] = true;
      this.modalShow = true;
      this.TopicFormData = {
        topicID,
        topicTitle,
        topicType,
        topicAnswer,
        topicFraction,
        topic_Contents
      };
      switch (topicType) {
        case "单选题":
          topic_Contents.map(item => {
            item.id = uuid();
          });
          this.formItems = topic_Contents;
          break;
        case "多选题":
          topic_Contents.map(item => {
            item.id = uuid();
          });
          this.TopicFormData.topicAnswer = this.TopicFormData.topicAnswer.split(
            ","
          );
          this.multipleFormItems = topic_Contents;
          break;
        case "判断题":
          topic_Contents.map(item => {
            item.id = uuid();
          });
          this.TrueOrFalses = topic_Contents;
          break;
        default:
          break;
      }
    },
    InsertTopic(type, name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          const {
            TopicFormData: {
              topicTitle,
              topicAnswer,
              topicFraction,
              topicID,
              topic_Contents
            }
          } = this;
          const TabPanelabels = ["单选题", "多选题", "判断题"];
          const formData = {
            topicID: topicID || 0,
            topicTitle,
            topicType: type,
            topicAnswer: Array.isArray(topicAnswer)
              ? topicAnswer.join(",")
              : topicAnswer,
            topicFraction,
            topic_Contents: TabPanelabels.includes(type)
              ? this.SelectTopicType(type).map(item => {
                  return {
                    ID: item.ID || 0,
                    topicID: item.topicID || 0,
                    topicOptions: item.topicOptions,
                    topicValue: item.topicValue
                  };
                })
              : [
                  {
                    ID: (topic_Contents[0] && topic_Contents[0].ID) || 0,
                    topicID:
                      (topic_Contents[0] && topic_Contents[0].topicID) || 0,
                    topicOptions: topicAnswer,
                    topicValue: ""
                  }
                ]
          };
          try {
            this.submitStatus = true;
            const { msg } =
              this.ModalTitle === "录制题目"
                ? await InsertTopic(formData)
                : await UpdateTopic(formData);
            this.$Message.info(msg);
          } catch (error) {
            this.$Message.error(error);
          } finally {
            this.submitStatus = false;
          }

          this.clickSelectTopicr();
          this.restFormData(name);
          this.modalShow = false;
        } else {
          this.$Message.error("你有必填项没填写");
        }
      });
    },
    SelectTopicType(name) {
      const { formItems, multipleFormItems, TrueOrFalses } = this;
      switch (name) {
        case "单选题":
          return formItems;
          break;
        case "多选题":
          return multipleFormItems;
          break;
        case "判断题":
          return TrueOrFalses;
          break;

        default:
          break;
      }
    },
    restFormData(name) {
      this.TopicFormData = {
        opicID: 0,
        topicTitle: "",
        topicType: "",
        topicAnswer: "",
        topicFraction: 0,
        topic_Contents: []
      };
      this.multipleFormItems = [
        {
          id: uuid(),
          topicID: 0,
          topicOptions: "",
          topicValue: ""
        }
      ];
      this.formItems = [
        {
          id: uuid(),
          topicID: 0,
          topicOptions: "",
          topicValue: ""
        }
      ];
      this.$refs[name] && this.$refs[name].resetFields();
    },
    async SelectTopic() {
      try {
        const { data } = await SelectTopic(this.listQuery);
        this.total = data.Total;
        this.tableData = data.DataList;
        this.listLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async clickSelectTopicr() {
      this.listLoading = true;
      this.listQuery.pageIndex = 1;
      this.SelectTopic();
    },
    handleCurrentChange(val) {
      this.listLoading = true;
      this.listQuery.pageIndex = val;
      this.SelectTopic();
    },
    handleSizeChange(val) {
      this.listLoading = true;
      this.listQuery.pageSize = val;
      this.clickSelectTopicr();
    },
    openModel() {
      this.tabsNames = {
        name1: true,
        name2: true,
        name3: true,
        name4: true,
        name5: true
      };
      this.tabsName = "name1";
      this.ModalTitle = "录制题目";
      this.modalShow = true;
    },
    submit() {},
    cancel() {
      this.restFormData();
    },
    tabsChange(x) {
      this.restFormData();
    },
    addFormItems(formInfo) {
      this[formInfo].push({
        id: uuid(),
        ID: 0,
        topicID: 0,
        topicOptions: "",
        topicValue: ""
      });
    },
    delFormItems(id, formInfo) {
      this[formInfo].forEach((item, index) => {
        if (item.id === id) {
          this[formInfo].splice(index, 1);
        }
      });
    }
  }
};
</script>

<style scoped>
.questionbank /deep/ .ivu-card-head {
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
.questionbank {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>