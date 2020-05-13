import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/layout/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LayoutView',
    component: layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/example/home.vue'),
        meta:{
          title:'首页'
        }
      },
      {
        path: '/questionbank',
        name: 'questionbank',
        component: () => import('@/views/example/questionbank.vue'),
        meta:{
          title:'录制题库'
        }
      },
      {
        path: '/examinationpaperreview',
        name: "examinationpaperreview",
        component: () => import('@/views/example/examinationpaperreview.vue'),
        meta:{
          title:'试卷批阅'
        }
      },
      {
        path: '/examinterface',
        name: "examinterface",
        component: () => import('@/views/example/examinterface.vue'),
        meta:{
          title:'考试界面'
        }
      },
      {
        path: '/testpaper',
        name: "testpaper",
        component: () => import('@/views/example/testpaper.vue'),
        meta:{
          title:'制作考卷'
        }
      },
      {
        path: '/release',
        name: "release",
        component: () => import('@/views/example/release.vue'),
        meta: {
          title: '试卷管理'
        }
      },
      {
        path: '/statistics',
        name: "statistics",
        component: () => import('@/views/example/statistics.vue'),
        meta:{
          title:'考试统计'
        }
      }
    ]
  }
]



const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes:routes
})

export default router
