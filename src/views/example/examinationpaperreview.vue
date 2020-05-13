<template>
  <div class="examinationpaperreview">
    <Card :bordered="false" dis-hover>
      <div slot="title">
        <Form ref="formInline" :model="formInline" inline>
          <FormItem prop="user">
            <Input type="text" v-model="formInline.user" />
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formInline')">搜索</Button>
          </FormItem>
        </Form>
      </div>
      <div>
        <Table border size="small" :columns="columns" :data="tableData" height="710px"></Table>
        <Page :total="100" show-sizer show-elevator show-total :style="{margin:'8px 0'}" />
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
    >等级考试-手术刀卷</Modal>
  </div>
</template>
<script>
export default {
  name: "examinationpaperreview",
  data() {
    return {
      formInline: {
        user: "",
        password: ""
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
          key: "age"
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
          title: "考试时间",
          key: "name",
          width: 180,
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          align: "center",
          width: 180,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.showSee(params);
                    }
                  }
                },
                "阅卷"
              )
            ]);
          }
        }
      ],
      tableData: []
    };
  },
  methods: {
    handleSubmit() {},
    openModel() {
      this.modalShow = true;
    },
    showSee(params) {
      console.log(params);
      this.modalShow = true;
    },
    submit() {},
    cancel() {
      console.log(1);
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