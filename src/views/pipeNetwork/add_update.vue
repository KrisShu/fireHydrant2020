<template>
  <div class="add_updateBox">
    <base-nav :active="active" v-if="show" title="管网水压监测设备"></base-nav>
    <van-cell-group>
      <van-cell>
        <p>设备编号：</p>
        <div class="display">
          <van-field v-model="add_updateForm.sn" placeholder="请输入用户名" />
          <img class="scan_icon" @click="startscan" src="../../assets/images/scan.png" alt="">
        </div>
      </van-cell>
      <van-cell>
        <p>坐标位置：</p>
        <div class="display">
          <div class="lat_lng">
            <p>经度：{{add_updateForm.lng}}</p>
            <p>纬度：{{add_updateForm.lat}}</p>
          </div>
          <!-- <img src="../../assets/images/refresh1.png" alt=""> -->
          <base-location @getLatLng="getLatLng"></base-location>
        </div>
      </van-cell>
      <van-cell>
        <p>现场照片</p>
        <base-photos v-model="OutsidePicture" :issingle="false" :takePhoto='true'></base-photos>
      </van-cell>
      <base-btn @click="submit" btntext="提交"></base-btn>
    </van-cell-group>
    <base-scan v-show="scan" ref="baseScan" @codeInfo="getcodeInfo"></base-scan>
  </div>
</template>

<script>
let moment = require("moment"); 
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);
export default {
  data(){
    return{
      value:'',
      scan:false,//是否显示扫码组件
      show:true,
      OutsidePicture:[],
      OutsidePicturechange:0,
      photofile:'',//存放转换为file文件的照片
      add_updateForm:{
        sn:'',
        lat:'',
        lng:'',
      },
      id:'',
      active:''
    }
  },
  watch:{
    OutsidePicture(newName, oldName){
      this.OutsidePicturechange++
      console.log( this.OutsidePicturechange)
    }
  },
  created(){
      this.active = this.$route.query.active
      this.id = this.$route.query.id
      if( this.id){
        this.GetMonitorById(this.id)
      }else{
        this.add_updateForm.lat = localStorage.getItem('lat')
        this.add_updateForm.lng = localStorage.getItem('lng')
      }
      
  },
  methods:{
    //获取详情
    GetMonitorById(id){
      this.$axios.get(this.$api.GetMonitorById,{params:{id}}).then(res=>{
        console.log("获取详情",res)
        if(res.result.outsidePictureBase64){
          res.result.outsidePictureBase64 = `data:image/;base64,${ res.result.outsidePictureBase64}`
          this.OutsidePicture.push(res.result.outsidePictureBase64)
        }else{
          this.OutsidePicturechange = 1
        }
        
        this.add_updateForm = res.result
      })
    },
    //开始扫码
    startscan(){
      this.show = false
      this.scan= true;
      setTimeout(()=>{
        this.$refs.baseScan.startscan();
      },100)
    },
    getcodeInfo(code){
      this.show = true
      if(code == 'true'){//取消扫码则返回'true'字段则不修改之前的值
        return
      }
      this.add_updateForm.sn = code
    },
    //点击获取刷新的经纬度
    getLatLng(latlng){
      console.log(latlng)
      this.add_updateForm.lat = localStorage.getItem('lat')
      this.add_updateForm.lng = localStorage.getItem('lng')
    },
    base64ToFile(base64){
      let that = this;
      let arr, mime, bstr, n, u8arr;
      let fileList;
      for (let fileArr of base64) {
          arr = fileArr.split(",");
          mime = arr[0].match(/:(.*?);/)[1];
          bstr = atob(arr[1]); // 解码base-64编码的数据
          n = bstr.length;
          u8arr = new Uint8Array(n); // 无符号整型数组
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          //转换成file对象
          let filename = moment();
          let filetest = new File([u8arr], filename, { type: mime });
          fileList = filetest;
      }
      return fileList;
    },
    submit(){
      if(!this.add_updateForm.sn || !this.add_updateForm.lat){
        this.$toast('请将字段填写完整');
        return
      }
      this.photofile = this.base64ToFile(this.OutsidePicture);
      let param = new FormData();
      if(this.id){
        param.append("Id", this.id);
      }
      param.append("Sn", this.add_updateForm.sn);
      param.append("AreaId", this.$store.state.userInfo.areaId);
      param.append("Lng", this.add_updateForm.lng);
      param.append("Lat", this.add_updateForm.lat);
      if(this.photofile && !this.id){ //新增页面的情况
        console.log("新增页面的情况")
          param.append("OutsidePicture", this.photofile);
      }
      if(this.photofile && this.id && this.OutsidePicturechange >1){ //修改页面的情况
        console.log("修改页面的情况")
        param.append("OutsidePicture", this.photofile);
      }
      for (var [a, b] of param.entries()) {
          console.log(a, b);
      }
      Toast.loading({
        duration: 0,
        mask: true,
        message: "提交中"
      });
      let axios = this.id ? this.$axios.put(this.$api.UpdateMonitor,param):this.$axios.post(this.$api.AddMonitor,param)
      axios.then(res=>{
        console.log('提交数据成功',res)
        Toast.clear();
        this.$toast.success("提交成功");
        localStorage.setItem('menuActive', this.active)
        this.$router.back();
      }).catch(err=>{
        console.log("提交数据失败",err)
        Toast.clear();
        this.$toast(err.error.message)

      })
    }
  }
}
</script>

<style lang="less">
@fontcolor: rgb(161, 161, 161);
  .add_updateBox{
    .display{
      display: flex;
      align-items:center;
      justify-content: space-between;
      .van-cell:not(:last-child)::after{
        border: none;
      }
      .van-cell{
        padding: 0;
        input{
          height: 40px;
          color: @fontcolor;
        }
      } 
      .lat_lng{
        color: @fontcolor;
      }
      .scan_icon{
        width: 24px;
        height: 24px;
      }
    }
  }
</style>