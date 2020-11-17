<template>
  <div class="listBox">
    <div class="add_search">
        <van-search show-action v-model="searchvalue"  placeholder="请输入设备编号">
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
        <img class="add_icon" @click="add" src="../../assets/images/add.png" alt="">
    </div>
    <base-list
        ref="baseList"
        @onLoad="getList"
        @refresh="getList"
        :tableList="tableList"
    >
    <div class="slot_content " slot-scope="scope" slot="content">
        <base-photos :photo="scope.item.outsidePictureBase64" :truesinglephoto="scope.item.outsidePicture"></base-photos>
        <div class="content">
            <p style="font-weight:bold">编号：{{scope.item.sn}}</p>
            <p>状态：{{scope.item.status  == 1 ? '在线':'离线'}}</p>
            <p>电量：{{scope.item.electricQuantity}} %</p>
            <p>水压：{{scope.item.pressure}} KPa</p>
            <p>距离：{{scope.item.distance}} 米</p>
        </div>
        <div class="operation">
            <div @click="navigator(scope.item)">
                <img src="../../assets/images/navgator.png" alt="">
                <span>路线</span>
            </div>
            <div @click="goUpdate(scope.item.id)">
                <img src="../../assets/images/update.png" alt="">
                <span>修改</span>
            </div>
        </div>

        <van-action-sheet 
            v-model="show" 
            :actions="actions" 
            @select="onSelect"
            cancel-text="取消"
        />
        <a href="" ref="a" v-show="false">ceshi</a>
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
            tableList:[],
            show:false,
            actions: [
                { name: '百度地图' },
                { name: '高德地图' }
            ],
            navigatorItem:''
         }
        
    },
    created(){
        console.log(this.active)
    },
    methods:{
        // getLatLng(latlng){
        //     console.log("latlng",latlng)
        //     this.page.Lat = localStorage.getItem('lat')
        //     this.page.Lng = localStorage.getItem('lng')
        // },
        //新增
        add(){
            this.$router.push({
                path:"/addUpateFireHydrant",
                query:{
                    active:this.active
                }
            })
        },
        //搜索
        onSearch(){
            this.page.Sn = this.searchvalue
            this.getList();
        },
        //获取列表
        getList(success){
            this.page.Lat = localStorage.getItem('lat')
            this.page.Lng = localStorage.getItem('lng')
            // console.log(" this.page.Lat", this.page.Lat)
            // console.log(" this.page.Lng", this.page.Lng)
            if(this.active == 0){//如果菜单状态为0，是全部
                this.page.Status = 0
            }else if(this.active == 1){//如果菜单状态为1，是在线
                this.page.Status = 1
            }else if(this.active == 2){//如果菜单状态为2，是离线
                this.page.Status = -1
            }
            let x = arguments[0] instanceof Object;
            let p = this.page;
            if (!x) {
                p.SkipCount = 0;
                this.tableList = [];
                this.$refs.baseList.loading = true
                this.$refs.baseList.finished = false
            }
            this.$axios.get(this.$api.GetHydrantListForApp, { params: p}).then(res=>{
                console.log("列表",res)
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
        changelist(size, total = 5, page = {}){
            page.SkipCount = size;
            this.$refs.baseList.loading = false;
            if (size >= total ) {
                this.$refs.baseList.finished = true;
            }
        },
        //选择导航
        navigator(scope){
            this.show = true
            this.navigatorItem = scope
        },  
        //修改
        goUpdate(id){
            this.$router.push({
                path:"/addUpateFireHydrant",
                query:{
                    id,
                    active:this.active
                }
            })
        },
        onSelect(item, index) {
            console.log(index)
            this.show = false;
            if (!window.plus) return;
            if(index){
                if(plus.runtime.isApplicationExist({pname:'com.autonavi.minimap'})){
                    this.Gaode()
                }else{
                    this.$toast('请安装地图后再使用')
                }
            }else{
                if(plus.runtime.isApplicationExist({pname:'com.baidu.BaiduMap'})){
                    this.Baidu()
                }else{
                    this.$toast('请安装地图后再使用')
                }
            }
        },
        Gaode(){
            let dlat = this.navigatorItem.lat;//终点的纬度
            let dlon = this.navigatorItem.lng;//终点的经度
            let dname = '消火栓';//终点的名称
            let  url = `amapuri://route/plan/?sid=BGVIS1&slat=&slon=&sname=&did=BGVIS2&dlat=${dlat}&dlon=${dlon}&dname=${dname}&dev=1&t=0`;
            plus.runtime.openURL(url)
        },
        Baidu(){
            let dlat = this.navigatorItem.lat;//终点的纬度
            let dlon = this.navigatorItem.lng;//终点的经度
            let dname = '消火栓';//终点的名称
            let url = `bdapp://map/direction?origin=&destination=name:${dname}|latlng:${dlat},${dlon}&coord_type=wgs84&mode=driving&src=andr.baidu.openAPIdemo`
            plus.runtime.openURL(url)
        }
    },
    destroyed(){
        console.log('离开')
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
            .van-search--show-action{
                padding-right: 10px;
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