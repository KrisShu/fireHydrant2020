<template>
  <div class="add_updateBox">
    <base-nav :active="active" v-if="show" title="智慧市政消火栓设备"></base-nav>
    <van-cell-group>
      <van-cell>
        <p>设备编号：</p>
        <div class="display">
          <van-field v-model="add_updateForm.sn" placeholder="请输入设备编号" />
          <img class="scan_icon" @click="startscans(1)" src="../../assets/images/scan.png" alt="">  
        </div>
      </van-cell>
      <van-cell>
        <p>坐标位置：</p>
        <div class="display">
          <div class="lat_lng">
            <p>经度：{{add_updateForm.lng}}</p>
            <p>纬度：{{add_updateForm.lat}}</p>
          </div>
          <img @click="getLatLng('showtoast')" class="refrsh_scan" src="../../assets/images/refresh1.png" alt="">
        </div>
      </van-cell>
      <van-cell>
        <p>管网水压监测设备编号：</p>
        <div class="display">
          <van-field v-model="add_updateForm.pressureMonitorSn" placeholder="请输入管网水压监测设备编号" />
          <img class="scan_icon" @click="startscans(2)" src="../../assets/images/scan.png" alt="">  
        </div>
      </van-cell>
      <van-cell>
        <p>现场照片</p>
        <base-photos v-model="OutsidePicture" :issingle="false" :takePhoto='true'></base-photos>
       
      </van-cell>
      <base-btn @click="add_update" btntext="提交"></base-btn>
    </van-cell-group>
    <base-scan v-if="scan1" ref="baseScan1" @codeInfo="getcodeInfo1"></base-scan>
    <base-scan v-show="scan2" ref="baseScan2" @codeInfo="getcodeInfo2"></base-scan>
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
      show:true,//base-nav是否显示
      OutsidePicture:[],
      scan1:false,//控制扫码组件显示
      scan2:false,
      photofileList:[],
      add_updateForm:{
        sn:'',
        lat:'',
        lng:'',
        pressureMonitorSn:'',
      },
      id:'',//路由传参的id参数值
      active:'',
      OutsidePicturechange:0,//现场照片是否改变的flag，如果大于1则修改页面中现场照片有变化需要重新修改，如果<=1则不需要变化
    }
  },     
  created(){
    //监测是新增还是修改
    console.log(this.$route.query)
    this.active  = this.$route.query.active
    this.id  = this.$route.query.id
    this.id ? this.GetHydrantById(this.id) :''

  },
  mounted(){
    this.getLatLng();
  },
  watch:{
    OutsidePicture(newName, oldName){
      this.OutsidePicturechange++
      console.log( "this.OutsidePicturechange",this.OutsidePicturechange)
    }
  },
  methods:{
    GetHydrantById(id){
      this.$axios.get(this.$api.GetHydrantById,{params:{id}}).then(res=>{
        console.log(res)
        if(res.result.outsidePictureBase64){
          res.result.outsidePictureBase64 = `data:image/;base64,${ res.result.outsidePictureBase64}`
          this.OutsidePicture.push(res.result.outsidePictureBase64)
        }else{
          this.OutsidePicturechange = 1
        }
        
        this.add_updateForm = res.result

      }).catch(err=>{
        console.log(err)
      })
    },
    //点击调用扫描二维码方法
    startscans(flag){
      if(flag == 1){
        this.scan1 = true;
        setTimeout(()=>{
          this.$refs.baseScan1.startscan();
        },200)
        
      }else if(flag == 2){
        this.scan2 = true;
        
        setTimeout(()=>{
          this.$refs.baseScan2.startscan();
        },100)
      }
      this.show = false
    },
    getcodeInfo1(code){
      console.log("getcodeInfo",code)
      this.show = true
      if(code == 'true'){//取消扫码则返回'true'字段则不修改之前的值
        return
      }
      this.add_updateForm.sn = code
    },
    getcodeInfo2(code){
      console.log("getcodeInfo",code)
      this.show = true
      if(code == 'true'){
        return
      }
      this.add_updateForm.pressureMonitorSn = code
    },
    //获取当前位置的经纬度
    getLatLng(showtoast){
      if(!window.plus){//如果不在手机没有plus会报错容错处理
        this.add_updateForm.lat = 30.62
        this.add_updateForm.lng = 104.03
        return
      }
      let that = this
      plus.geolocation.getCurrentPosition(function(p){//成功回调
         console.log("定位",p)
          that.add_updateForm.lat = p.coords.latitude
          that.add_updateForm.lng = p.coords.longitude
      }, function(e){//失败回调
        alert('Geolocation error: ' + e.message);
      },{geocode:true});
      if(showtoast == 'showtoast'){
        this.$toast('坐标刷新成功')
      }
    },
    //将照片地址转码
    base64ToFile(base64){
      // console.log("base64转换为file文件对象",base64)
      console.log("base64转换为file文件对象",base64.length)
      let that = this;
      let arr, mime, bstr, n, u8arr;
      let fileList = [];
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
          fileList.push(filetest);
      }
      return fileList;
    },
    //新增
    add_update(){
      console.log("进行提交操作")
      if(!this.add_updateForm.sn || !this.add_updateForm.lat){
        this.$toast('请将字段填写完整');
        return
      }
     
      this.photofileList = this.base64ToFile(this.OutsidePicture);
    

      
      let param = new FormData();
      if(this.id){
        param.append("Id", this.id);
      }
      param.append("Sn", this.add_updateForm.sn);
      param.append("AreaId", this.$store.state.userInfo.areaId);
      param.append("Lng", this.add_updateForm.lng);
      param.append("Lat", this.add_updateForm.lat);

      if(this.photofileList.length && !this.id){ //新增页面的情况
      console.log("新增页面的情况")
        for (let i in this.photofileList) {
           param.append("OutsidePicture", this.photofileList[i]);
        }
       
      }

      if(this.photofileList.length && this.id && this.OutsidePicturechange>1){ //修改页面的情况
       console.log("修改页面的情况")
        for (let i in this.photofileList) {
           param.append("OutsidePicture", this.photofileList[i]);
        }
       
      }
      if(this.add_updateForm.pressureMonitorSn){
        param.append("PressureMonitorSn", this.add_updateForm.pressureMonitorSn);
      }
      for (var [a, b] of param.entries()) {
          console.log(a, b);
      }
      Toast.loading({
        duration: 0,
        mask: true,
        message: "提交中"
      });

      let axios = this.id ? this.$axios.put(this.$api.UpdateHydrant,param):this.$axios.post(this.$api.AddHydrant,param)

      axios.then(res=>{
        console.log('提交数据成功',res)
        Toast.clear();
        this.$toast.success("操作成功");
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
      .refrsh_scan{
        width: 30px;
        height: 30px;
      }
    }
  }
</style>