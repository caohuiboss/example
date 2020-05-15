<template>
  <div class="home">
    <Card dis-hover>Home</Card>
  </div>
</template>
<script>
export default {
  name: "Home",
  created() {
    sessionStorage.setItem("userID", this.$route.query.userID || 1001);
  }
};
</script>
<style scoped>
.home /deep/ .ivu-card-head {
  border-bottom: 1px solid #e8eaec;
  padding: 6px 10px !important;
  line-height: 1;
}
</style>

<style lang='scss' scoped>
.home {
  .ivu-form-item {
    margin-bottom: 0px;
    vertical-align: top;
    zoom: 1;
  }
}
</style>