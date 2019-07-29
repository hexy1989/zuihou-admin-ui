import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login/Login.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('@views/homeModule/Home.vue')
    },
    {
      path: '/',
      alias: '/login',
      name: 'login',
      component: Login,
      meta: {
        withoutLayout: true
      }
    },
    // 部门管理-列表
    {
      path: '/userCenter/deptManage',
      name: 'deptManage',
      component: () => import('./views/userCenterModule/DeptManage.vue')
    },
    // 权限管理-菜单管理
    {
      path: '/authority/menuManage',
      name: 'menuManage',
      component: () => import('./views/authModule/MenuManage.vue')
    },
    // 权限管理-角色管理
    {
      path: '/authority/roleManage',
      name: 'roleManage',
      component: () => import('./views/authModule/RoleManage.vue')
    },
    {
      path: '/developerManageModule/serviceManage',
      name: 'serviceManage',
      component: () => import('./views/developerManageModule/serviceManage.vue')
    },
    {
      path: '/developerManageModule/apiView',
      name: 'apiView',
      component: () => import('./views/developerManageModule/ApiView.vue')
    },
    {
      path: '*',
      redirect: 'login'
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})
export default router
