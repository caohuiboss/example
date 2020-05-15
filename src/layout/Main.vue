<template>
  <div class="layout">
    <Layout>
      <Sider
        ref="side1"
        hide-trigger
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
        :style="{ height: '100vh', overflow: 'auto' }"
      >
        <Menu
          :active-name="activeName"
          :open-names="['考试系统']"
          theme="dark"
          width="auto"
          :class="menuitemClasses"
          accordion
        >
          <MenuItem name="1-1" :disabled="true" v-show="!isCollapsed">
            <h3>天智考试培训系统</h3>
          </MenuItem>
          <!-- <template v-for="item in menus">
            <MenuItem :name="item.path" :key="item.path + item.title" :to="item.path">
              <Icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </MenuItem>
          </template>-->
          <Submenu :name="item.title" v-for="item in menus" :key="item.path">
            <template slot="title">
              <Icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <MenuItem :name="it.path" :key="it.title" :to="it.path" v-for="it in item.children">
              <Icon :type="it.icon" />
              <span>{{ it.title }}</span>
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{ padding: 0 }" class="layout-header-bar">
          <Row>
            <Col span="23">
              <Icon
                @click.native="collapsedSider"
                :class="rotateIcon"
                :style="{ margin: '0 20px' }"
                type="md-menu"
                size="24"
              />
            </Col>
            <Col span="1">
              <Dropdown>
                <Avatar shape="square" :src="avatar" icon="ios-person" size="large" />
                <DropdownMenu slot="list">
                  <DropdownItem>用户信息</DropdownItem>
                  <DropdownItem>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content :style="{ margin: '4px', background: '#fff' }">
          <div class="target-view">
            <router-link
              tag="div"
              class="item-view"
              v-for="(item) in routers"
              :class="item[0] === $route.name && 'is-active'"
              :key="item[0]"
              :to="item[1].path"
            >
              <div class="item-view-flex">
                <span>{{ item[1].title }}</span>
                <Icon
                  type="ios-close"
                  class="item-icon"
                  v-if="item[0] !== 'home'"
                  @click.stop="spliceItemView(item[0])"
                />
              </div>
            </router-link>
            <div class="close-all-item" @click="closeAllItem">
              <Icon type="md-close" />
            </div>
          </div>
          <div class="content-view">
            <transition name="fade-transform" mode="out-in">
              <keep-alive>
                <router-view :key="activeName" />
              </keep-alive>
            </transition>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  name: "LayoutView",
  data() {
    return {
      isCollapsed: false,
      avatar: require("../../assets/images/status.gif"),
      menus: [
        {
          title: "考试系统",
          icon: "md-albums",
          children: [
            // {
            //   path: "/home",
            //   title: "首页",
            //   icon: "ios-home"
            // },
            {
              path: "/questionbank",
              title: "录制题库",
              icon: "ios-book"
            },
            {
              path: "/testpaper",
              title: "制作考卷",
              icon: "ios-bookmarks"
            },
            {
              path: "/release",
              title: "试卷管理",
              icon: "ios-bookmarks"
            },
            {
              path: "/examinterface",
              title: "考试界面",
              icon: "md-map"
            },
            {
              path: "/examinationpaperreview",
              title: "试卷批阅",
              icon: "logo-hackernews"
            },
            {
              path: "/statistics",
              title: "考试统计",
              icon: "ios-map"
            }
          ]
        },
        {
          title: "等级培训",
          icon: "ios-bookmarks",
          children:[
            {
              path: "/Apply",
              title: "录制题库",
              icon: "ios-book"
            },
            {
              path: "/CourseWare",
              title: "制作考卷",
              icon: "ios-bookmarks"
            },
            {
              path: "/Plan",
              title: "试卷管理",
              icon: "ios-bookmarks"
            },
          ]
        }
      ],
      routers: new Map([["home", { path: "/home", title: "首页" }]])
    };
  },
  created() {
    this.Deconstruction(this.$route);
  },
  methods: {
    Deconstruction(v) {
      const {
        name,
        path,
        meta: { title }
      } = v;
      this.routers.set(name, { path, title });
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    closeAllItem(e) {
      this.routers.clear();
      this.$router.push("home");
    },
    spliceItemView(key) {
      this.routers.delete(key);
      this.routers = new Map(this.routers);
      if (this.routers.size === 1) {
        this.$router.push("home");
      } else {
        const routers = [...this.routers];
        this.$router.push(routers[routers.length - 1][0]).catch(error => error);
      }
    }
  },
  computed: {
    activeName() {
      return this.$route.path;
    },
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  watch: {
    $route(v) {
      this.Deconstruction(v);
    }
  }
};
</script>
<style lang="scss" scoped>
.layout {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;

  .target-view {
    width: 100%;
    height: 34px;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    white-space: nowrap;
    user-select: none;
    position: relative;
    overflow: hidden;
    overflow-x: auto;

    .close-all-item {
      width: 34px;
      height: 34px;
      background-color: antiquewhite;
      position: absolute;
      z-index: 99;
      top: 0;
      right: 0;
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      align-items: center;

      &:hover {
        background: navajowhite;
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }

    .item-view {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      position: relative;

      .item-view-flex {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }

      &:last-child {
        margin-right: 5px;
      }

      .item-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: whitesmoke;
        font-weight: bold;
        line-height: 1.4;
        margin-left: 2px;
      }

      .item-icon:hover {
        background: gainsboro;
      }
    }

    .is-active {
      background-color: wheat;

      .item-icon {
        background: wheat;
      }

      .item-icon:hover {
        background: honeydew;
      }
    }
  }
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
