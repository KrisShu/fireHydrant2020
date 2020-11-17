<template>
  <div class="fireHydrant">
      <van-tabs class="tabs" @click="onClick" v-model="active" color="#649DA6" type="card">
        <van-tab title="全部" :name="0"><lists :active="active"></lists></van-tab>
        <van-tab :title="online" :name="1"><lists :active="active"></lists></van-tab>
        <van-tab :title="offline" :name="2"><lists :active="active"></lists></van-tab>
      </van-tabs>
  </div>
</template>

<script>
import lists from './lists.vue'
export default {
  components:{
    lists
  },
  data(){
    return{
      online:'在线：0',
      offline:'离线：0',
      active:0
    }
  },
  created(){
    this.GetHydrantStatusNum()
    if(localStorage.getItem('menuActive')){
      this.active = +localStorage.getItem('menuActive')
    }
  },
  methods:{
    GetHydrantStatusNum(){
      this.$axios.get(this.$api.GetHydrantStatusNum,{params:{areaId:this.$store.state.userInfo.areaId}}).then(res=>{
        console.log("res",res)
        this.offline = `离线：${res.result.offlineNum}`;
        this.online = `在线：${res.result.onlineNum}`;
      })
    },
    onClick(){
      localStorage.removeItem('menuActive')
    }
  }
}
</script>

<style lang="less">
.fireHydrant{
  .tabs{
    .van-tabs__nav--card{
      margin: 0px !important;
    }
  }
}
</style>