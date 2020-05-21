<template>
  <div class="CourseWare">
    <Card :bordered="false">
      <div slot="title">
        <Form ref="listQuery" :model="listQuery" inline size="mini">
          <FormItem>
            <Button type="primary" @click="openModel" :disabled="modalShow">制作课件</Button>
          </FormItem>
          <FormItem>
            <Input placeholder="课件名称" v-model="listQuery.coursewareName" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="clickSelectCourseWare('listQuery')">搜索</Button>
          </FormItem>
        </Form>
      </div>

      <div>
        <Table border :columns="columns" size="small" :data="tableData" height="710">
          <template slot-scope="{ row }" slot="createDate">{{row.createDate.replace('T',' ')}}</template>
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="UpdateCourseWare(row)"
            >编辑</Button>
            <Button
              type="error"
              size="small"
              style="margin-right: 5px"
              @click="DeleteCourseWare(row)"
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
      mask
      scrollable
      @on-ok="InsertCourseWare"
    >
      <Form ref="CourseWareFormData" :model="CourseWareFormData" :rules="ruleValidate">
        <Row type="flex" :gutter="16">
          <Col span="18">
            <FormItem label="课件名称" prop="coursewareName">
              <Input v-model="CourseWareFormData.coursewareName" />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="上传附件">
              <Upload
                multiple
                :show-upload-list="false"
                :action="`${IP}/api/PX_CourseWare/UploadFile`"
                :on-success="onSuccess"
              >
                <Button icon="ios-cloud-upload-outline">上传附件</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Card dis-hover :style="{height:'410px',overflow:'auto'}">
        <Table
          border
          :columns="fileListColumns"
          size="small"
          :data="CourseWareFormData.File_content"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button
              type="success"
              size="small"
              style="margin-right: 5px"
              @click="removeFileList(row)"
            >移除</Button>
          </template>
        </Table>
      </Card>
    </Modal>
  </div>
</template>
<script>
import { IP } from '@/setting.js'
import {
  InsertCourseWare,
  SelectCourseWare,
  SelectCourseWareDetailByID,
  DeleteCourseWare,
  UpdateCourseWare,
  ConvertWordToPdf,
  UploadFile
} from "@/api/PX_CourseWare";

export default {
  name: "CourseWare",
  data() {
    return {
      listLoading: true,
      IP,
      modalTitle: "",
      listQuery: {
        pageIndex: 1,
        pageSize: 15,
        Title: "",
        coursewareName: ""
      },
      total: 0,
      modalShow: false,
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "课件标题",
          key: "coursewareName",
          minWidth: 300
        },
        {
          title: "创建时间",
          key: "createDate",
          slot: "createDate",
          align: "center",
          width: 160
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 140
        }
      ],
      fileListColumns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "附件名称",
          key: "Title"
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          width: 140
        }
      ],
      tableData: [],
      File_content: [],
      CourseWareFormData: {
        Id: 0,
        coursewareID: 0,
        coursewareName: "",
        createDate: new Date(),
        File_content: []
      },
      ruleValidate: {
        coursewareName: [
          {
            required: true,
            message: "请填写课件名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.SelectCourseWare();
    // console.log(this.$isServer)
  },
  methods: {
    DeleteCourseWare(row) {
      const { coursewareID } = row;
      this.$Modal.confirm({
        title: "警告",
        content: `是否删除：${row.coursewareName}`,
        onOk: async () => {
          const { msg } = await DeleteCourseWare({ coursewareID });
          this.$Message.info(msg);
          this.SelectCourseWare();
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
    },
    removeFileList(row) {
      const { Title } = row;
      this.CourseWareFormData.File_content.forEach((item, index) => {
        if (Title === item.Title) {
          this.CourseWareFormData.File_content.splice(index, 1);
        }
      });
    },
    onSuccess(response, file, fileList) {
      const { data } = response;
      this.CourseWareFormData.File_content.push(data[0]);
    },
    async UpdateCourseWare(row) {
      const { data } = await SelectCourseWareDetailByID({
        coursewareID: row.coursewareID
      });
      this.CourseWareFormData = data;
      this.modalTitle = "编辑课件：" + row.coursewareName;
      this.modalShow = true;
    },
    async InsertCourseWare() {
      this.$refs["CourseWareFormData"].validate(async v => {
        if (v) {
          const form = this.CourseWareFormData;
          const { msg } =
            this.modalTitle === "新增课件"
              ? await InsertCourseWare(form)
              : await UpdateCourseWare(form);
          this.$Message.info(msg);
          this.SelectCourseWare();
        } else {
          this.$Message.error("你有必填项没填写");
        }
      });
    },
    openModel() {
      this.modalTitle = "新增课件";
      this.modalShow = true;
      this.restCourseWareFormData();
    },
    restCourseWareFormData() {
      this.CourseWareFormData = {
        Id: 0,
        coursewareID: 0,
        coursewareName: "",
        createDate: new Date(),
        File_content: []
      };
      this.$refs.CourseWareFormData.resetFields();
    },
    clickSelectCourseWare() {
      this.listQuery.pageIndex = 1;
      this.SelectCourseWare();
    },
    async SelectCourseWare() {
      try {
        this.listLoading = true;
        const { data } = await SelectCourseWare(this.listQuery);
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
      this.SelectCourseWare();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.SelectCourseWare();
    }
  }
};
</script>

<style lang='scss' scoped>
.CourseWare {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>