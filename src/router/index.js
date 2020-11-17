import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name:'index',
      component:index,
      meta:{
        auth:true//设置当前路由需要校验
      },
      redirect:'/fireHydrant',
      children:[
        {
          path: "fireHydrant",
          name: "fireHydrant",
          meta: {
            active: 1,
            // keepAlive: true //该字段表示该页面需要缓存
          },
          component: () => import("../views/frieHydrant/index.vue")
        },
        {
          path: "handlepolice",
          name: "handlepolice",
          meta: {
            active: 2,
            // keepAlive: true //该字段表示该页面需要缓存
          },
          component: () => import("../views/handlepolice/index.vue")
        },
        {
          path: "pipeNetwork",
          name: "pipeNetwork",
          meta: {
            active: 0,
            // keepAlive: true //该字段表示该页面需要缓存
          },
          component: () => import("../views/pipeNetwork/index.vue")
        },
      ],
      
    },
    {
      path: '/addUpateFireHydrant',
      name:'addUpateFireHydrant',
      component:() => import("../views/frieHydrant/add_update.vue")
    },
    {
      path: '/addUpatePipeNetwork',
      name:'addUpatePipeNetwork',
      component:() => import("../views/pipeNetwork/add_update.vue")
    },
    {
      path: '/handle',
      name:'handle',
      component:() => import("../views/handlepolice/handle.vue")
    },
    //登录页面
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login/index.vue")
    },
    {
      path: "/set",
      name: "set",
      component: () => import("../views/set/index.vue")
    },
    {
      path: "/updatePassword",
      name: "updatePassword",
      component: () => import("../views/set/updatePassword.vue")
    },

  
  ]

const router = new VueRouter({
  routes
})

//路由守卫
router.beforeEach(function(to,from,next){
  if(to.matched.some( m => m.meta.auth)){  // 对路由进行验证       
    if(localStorage.getItem('changeLogin')==1) { // 已经登陆      
      next()   // 正常跳转到你设置好的页面     
    }
    else{       
      // 未登录则跳转到登陆界面
      next({path:'/login'})
    } 
  }else{ 
    next() 
  } 
})


export default router
