import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible'//移动端适配
import "./plugins/vant";//引入vant组件
import '../src/assets/css/reset.css'//公共重置初始化样式
import "./plugins/BaseComponents"; // 基础公共组件
import api from "./plugins/api.js";
import axios from "./plugins/axios.js";
import { Toast } from "vant";

// import VConsole from "vconsole";
// let vConsole = new VConsole();
// Vue.use(vConsole);


Vue.use(Toast);
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.prototype.$url = "http://fd.sctsjkj.com:5081"; // 服务器地址
Vue.config.productionTip = false

let val = localStorage.getItem("setUserInfo");
if (val) {
  let info = JSON.parse(val);
  store.commit("setUserInfo", info);
}


// 修改物理返回键
Vue.prototype.setBackButton = function(fun) {
  plus.key.removeEventListener("backbutton", function() {});
  plus.key.addEventListener("backbutton", function() {
    fun();
    plus.key.removeEventListener("backbutton", function() {});
    plus.key.addEventListener("backbutton", function() {
      let url = location.hash.split("/")[1];
      if (
        url === "fireHydrant" ||
        url === "handlepolice" ||
        url === "pipeNetwork" ||
        url === "login"
      ) {
        // 处于app首页,满足退出app操作
        plus.runtime.quit();
      } else {
        window.history.back();
      }
    });
  });
};


document.addEventListener("plusready", function() {
  let time = ""; // 用来存上一次按键时间；
  plus.key.addEventListener(
    "backbutton",
    function() {
      let url = location.hash.split("/")[1];
      if (
        url === "fireHydrant" ||
        url === "handlepolice" ||
        url === "pipeNetwork" ||
        url === "login"
      ) {
        // 处于app首页,满足退出app操作
        if (new Date() - time < 2000) {
          // 小于2s,退出程序
          plus.runtime.quit();
        } else {
          // 大于2s，重置时间戳，
          time = new Date();
          Toast("再次点击退出");
        }
        return;
      } else {
        // console.log("不满足条件");
        window.history.back();
      }
    },
    false
  );
});

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
