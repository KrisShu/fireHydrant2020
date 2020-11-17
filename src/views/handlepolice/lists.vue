<template>
  <div class="handlepolicelistBox">
    <div class="add_search">
        <van-search show-action v-model="searchvalue"  placeholder="请输入设备编号">
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
    </div>
     <div class="floatBox" >
        <van-sidebar v-model="statuskey" @change="onChange">
            <van-sidebar-item title="待处理"  :disabled="btnclick" />
            <van-sidebar-item title="已处理"  :disabled="btnclick"/>
        </van-sidebar>                  
    </div>
    <base-list
        ref="baseList"
        @onLoad="getList"
        @refresh="getList"
        :tableList="tableList"
    >
    <div class="slot_content " slot-scope="scope" slot="content">
        <base-photos 
        :istype="istype"
        :photo="scope.item.outsidePictureBase64" 
        :truesinglephoto="scope.item.outsidePicture"></base-photos>
        <div class="content">
            <p>时间：{{scope.item.creationTime}}</p>
            <p>编号：{{scope.item.deviceSn}}</p>
            <p>距离：{{scope.item.distance}}米</p>
            <p>事件：{{scope.item.event}}</p>
            <van-button v-if="!statuskey" @click="gohandle(scope.item.alarmId)" type="primary" size="small">处理</van-button>
            <van-button v-else @click="gohandle(scope.item.alarmId)" type="primary" size="small">处理详情</van-button>
        </div>
        <div class="operation">
            <div  v-if="!statuskey">
                 <base-navigator :lat="scope.item.lat" :lng="scope.item.lng"></base-navigator>
            </div>
        </div>
    </div>
    </base-list>
  </div>
</template>

<script>
export default {
    props:{
        active: {
            type: Number,
            default: 0
        },
        // statuskey: {
        //     type: Number,
        //     default: 0
        // },
    },
    computed:{
        istype:function(){
            return this.active ? 'piepnetwork':'hydrant'
        }
    },
    data(){
        return{
            statuskey:0,
            page:{
                AreaId:this.$store.state.userInfo.areaId,
                Lng:'',
                Lat:'',
                HandleStatus:1
            },
            searchvalue:'',
            tableList:[],

            btnclick:false,//防抖节流,控制状态点击按钮
         }
        
    },
    created(){
        if(localStorage.getItem('statuskey')){
            this.statuskey = localStorage.getItem('statuskey')
            this.page.HandleStatus = 2
        }
    },
    methods:{
        //搜索查询
        onSearch(){
            this.page.Sn = this.searchvalue
            this.getList();
        },
        add(){
            this.$router.push({
                path:"/addUpatePipeNetwork"
            })
        },
        onChange(index){
            // console.log("statuskey",index)
            localStorage.removeItem('statuskey')
            this.btnclick =true;
            if(index){
                this.page.HandleStatus = 2
            }else{
                this.page.HandleStatus = 1
            }
            this.getList();
           
        },
        getList(success){
            this.page.Lat = localStorage.getItem('lat')
            this.page.Lng = localStorage.getItem('lng')
            if(this.active){
                this.GetMonitorAlarmList(success)
            }else{
                // console.log("statuskey",this.statuskey)
                this.GetHydrantAlarmList(success)
            }

        },
        //获取消火栓的列表
        GetHydrantAlarmList(success){
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                // console.log("meiyousssssssssss",this.page.HandleStatus)
                p.SkipCount = 0;
                this.tableList = [];
                this.$refs.baseList.loading = true;
                this.$refs.baseList.finished = false;
            }
           
            this.$axios.get(this.$api.GetHydrantAlarmList, { params: p}).then(res=>{
                console.log("消火栓列表",res)
                if (res.result.items.length > 0) {
                    for (let arr of res.result.items) {
                        arr.creationTime = this.deal(arr.creationTime)
                        if(arr.outsidePictureBase64){   
                            arr.outsidePictureBase64 = `data:image/;base64,${arr.outsidePictureBase64}`
                            arr.outsidePicture = `${this.$url}${arr.outsidePicture}`
                        }
                    }
                    this.tableList = this.tableList.concat(res.result.items);
                }
                x ? success(this.tableList.length, res.result.totalCount, p) : this.changelist(this.tableList.length, res.result.totalCount, p);


                this.btnclick = false;
            }).catch(err=>{
                console.log("获取列表失败",err)
            })
        },
        changelist(size, total = 5, page = {}){
            page.SkipCount = size;
            this.$refs.baseList.loading = false;
            if (size >= total ) {
                this.$refs.baseList.finished = true;
            }
        },
        //获取管网水压
        GetMonitorAlarmList(success){
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                p.SkipCount = 0;
                this.tableList = [];
                this.$refs.baseList.loading = true;
                this.$refs.baseList.finished = false;
            }
            this.$axios.get(this.$api.GetMonitorAlarmList, { params: p}).then(res=>{
                console.log("管网水压列表",res)
                if (res.result.items.length > 0) {
                    for (let arr of res.result.items) {
                        arr.creationTime = this.deal(arr.creationTime)
                        if(arr.outsidePictureBase64){   
                            arr.outsidePictureBase64 = `data:image/;base64,${arr.outsidePictureBase64}`
                            arr.outsidePicture = `${this.$url}${arr.outsidePicture}`
                        }
                    }
                    this.tableList = this.tableList.concat(res.result.items);
                }
                this.btnclick = false;
                x ? success(this.tableList.length, res.result.totalCount, p) : this.changelist(this.tableList.length, res.result.totalCount, p);
            }).catch(err=>{
                console.log("获取列表失败",err)
            })
        },
        //时间处理
        deal(data){
            var str = data.split('T');
            var str2 = str[1].split(".")
            var timestr = str[0] +" "+ str2[0]
            return timestr;
        },
        //
        gohandle(id,lat,lng){
            this.$router.push({
                path:'/handle',
                query:{
                    id,
                    active:this.active,
                    statuskey:this.statuskey
                }
            })
        }

    }
}
</script>

<style lang="less">
    .handlepolicelistBox{
        // position: relative;
        .slot_content {
            display: flex;
            // justify-content: space-between;
            .content{
                flex: 2 0 auto;
                margin-left: 10px;
                .van-button{
                    width: 80%;
                    background: #649DA6;
                    margin-top: 8px;
                }
            }
            .operation{
                display: flex;
                align-items: center;
                div{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    img{
                        width: 22px;
                        height: 22px;
                    }                
                }
            }
        }
        .floatBox{
            position: fixed;
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
        }

    }
</style>