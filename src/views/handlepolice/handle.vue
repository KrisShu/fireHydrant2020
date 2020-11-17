<template>
  <div class="handle">
        <base-nav  :active="active" title="警情处理"></base-nav>
        <div class="Detail">
            <base-photos 
            :istype="istype" 
            :photo="AlarmDetail.outsidePictureBase64" 
            :truesinglephoto="AlarmDetail.outsidePicture"
            ></base-photos>
            <div class="Detail_content">
                <p>时间：{{AlarmDetail.creationTime}}</p>
                <p>编号：{{AlarmDetail.deviceSn}}</p>
                <p>距离：{{AlarmDetail.distance}}米</p>
                <p>事件：{{AlarmDetail.event}}</p>
            </div>
        </div>
        <!-- 处理编辑状态 -->
        <describe-qusetion
            v-if="!statuskey"
            v-model="question"
            @voiceBase64="getvoiceBase64"
        ></describe-qusetion>
        <!-- 只看 -->
        <div v-else>
            <p class="handleTime" v-if="statuskey"> <span>处理时间：</span>{{AlarmDetail.handleTime}}</p>
            <describe-qusetion
            v-if="AlarmDetail.problemVoiceUrl || AlarmDetail.problemRemark"
            :isEdit="false"
            :time="AlarmDetail.voiceLength"
            :voice="AlarmDetail.problemVoiceUrl"
            :content.sync="AlarmDetail.problemRemark"
            ></describe-qusetion>
        </div>
       

    <van-cell v-if="!statuskey">
        <p>现场照片</p>
        <base-photos  v-model="OutsidePicture" :issingle="false" :takephotolength="2" :takePhoto='true'></base-photos>
    </van-cell>
    <van-cell v-else>
        <base-photos  :isdisabled="false" v-model="OutsidePicture" :issingle="false" :truePhoto="truePhoto"></base-photos>
    </van-cell>
    <base-btn v-if="!statuskey" @click="submit" btntext="提交"></base-btn>
  </div>
</template>

<script>
import DescribeQusetion from '../../components/DescribeQusetion.vue'
let moment = require("moment"); 
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);
export default {
    components:{
        DescribeQusetion
    },
    data(){
        return{
            id:'',
            statuskey:'',
            lat:'',
            lng:'',
            active:'',
            AlarmDetail:{},
            question: {},
            OutsidePicture:[],
            truePhoto:[],
            voicefile:'',
            photofileList:[],
        }
    },
    computed:{
        istype:function(){
            return this.active ? 'piepnetwork':'hydrant'
        }
    },
    created(){
        this.id = this.$route.query.id
        this.lat = localStorage.getItem('lat')
        this.lng = localStorage.getItem('lng')
        this.active = this.$route.query.active
        this.statuskey = this.$route.query.statuskey
        if(this.statuskey){
            localStorage.setItem('statuskey',this.statuskey)
        }
        this.GetHydrantAlarmDetail()
    },
    methods:{
        getvoiceBase64(voiceBase64){
            this.voicefile =  this.base64ToFile(voiceBase64, "voice");
        },
        GetHydrantAlarmDetail(){

            let axios = this.active ? this.$axios.get(this.$api.GetMonitorAlarmDetail,{params:{AlarmId:this.id,Lng:this.lng,Lat:this.lat}}):
            this.$axios.get(this.$api.GetHydrantAlarmDetail,{params:{AlarmId:this.id,Lng:this.lng,Lat:this.lat}});

            axios.then(res=>{
                console.log("获取详情",res)
                res.result.creationTime =this.deal(res.result.creationTime)
                res.result.handleTime =this.deal(res.result.handleTime)

                if(res.result.outsidePictureBase64){
                    res.result.outsidePictureBase64 = `data:image/;base64,${res.result.outsidePictureBase64}`
                    res.result.outsidePicture = `${this.$url}${res.result.outsidePicture}`
                }

                //缩略图
                if (res.result.sitePicture1Base64) {
                    this.OutsidePicture.push(
                    `data:image/;base64,${res.result.sitePicture1Base64}`
                    );
                }
                if (res.result.sitePicture2Base64) {
                    this.OutsidePicture.push(
                    `data:image/;base64,${res.result.sitePicture2Base64}`
                    );
                }


                //真实照片
                if (res.result.sitePicture1) {
                    this.truePhoto.push(
                    `${this.$url}${res.result.sitePicture1}`
                    );
                }
                //真实照片
                if (res.result.sitePicture2) {
                    this.truePhoto.push(
                    `${this.$url}${res.result.sitePicture2}`
                    );
                }

                if(res.result.problemVoiceUrl){
                    res.result.problemVoiceUrl = `${this.$url}${res.result.problemVoiceUrl}`;
                }

                    this.AlarmDetail = res.result
            })
        },
        //时间处理
        deal(data){
            var str = data.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
        },
            //将照片地址转码
        base64ToFile(base64, flga) {
            let that = this;
            let arr, mime, bstr, n, u8arr;
            if (flga == "photo") {
                let fileList = [];
                for (let fileArr of base64) {
                    arr = fileArr.split(",");
                    mime = arr[0].match(/:(.*?);/)[1];
                    console.log("mime", mime);
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
            }else if (flga == "voice") {
                console.log("执行语音转file的文件");
                arr = base64.split(",");
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
                let fileList2 = filetest;
                return fileList2;
            }
        },
        submit(){
            this.photofileList = this.base64ToFile(this.OutsidePicture,"photo");
            let param = new FormData();
            if(this.id){
                param.append("AlarmId", this.id);
                param.append("HandleUserId", this.$store.state.userInfo.userId);
                
            }
            if(this.question.content){
                param.append("ProblemRemark", this.question.content);
            }
            if(this.voicefile){
                param.append("ProblemVoice", this.voicefile);
            }
            if(this.question.duration){
                console.log("(this.question.duration",this.question.duration);
                param.append("VoiceLength", this.question.duration);
            }
            if (this.photofileList.length) {
                for (let i in this.photofileList) {
                param.append(`ProblemPicture${Number(i) + 1}`, this.photofileList[i]);
                }
            }
            for (var [a, b] of param.entries()) {
                console.log(a, b);
            }
            Toast.loading({
                duration: 0,
                mask: true,
                message: "提交中"
            });
            let axios = this.active ? this.$axios.post(this.$api.MonitorAlarmHandle, param):this.$axios.post(this.$api.HydrantAlarmHandle, param);
            axios.then(res => {
                console.log("提交回馈", res);
                Toast.clear();
                this.$toast.success("提交成功");
                this.$router.back();
            }).catch(err=>{
                console.log("提交失败",err)
                Toast.clear();
            })
        }
    }
}
</script>

<style lang="less">
    .handle{
        .Detail{
            display: flex;
            padding: 10px;
            .Detail_content{
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content:center;
                line-height: 2;
                font-size: 14px;
               

            }
        }
        .handleTime{
            padding: 10px;
            font-size: 14px;
        }
    }
</style>