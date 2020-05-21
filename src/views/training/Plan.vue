<template>
  <div class="Plan">
    <Card :bordered="false">
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline size="mini">
          <FormItem>
            <Button type="primary" @click="openModel" :disabled="modalShow">发布培训</Button>
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
          <template slot-scope="{ row }" slot="trainDate">{{row.trainDate.replace('T',' ')}}</template>
          <template slot-scope="{ row }" slot="trainType">
            <Tag color="warning" v-if="row.trainType === 0">线上</Tag>
            <Tag color="success" v-else>线下</Tag>
          </template>
          <template slot-scope="{ row }" slot="createDate">{{row.createDate.replace('T',' ')}}</template>
          <template slot-scope="{ row }" slot="applyState">{{row.applyState === 0?'未报名':'已报名'}}</template>
          <template slot-scope="{ row, index }" slot="SignUp">
            <Button
              :type="row.applyState === 0?'primary':'warning'"
              size="small"
              style="margin-right: 5px"
              @click="UpdateApplyState(row)"
            >{{row.applyState === 0?'报名':'取消报名'}}</Button>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              v-if="row.applyState === 1"
              @click="SelectTopicDetailByPlanID(row)"
            >详情</Button>
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="UpdateTopic(row)"
            >编辑</Button>
            <Button
              type="error"
              size="small"
              style="margin-right: 5px"
              @click="DeleteTopic(row,index)"
            >删除</Button>
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
      :mask-closable="false"
      :title="modalTitle"
      @on-cancel="onCancel"
      :footer-hide="detail"
      mask
      scrollable
      width="600"
    >
      <Form ref="planFormData" :model="planFormData" :rules="ruleValidate">
        <FormItem label="培训名称" prop="planName">
          <Input placeholder="培训名称" v-model="planFormData.planName" :disabled="detail" />
        </FormItem>
        <FormItem label="选择课件" prop="coursewareId">
          <Select
            v-model="planFormData.coursewareId"
            multiple
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="coursewareLoading"
            :disabled="detail"
          >
            <Option
              v-for="(option, index) in coursewares"
              :value="option.coursewareID"
              :key="option.coursewareID"
            >{{option.coursewareName}}</Option>
          </Select>
        </FormItem>
        <Row type="flex" :gutter="8">
          <Col span="6">
            <FormItem label="培训时间" prop="trainDate">
              <DatePicker
                v-model="planFormData.trainDate"
                :disabled="detail"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value="yyyy-MM-dd HH:mm"
                placeholder="培训时间"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="主讲人" prop="keynoteUser">
              <Input placeholder="主讲人" v-model="planFormData.keynoteUser" :disabled="detail" />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="培训地点" prop="Site">
              <Input placeholder="培训地点" v-model="planFormData.Site" :disabled="detail" />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="任务类型" prop="trainType">
              <Select v-model="planFormData.trainType" placeholder="任务类型" :disabled="detail">
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
            <Card dis-hover :style="{height:'300px',overflow:'auto'}">
              <div slot="title">培训人员列表</div>
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
            <Card dis-hover :style="{height:'300px',overflow:'auto'}">
              <div slot="title">{{ !detail? '已选中人员列表':'附件列表点击下载'}}</div>
              <div v-if="!detail">{{names}}</div>
              <div v-else>
                <Table
                  border
                  :columns="fileListColumns"
                  size="small"
                  :data="fileListTable"
                  @on-row-click="downloadFileList"
                ></Table>
              </div>
            </Card>
          </Col>
        </Row>
        <FormItem label="培训内容" prop="planContent">
          <Input
            type="textarea"
            placeholder="培训内容"
            v-model="planFormData.planContent"
            :disabled="detail"
          />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button style="margin-right: 5px" @click="onCancel()">取消</Button>
        <Button type="primary" style="margin-right: 5px" @click="InsertPlan()">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  InsertPlan,
  SelectPlan,
  SelectPlanDetailByPlanID,
  DeletePlan,
  UpdatePlan
} from "@/api/PX_Plan.js";

import { SelectCourseWare } from "@/api/PX_CourseWare";
import { UpdateApplyState } from "@/api/PX_Apply";

import { SelectDeptorUser } from "@/api/User";

import { IP } from "@/setting.js";

export default {
  name: "Plan",
  data() {
    return {
      IP,
      listLoading: true,
      detail: false,
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        planName: "",
        trainType: "",
        UserId: sessionStorage.getItem("userID")
      },
      total: 0,
      modalShow: false,
      modalTitle: "新增培训计划",
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "培训名称",
          key: "planName",
          minWidth: 200
        },
        {
          title: "培训类型",
          key: "trainType",
          slot: "trainType",
          align: "center",
          width: 100
        },
        {
          title: "培训对象",
          key: "f_GetUserNames(Uids)",
          minWidth: 200
        },
        {
          title: "培训时间",
          slot: "trainDate",
          align: "center",
          key: "trainDate",
          width: 180
        },
        {
          title: "报名状态",
          slot: "applyState",
          align: "center",
          key: "applyState",
          width: 100
        },
        {
          title: "报名",
          slot: "SignUp",
          align: "center",
          fixed: "right",
          width: 100
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          fixed: "right",
          width: 200
        }
      ],
      tableData: [],
      fileListTable: [],
      fileListColumns: [
        {
          title: "附件名称",
          key: "Title",
          minWidth: 130
        }
      ],
      planFormData: {
        planId: 0,
        coursewareId: "",
        planName: "",
        planContent: "",
        trainDate: "",
        trainType: 0,
        CreateDate: new Date(),
        Site: "",
        keynoteUser: "",
        Uids: ""
      },
      ruleValidate: {
        planName: [{ required: true, message: "请填写培训名称" }],
        planContent: [{ required: true, message: "请填写培训内容" }],
        trainDate: [{ required: true, message: "请设置培训时间" }],
        Site: [{ required: true, message: "请填写培训地点" }],
        trainType: [{ required: true, message: "请选择培训类型" }],
        keynoteUser: [{ required: true, message: "请填写主讲人" }]
      },
      taskTypeList: [
        {
          label: "线上",
          value: 0
        },
        {
          label: "线下",
          value: 1
        }
      ],
      coursewares: [],
      coursewareLoading: false,
      usersTree: [],
      names: ""
    };
  },
  async created() {
    this.SelectPlan();
    this.SelectDeptorUser();
    const listQuery = {
      pageIndex: 1,
      pageSize: 100,
      Title: "",
      coursewareName: ""
    };
    const { data } = await SelectCourseWare(listQuery);
    this.coursewares = data.DataList;
  },
  methods: {
    downloadFileList(row) {
      window.location.href = `${IP}/TIANSENSEAPI/Annex/file/${row.Title}`;
    },
    onCancel() {
      this.detail = false;
      this.modalShow = false;
      this.restPlanFormData();
    },
    async SelectTopicDetailByPlanID({ planId, planName }) {
      const { data } = await SelectPlanDetailByPlanID({ planId });
      this.planFormData = data;
      this.fileListTable = data.courseware_Contents[0].File_content;
      this.planFormData.coursewareId = this.planFormData.coursewareId
        .split(",")
        .map(item => parseInt(item));
      this.modalTitle = "详情：" + planName;
      this.SelectDeptorUser();
      this.detail = true;
      this.modalShow = true;
    },
    async UpdateApplyState(row) {
      const state = row.applyState === 0 ? "报名" : "取消报名";
      this.$Modal.confirm({
        title: "提示",
        content: `是否${state}：${row.planName}`,
        onOk: async () => {
          const form = {
            planID: row.planId,
            applyState: row.applyState === 0 ? 1 : 0,
            UserID: sessionStorage.getItem("userID")
          };
          const { msg } = await UpdateApplyState(form);
          this.$Message.info(msg);
          this.SelectPlan();
        },
        onCancel: () => {
          const state = row.applyState === 1 ? "报名" : "取消报名";
          this.$Message.info(state);
        }
      });
    },
    async InsertApply({ planId }) {
      this.$Modal.confirm({
        title: "警告",
        content: `是否发布：${planName}`,
        onOk: async () => {
          const { msg } = await InsertApply({ planId });
          this.$Message.info(msg);
          this.SelectPlan();
        },
        onCancel: () => {
          this.$Message.info("取消发布");
        }
      });
    },
    DeleteTopic(row) {
      const { planId, planName } = row;
      this.$Modal.confirm({
        title: "警告",
        content: `是否删除：${planName}`,
        onOk: async () => {
          const { msg } = await DeletePlan({ planId });
          this.$Message.info(msg);
          this.SelectPlan();
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    },
    async UpdateTopic({ planId, planName }) {
      const { data } = await SelectTopicDetailByPlanID({ planId });
      this.planFormData = data;
      this.planFormData.coursewareId = this.planFormData.coursewareId
        .split(",")
        .map(item => parseInt(item));
      this.modalTitle = "编辑：" + planName;
      this.SelectDeptorUser();
      this.modalShow = true;
    },
    InsertPlan() {
      this.$refs["planFormData"].validate(async v => {
        if (v) {
          const Uids = [];
          const usersTree = this.$refs.usersTree.getCheckedNodes();
          usersTree.forEach(item => {
            if (item.ID === item.UserID) {
              Uids.push(item.UserID);
            }
          });
          const form = this.planFormData;
          form.Uids = Uids.join(",");
          form.coursewareId = form.coursewareId.join(",");
          const { msg } =
            this.modalTitle === "新增培训计划"
              ? await InsertPlan(form)
              : await UpdatePlan(form);
          this.$Message.info(msg);
          this.modalShow = false;
          this.SelectPlan();
        } else {
          this.$Message.error("你有必填项没填写");
        }
      });
    },
    openModel() {
      this.modalTitle = "新增培训计划";
      this.restPlanFormData();
      this.SelectDeptorUser();
      this.modalShow = true;
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
      this.usersTree = this.usersDeep(data);
    },
    usersDeep(data) {
      const arr = [];
      const Uids =
        this.planFormData.Uids.split(",").map(item => parseInt(item)) || [];
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
    restPlanFormData() {
      this.planFormData = {
        planId: 0,
        coursewareId: "",
        planName: "",
        planContent: "",
        trainDate: "",
        trainType: 0,
        CreateDate: new Date(),
        Site: "",
        keynoteUser: "",
        Uids: ""
      };
      this.$refs.planFormData.resetFields();
    },
    async remoteMethod(query) {
      if (query !== "") {
        try {
          const listQuery = {
            pageIndex: 1,
            pageSize: 1500,
            Title: "",
            coursewareName: query
          };
          this.coursewareLoading = true;
          const { data } = await SelectCourseWare(listQuery);
          this.coursewares = data.DataList;
        } catch (error) {
          this.coursewares = [];
        } finally {
          this.coursewareLoading = false;
        }
      } else {
        this.coursewares = [];
      }
    },
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
.Plan {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>