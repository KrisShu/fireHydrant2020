<template>
  <div class="handlepolice">
      <van-tabs class="tabs" @click="onClick" v-model="active" color="#649DA6" type="card">
        <van-tab title="消火栓" :name="0"><lists :active="active" :statuskey="statuskey"></lists></van-tab>
        <van-tab title="管网水压" :name="1"><lists :active="active" :statuskey="statuskey"></lists></van-tab>
      </van-tabs>
     <!--  <div class="floatBox">
        <van-sidebar v-model="statuskey">
            <van-sidebar-item title="待处理" />
            <van-sidebar-item title="已处理" />
        </van-sidebar>                  
    </div> -->
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
      active:0,
      statuskey:0
    }
  },
  mounted(){
    if(localStorage.getItem('menuActive')){
      this.active = +localStorage.getItem('menuActive')
    }
  },
  methods:{
    onClick(){
      localStorage.removeItem('menuActive')
      localStorage.removeItem('statuskey')
    }
  }
}
</script>

<style lang="less">
.handlepolice{
  position: relative;
  .tabs{
    .van-tabs__nav--card{
      margin: 0px !important;
    }
  }
 /*  .floatBox{
      position: absolute;
      z-index: 11;
      bottom: 20%;
      left: 20px;
      .van-sidebar-item{
          padding: 12px ;
          width: 70px;
      }
      .van-sidebar-item__text{
        color: white;
      }
      .van-sidebar-item{
        background: #cccccc;
      }
      .van-sidebar-item--select, .van-sidebar-item--select:active{
        background: #649DA6;
      }
      .van-sidebar-item--select::before{
        background: aquamarine;
      }
  } */
}
</style>