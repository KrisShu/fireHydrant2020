<template>
    <div class="BaseNavigator">
        <div class="btn" @click="navigator">
            <img src="../assets/images/navgator.png" alt="">
            <span>路线</span>
        </div>
        <van-action-sheet 
            v-model="show" 
            :actions="actions" 
            @select="onSelect"
            cancel-text="取消"
        />
      
    </div>
</template>

<script>
export default {
    props:{
        lat:'',
        lng:''
    },
    data(){
        return{
            show:false,
            actions: [
                { name: '百度地图' },
                { name: '高德地图' }
            ],
        }
    },
    methods:{
        navigator(){
            this.show = true
        },  
        onSelect(item, index) {
            console.log(index)
            this.show = false;
            index ? this.Gaode() : this.Baidu();
        },
        Gaode(){
            var appstore, ua = navigator.userAgent; //用户代理
            if(ua.match(/Android/i)){ 
                appstore = 'market://search?q=com.singtel.travelbuddy.android';
            }
            let dlat = this.lat;//终点的纬度
            let dlon = this.lng;//终点的经度
            console.log("高德导航",dlat,dlon)
            let dname = '消火栓';//终点的名称
            let ss = document.createElement('a')
            let href = `amapuri://route/plan/?did=BGVIS2&dlat=${dlat}&dlon=${dlon}&dname=${dname}&dev=0&t=0`
            ss.setAttribute('href', href);
            ss.click(); 
        },
        Baidu(){
            var appstore, ua = navigator.userAgent;
            if(ua.match(/Android/i)){
                appstore = 'market://search?q=com.singtel.travelbuddy.android';
            }
            let dlat = this.lat;//终点的纬度
            let dlon = this.lng;//终点的经度
            console.log("百度导航",dlat,dlon)
            let ss = document.createElement('a')
            let href = `baidumap://map/direction?destination=${dlat},${dlon}&coord_type=bd09ll&mode=driving&sy=0&index=0&target=1&src=andr.baidu.openAPIdemo`
            ss.setAttribute('href', href);
            ss.click();
        }
    }
}
</script>

<style lang="less">
    .BaseNavigator{
        .btn{
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            img{
                width: 22px;
                height: 22px;
            }
        }
    }
</style>