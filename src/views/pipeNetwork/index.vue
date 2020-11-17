<template>
  <div class="pipeNetwork">
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
      online:'在线：3',
      offline:'离线线：3',
      active:0
    }
  },
  created(){
    this.GetMonitorStatusNum();
   
  },
  mounted(){
    if(localStorage.getItem('menuActive')){
      this.active = +localStorage.getItem('menuActive')
      console.log("this.active", this.active)
    }
  },
  methods:{
    GetMonitorStatusNum(){
      this.$axios.get(this.$api.GetMonitorStatusNum,{params:{areaId:this.$store.state.userInfo.areaId}}).then(res=>{
        console.log("管网水压在线离线数据",res)
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
.pipeNetwork{
  .tabs{
    .van-tabs__nav--card{
      margin: 0px !important;
    }
  }
}
</style>