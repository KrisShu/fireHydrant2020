<template>
  <div>
      <img v-if="isShow" @click="refresh('showtoast')" class="refrsh_scan" src="../assets/images/refresh1.png" alt="">
  </div>
</template>

<script>
export default {
    props:{
        isShow:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            Lat:'',
            Lng:'',
        }
    },
    mounted(){
       if(window.plus){
           this.getLatLng();
       }else{
           document.addEventListener('plusready', this.getLatLng, false);
       }
    },
    methods:{
        getLatLng(){
            if(!window.plus){//如果不在手机没有plus会报错容错处理
                console.log("localStorage——lat",30.62)
                console.log("localStorage——lng",104.03)
                let latlng =[30.62,104.03]
                localStorage.setItem('lat',30.62)
                localStorage.setItem('lng',104.03)
                this.$emit('getLatLng',latlng)
                return
            }
            let that = this
            plus.geolocation.getCurrentPosition(function(p){//成功回调
                console.log("定位",p)
                that.Lat = p.coords.latitude
                that.Lng = p.coords.longitude
                let arr = [that.Lat,that.Lng];
                localStorage.setItem('lat',that.Lat)
                localStorage.setItem('lng',that.Lng)
                console.log("localStorage——lat",that.Lat)
                console.log("localStorage——lng",that.Lng)
                that.$emit('getLatLng',arr)
            }, function(e){//失败回调
                alert('Geolocation error: ' + e.message);
            },{geocode:true});
        },
        refresh(){
            this.$toast('坐标刷新成功')
            this.getLatLng();
        }
    }
}
</script>

<style lang="less">
    .refrsh_scan{
        width: 30px;
        height: 30px;
    }
</style>
