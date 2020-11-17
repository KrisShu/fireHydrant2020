<template>
  <div id="index">
      <!-- 顶部 -->
      <van-nav-bar>
          <div class="left" slot="left">
            <img class="person_icon" src="../assets/images/xhs__img_4.png" alt />
            <!-- <span style="margin-left: 5px">{{ $store.state.userInfo.name }}</span> -->
            <span style="margin-left: 5px">{{ $store.state.userInfo.userName}}</span>
         </div>
         <div slot="right">
           <img @click="goSet" class="set_icon" src="../assets/images/set.png" alt="">
         </div>
      </van-nav-bar>
      <router-view></router-view>

      <!-- 菜单选择 --> 
      <van-tabbar @change="onChange" inactive-color="#A6A6A6" active-color="#649DA6" class="baseTabber" v-model="active">
        <van-tabbar-item  class="gray01" to="/pipeNetwork">
          <span>管网水压</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active : icon.normal" />
        </van-tabbar-item>
        <van-tabbar-item  class="gray02"   to="/fireHydrant">
          <span>市政消火栓</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active2 : icon.normal2" />
        </van-tabbar-item>
        <van-tabbar-item  class="gray03" :dot=dot  to="/handlepolice">
           <span>警情处理</span>
          <img slot="icon" slot-scope="props" :src="props.active ? icon.active3 : icon.normal3" />
        </van-tabbar-item>
      </van-tabbar>

  </div>
</template>

<script>
import gray01 from '../assets/images/menu0_off.png'
import orange01 from '../assets/images/menu0_on.png'
import gray02 from '../assets/images/menubtn1_off.png'
import orange02 from '../assets/images/menubtn1_on.png'
import gray03 from '../assets/images/menubnt2_off.png'
import orange03 from '../assets/images/menubnt2_on.png'
export default {
  data(){
    return{
      active:1,
      icon: {
        normal:gray01,
        active:orange01,
        normal2:gray02,
        active2:orange02,
        normal3:gray03,
        active3:orange03,
      },
      dot:false,
      page:{
        AreaId:this.$store.state.userInfo.areaId,
        Lng:'',
        Lat:'',
        HandleStatus:1
      }
    }
  },
  created(){
    this.active = this.$route.meta.active;
    this.page.Lat = localStorage.getItem('lat')
    this.page.Lng = localStorage.getItem('lng')
    this.isDot();
  },
  methods:{
    isDot(){
      this.$axios.get(this.$api.GetHydrantAlarmList,{params:this.page}).then((res)=>{
        if(res.result.items.length>0){
          this.dot = true
        }
      })
    },
    goSet(){
      this.$router.push('/set')
    },
    onChange(){
      localStorage.removeItem('menuActive')
    }
  }
}
</script>

<style lang="less">
  @maincolor:#649DA6;
  #index{
    min-height: 100vh;
    .van-nav-bar{
      background: #F0F0F0;
      position: sticky;
      top: 0;
      .left{
        display: flex;
        align-items: center;
        img{
          margin-right: 8px;
          width: 14px;
          height: 16px;
        }
        span{
          color: #a2a2a2;
        }
      }
      .set_icon{
        width: 20px;
        height: 16px;
      }
    }
    .van-tabbar{
        width: 100%;
        height: 80px !important;
        background: url("../assets/images/xhs__img_bottom_bg.png");
        background-repeat:repeat-x;
        background-position:0px 0px;
        display: flex;
        align-items: flex-end;
        background-size: 100%;
        .van-tabbar-item{
          height: 60px;
        }
        .van-tabbar-item:nth-of-type(2){
          width: 70px;
          height: 52px;
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            img{
              width: 40px;
              height: 42px;
            }
        }
        .gray01,.gray03{
          .van-tabbar-item__icon{
            img{
              width: 28px;
              height: 20px;
            }
          }
        }
        .gray01{
          padding-right: 130px;
        }
    }
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
      border-width: 0;
    }
  }
</style>