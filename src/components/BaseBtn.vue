<template>
  <div class="btn">
      <van-button @click="btnclick" type="primary" size="large">{{btntext}}</van-button>
  </div>
</template>

<script>
export default {
    props:{
        btntext:{
            type:String,
            default:'按钮'
        }
    },
    methods:{
        btnclick(){
            this.$emit("click");
        }
    }
}
</script>

<style lang="less" >
    @maincolor:#649DA6;
    .btn{
        padding: 20px;
        .van-button{
            background: @maincolor;
            color: white;
        }
    }
</style>