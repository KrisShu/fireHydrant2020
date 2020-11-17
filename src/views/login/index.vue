<template>
  <div class="login">
      <!--    头部title-->
      <base-nav title="登录" :show-left="false"></base-nav>
      <!--  主体  -->
      <div class="login-main">
        <div class="login-main-logo">
          <img width="60%" src="../../assets/images/load_img_01.png" alt="" />
          <p class="login_tip">市政消火栓作业终端</p>
        </div>
        <!-- form表单 -->
        <van-cell-group>
            <van-field v-model="loginForm.account" clearable  placeholder="请输入手机号码">
                <img class="left-icon" slot="left-icon" src="../../assets/images/load_img_02.png" alt="">
            </van-field>

            <van-field v-model="loginForm.password" clearable type="password"  placeholder="请输入密码">
                <img class="left-icon2" slot="left-icon" src="../../assets/images/load_img_03.png" alt="">
            </van-field>
            
        </van-cell-group>
        <div class="login-main-pass">
          <van-checkbox v-model="loginForm.isPersistent">自动登录</van-checkbox>
        </div>
        <div class="login-main-btn">
          <van-button type="info" @click="login" size="large">登录</van-button>
        </div>
        <base-location  ref="baselocation" @getLatLng="getLatLng" :isShow="false"></base-location>
        
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loginForm:{
        account: "",
        password: "",
        isPersistent: true
      },
    }
  },
  mounted(){
    // this.$refs.baselocation.getLatLng();
  },
  methods:{
    //登录
    login(){
      let f = this.loginForm;
      if(!f.account || !f.password){
        this.$toast("请输入账号和密码！");
        return;
      }
      this.$axios.post(this.$api.UserLoginForMobile,f).then(res=>{
        console.log("登录成功",res)
        
        if(res.result.success){//登录成功
          let r = res.result;
          localStorage.setItem('changeLogin',1);
          localStorage.setItem("setUserInfo", JSON.stringify(r));
          this.$store.commit("setUserInfo", r);
          this.$router.push({
            path:"/"
          })
        }else{
          this.$toast(res.result.failCause)
        }
      }).catch(err=>{
        console.log("登录失败",err)
      })
      
     
    },
    getLatLng(locationarr){
      console.log("登录页面的获取的经纬度",locationarr)
    }
  }
}
</script>

<style lang="less">
@maincolor:#649DA6;
  .login{
    &-main{
      margin-top: 40px;
      .login-main-logo{
        text-align: center;
      }
      .login_tip{
        font-size: 16px;
        line-height: 2;
        color: black;
      }
      .van-cell-group{
        margin-top: 50px;
        input{
            font-size: 14px;
            height: 30px;
        }
        .van-field__left-icon{
          display: flex;
          align-items: center;
        }
        .left-icon{
            width: 14px;
        }
        .left-icon2{
            width: 16px;
        }
      }
      .login-main-pass{
        padding: 20px;
        .van-checkbox__icon--checked .van-icon{
          background-color: @maincolor;
          border-color:@maincolor;
        }
      }
      .login-main-btn{
        margin-top: 20px;
        padding: 20px;
        
        .van-button--info{
          background: @maincolor;
        }
      }
    }
  }
</style>