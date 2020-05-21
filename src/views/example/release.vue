<template>
  <div class="release">
    <Card :bordered="false">
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline size="mini">
          <FormItem>
            <Input placeholder="任务名称" v-model="listQuery.paperTitle" />
          </FormItem>
          <FormItem>
            <Input placeholder="出卷人" v-model="listQuery.Unwinder" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickSelectTask()">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <Table border :columns="columns" size="small" :data="tableData" height="710">
          <template slot-scope="{ row }" slot="starDate">{{row.starDate.replace('T',' ')}}</template>
          <template slot-scope="{ row }" slot="endDate">{{row.endDate.replace('T',' ')}}</template>
          <template slot-scope="{ row }" slot="taskType">
            <Tag color="warning" v-if="row.taskType === 1">补考</Tag>
            <Tag color="success" v-else>正式考试</Tag>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="UpdateTask(row,index)"
            >修改</Button>
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
                :check-strictly="checkStrictly"
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
        <Button @click="modalShowR=false">取消</Button>
        <Button type="primary" @click="submitR()">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { SelectTask, UpdateTask } from "@/api/KS_Paper";
import { SelectDeptorUser } from "@/api/User";

export default {
  name: "release",
  data() {
    return {
      modalShowR: false,
      modalTitleR: "编辑考试任务",
      listLoading: false,
      modalShowR: false,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        taskName: "",
        DeptID: 0,
        Uid: sessionStorage.getItem('userID'),
        taskType: ""
      },
      tableData: [],
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "任务名称",
          key: "taskName",
          minWidth: 200
        },
        {
          title: "考试者",
          key: "UserName",
          minWidth: 200
        },
        {
          title: "开始时间",
          slot: "starDate",
          key: "starDate",
          align: "center",
          width: 180
        },
        {
          title: "结束时间",
          slot: "endDate",
          key: "endDate",
          align: "center",
          width: 180
        },
        {
          title: "任务类型",
          slot: "taskType",
          key: "taskType",
          align: "center",
          width: 120
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 120
        }
      ],
      ruleValidate: {
        taskName: [{ required: true, message: "请填写任务名称" }],
        starDate: [{ required: true, message: "请选择开始时间" }],
        endDate: [{ required: true, message: "请选择结束时间" }],
        taskType: [{ required: true, message: "请设置任务类型" }]
      },
      taskFormData: {
        taskID: 0,
        taskName: "",
        paperID: 0,
        starDate: "",
        endDate: "",
        createDate: new Date(),
        DeptIDs: "",
        Uids: sessionStorage.getItem('userID'),
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
      checkStrictly: false,
      deptsTree: [],
      usersTree: [],
      names: "",
      row:null
    };
  },
  created() {
    this.SelectTask();
    this.SelectDeptorUser();
  },
  methods: {
    submitR() {
      this.$refs["taskFormData"].validate(async v => {
        if (v) {
          try {
            const starDate = Date.parse(new Date(this.taskFormData.starDate));
            const endDate = Date.parse(new Date(this.taskFormData.endDate));
            const extime = this.row.extime * 60000;
            if (endDate < starDate + extime) {
              this.$Message.info('请设置考试结束时间大于等于开始时间加试卷时长');
              return;
            }
            const Uids = [];
            const usersTree = this.$refs.usersTree.getCheckedNodes();
            usersTree.forEach(item => {
              if (item.ID === item.UserID) {
                Uids.push(item.UserID);
              }
            });
            const form = this.taskFormData;
            form.Uids = Uids.join(",");
            const { msg } = await UpdateTask(form);
            this.$Message.info(msg);
            this.modalShowR = false;
          } catch (error) {
            this.$Message.error(error);
          } finally {
            this.SelectTask()
          }
        } else {
          this.$Message.error("你有必填项没填写");
        }
      });
    },
    UpdateTask(row) {
      const {
        taskID,
        taskName,
        starDate,
        endDate,
        taskType,
        Uids,
        UserName,
        paperID
      } = row;
      this.taskFormData = {
        taskID,
        taskName,
        starDate,
        endDate,
        taskType,
        Uids,
        paperID
      };
      this.SelectDeptorUser();
      this.row = row
      this.names = UserName;
      this.modalTitleR = "编辑考试任务:" + taskName;
      this.modalShowR = true;
    },
    onChangeDateS(r) {
      this.taskFormData.starDate = r;
    },
    onChangeDateE(r) {
      this.taskFormData.endDate = r;
    },
    onTreeCheckChange(data) {
      // console.log(data)
      const names = [];
      data.forEach(item => {
        names.push(item.Name);
      });
      this.names = names.join(",");
    },
    async SelectDeptorUser() {
      const { data } = await SelectDeptorUser();
      this.usersTree = this.usersDeep(data);
    },
    usersDeep(data) {
      const arr = [];
      const Uids = this.taskFormData.Uids.split(",").map(item =>
        parseInt(item)
      );
      data.forEach(item => {
        let items = {};
        if (Uids.includes(item.UserID)) {
          item.checked = true;
        }
        items = { ...item };
        if (item.children && item.children.length > 0) {
          items.children = this.usersDeep(item.children);
        }
        arr.push(items);
      });
      return arr;
    },
    renderContent(h, { root, node, data }) {
      return h("span", [h("span", [h("span", data.Name)])]);
    },
    async SelectTask() {
      try {
        this.listLoading = true;
        const { data } = await SelectTask(this.listQuery);
        this.total = data.Total;
        this.tableData = data.DataList;
      } catch (error) {
        console.log(error);
      } finally {
        this.listLoading = false;
      }
    },
    async clickSelectTask() {
      this.listQuery.pageIndex = 1;
      this.SelectTask();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.SelectTask();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.clickSelectTask();
    }
  }
};
</script>

<style scoped>
.release /deep/ .ivu-card-head {
  border-bottom: 1px solid #e8eaec;
  padding: 6px 10px !important;
  line-height: 1;
}

.Checkbox /deep/ .ivu-checkbox-group-item {
  display: block !important;
  margin: 2px 0;
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
.release {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>