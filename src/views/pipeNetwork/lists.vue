<template>
  <div class="listBox">
    <div class="add_search">
        <van-search show-action v-model="searchvalue"  placeholder="请输入设备编号">
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
        <img @click="add" class="add_icon" src="../../assets/images/add.png" alt="">
    </div>
   
    <base-list
        ref="baseList"
        @onLoad="getList"
        @refresh="getList"
        :tableList="tableList"
    >
    <div class="slot_content " slot-scope="scope" slot="content">
        <base-photos 
        istype="piepnetwork"
        :photo="scope.item.outsidePictureBase64" 
        :truesinglephoto="scope.item.outsidePicture"></base-photos>
        <div class="content">
            <p style="font-weight:bold">编号：{{scope.item.sn}}</p>
            <p>状态：{{scope.item.status  == 1? '在线':'离线'}}</p>
            <p>电量：{{scope.item.electricQuantity}} %</p>
            <p>水压：{{scope.item.pressureValue}} KPa</p>
            <p>距离：{{scope.item.distance}} 米</p>
        </div>
        <div class="operation">
            <base-navigator :lat="scope.item.lat" :lng="scope.item.lng"></base-navigator>
            <div @click="goUpdate(scope.item.id)">
                <img src="../../assets/images/update.png" alt="">
                <span>修改</span>
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
    },
    data(){
        return{
            page:{
                AreaId:this.$store.state.userInfo.areaId,
                Lng:'',
                Lat:'',
                Status:'',
            },
            searchvalue:'',
            tableList:[]
         }
        
    },
    methods:{
        onSearch(){
            this.page.Sn = this.searchvalue
            this.getList();
        },
        add(){
            this.$router.push({
                path:"/addUpatePipeNetwork",
                query:{
                    active:this.active
                }
            })
        },
        getList(success){
            this.page.Lat = localStorage.getItem('lat')
            this.page.Lng = localStorage.getItem('lng')
            if(this.active == 0){//如果菜单状态为0，是全部
                this.page.Status = 0
            }else if(this.active == 1){//如果菜单状态为1，是在线
                this.page.Status = 1
            }else if(this.active == 2){//如果菜单状态为2，是离线
                this.page.Status = -1
            }
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {//如果不是在baselist组件中加载
                p.SkipCount = 0;
                this.tableList = [];
                this.$refs.baseList.loading = true //将加载中....打开
                this.$refs.baseList.finished = false //将完成字样  关闭
            }
            this.$axios.get(this.$api.GetMonitorListForApp, { params: p}).then(res=>{
                console.log("管网水压列表",res)
                if (res.result.items.length > 0) {
                    for (let arr of res.result.items) {
                        if(arr.outsidePictureBase64){
                            arr.outsidePictureBase64 = `data:image/;base64,${arr.outsidePictureBase64}`
                            arr.outsidePicture = `${this.$url}${arr.outsidePicture}`
                        }
                    }
                    this.tableList = this.tableList.concat(res.result.items);
                }
                x ? success(this.tableList.length, res.result.totalCount, p) : this.changelist(this.tableList.length, res.result.totalCount, p);
            }).catch(err=>{
                console.log("获取列表失败",err)
            })
        },
        changelist(size, total = 5, page = {}){//改变列表状态
            page.SkipCount = size;
            this.$refs.baseList.loading = false;
            if (size >= total ) {
                this.$refs.baseList.finished = true;
            }
        },
        // 新增
        goUpdate(id){
            this.$router.push({
                path:"/addUpatePipeNetwork",
                query:{
                    id,
                    active:this.active
                }
            })
        }
       
    }
}
</script>

<style lang="less">
    .listBox{
        .add_search{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 20px;
            .van-search{
                flex: 2 0 auto;
            }
            .add_icon{
                width: 24px;
                height: 24px;
            }
        }
        .slot_content {
            display: flex;
            // justify-content: space-between;
            .content{
                flex: 2 0 auto;
                margin-left: 10px;
            }
            .operation{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
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
    }
</style>