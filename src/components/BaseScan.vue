<template>
    <div v-if="show" class="baseScan">
        <div class="acticon"> 
            <van-button  type="default" size="normal" @click="cancelscan">取消</van-button>
        </div>
    </div>
</template>

<script>
import { PullRefresh } from 'vant'
export default {
    data(){
        return{
            barcode:'',
            show:false,
        }
    },
    beforeDestroy() {
        if (!window.plus) return;
        if( this.barcode){
            this.barcode.cancel();
            this.barcode.close(); //关闭条码识别控件
        }   
    },
    methods:{
        startscan(){
            this.show = true
            if (!window.plus) return;
            this.scan(); //创建控件
            setTimeout(() => {
               this.barcode.start();
            }, 200);
        },
        scan(){
           
            //创建创建Barcode扫码控件
            this.barcode = plus.barcode.create('barcode',[plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13], {
                height: "100%",
                frameColor: "#1294cb",
                scanbarColor: "#1294cb",
                top: "100px",
                left: "0px",
                width: "100%",
                height: "500px",
                position: "fixed"
            })
            this.barcode.onmarked = this.onmarked;
            plus.webview.currentWebview().append(this.barcode);
            
        },
        onmarked(type, result){
            let that = this;
            console.log("onmarked",type, result);
            let text = "未知: ";
            switch (type) {
                case plus.barcode.QR:
                text = "QR: ";
                break;
                case plus.barcode.EAN13:
                text = "EAN13: ";
                break;
                case plus.barcode.AZTEC:
                text = "AZTEC: ";
                break;
            }
            this.show = false
            console.log("onmarked2",type, result)
            that.$emit("codeInfo", result);
            this.barcode.close();
        },
        //点击取消扫码
        cancelscan(){
            this.show = false
            if (!window.plus) return;
            plus.navigator.setStatusBarStyle("dark");
            if (this.barcode) {
                this.barcode.cancel(); //关闭扫描
                this.barcode.close(); //关闭条码识别控件
                
            }
            this.$emit("codeInfo", 'true');//取消扫码则返回'true'字段则不修改之前的值
        }
    }
}
</script>

<style lang="less">
    .baseScan{
        min-height: 100vh;
        position: absolute;
        z-index: 2;
        background:black;
        min-width: 100%;
        top: 0;
        left: 0;
        .acticon {
            position: fixed;
            z-index: 777;
            width: 100%;
            left: 0;
            bottom: 0;
            height: 100px;
            color: wheat;
            text-align: center;
        }
    }
</style>