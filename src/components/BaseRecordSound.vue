<template>
  <van-button
    type="default"
    @touchstart.native="startRecord"
    @touchmove.native="recording"
    @touchend.native="endRecord"
    >按住说话</van-button
  >
</template>

<script>
/**
 *  作者：0          时间：2019/7/8 17:44
 *  1,常量从js文件引入，不要定义魔术变量
 */
import myIcon from "../assets/images/zbxc_img_05.png"
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);
export default {
  name: "BaseRecordSound",
  components: {},
  model: {
    prop: "voice",
    event: "change"
  },
  props: {
    voice: String
  },
  data() {
    return {
      timeOutEvent: 0,
      record: Object,
      longpressflag:0
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //开始录音、事件不足500ms显示录音事件太短弹窗
    startRecord() {
      let that = this;
      this.timeOutEvent = setTimeout(()=>{
          this.longpressflag =1 //长按标识
          this.longPress();//开始录音
      },1000);
    },
    //上滑取消录音功能
    recording() {
      console.log("滑动。。。");
    },
    // 录音进行中、弹出一个正在录音的界面、以及声音gif图标
    longPress() {
     if (!window.plus) return;

      plus.device.vibrate(100);//设备震动----参数100
      let that = this;
      console.log("开始录音");
      Toast({
        duration: 0,
        icon: myIcon
      });
      //调用手机的录音对象
      let r = plus.audio.getRecorder(); // 获取当前设备的录音对象
      this.record = r;
      let fmt = r.supportedFormats[0]//将录音格式转为aac格式
      if (r === null) {
        alert("该手机没有录音设备!");
        return;
      }
      //如果当前手机有录音设备就会产生一个AudioRecorder录音对象，调用录音对象的方法record开始录音
      r.record(
        { filename: "_doc/audio/",format:fmt },function(recordFile) {
          Toast.clear();
          // todo 向外抛出一个创建语音对象的触发
          that.$emit("change", recordFile);
          that.$emit("testVocie", recordFile);//向外抛出语音文件方面语音文件转换

        },function(e) {
          alert("Audio record failed设备录音失败");
          console.log("Audio record failed设备录音失败",e)
        }
      );
    },
    
    /**
     * @fileOverview 录音完成后、保存录音文件的路径、
     */
    endRecord() {
      console.log("结束录音")
      Toast.clear();
      clearTimeout(this.timeOutEvent); //清除定时器
      if(this.timeOutEvent !=0 && this.longpressflag==0){
        Toast({
            message: '长按时间太短',
            icon: 'warning-o'
        });
       console.log("此处为点击事件")
      }else if(this.timeOutEvent !=0 && this.longpressflag==1){
        this.record.stop();//结束录音操作
      }

    }
  }
};
</script>

<style lang="less"></style>
