<template>
  <div class="BaseTakePhoto">
    <van-action-sheet 
        v-model="show" 
        :actions="actions" 
        @select="onSelect"
        cancel-text="取消"
        @cancel="onCancel"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { ActionSheet } from 'vant';

Vue.use(ActionSheet);
let moment = require("moment"); 
export default {
    model: {
        prop: "base64list",
        event: "change"
    },
    props: {
        base64list: Array
    },
    data(){
        return{
            show:false,
            actions: [
                { name: '拍照' },
                { name: '从相册选择' }
            ]
        }
    },
    methods:{
        //类型选择、0-拍照、2-图库中选择
        onSelect(item, index) {
            this.show = false;
            index ? this.Photograph() : this.getPhoto();
        },
        //点击取消
        onCancel(){
            this.show = false;
        },
        //拍照
        getPhoto(){
            console.log("拍照")
            let that = this;
            let cmr = plus.camera.getCamera();
            let res = cmr.supportedImageResolutions[10];
            let fmt = cmr.supportedImageFormats[0];
            cmr.captureImage(
                function(path) {
                    plus.io.resolveLocalFileSystemURL(path,function(entry){
                        var imgSrc = entry.toLocalURL();
                        that.getBase64(imgSrc);//转换base64和加水印
                    })
                }
            )   
        },
        //从相册里选择
        Photograph(){
            let that = this;
            plus.gallery.pick(
                function(path) {
                    that.getBase64(path);
                },
                function(e) {
                    console.log("取消选择图片");
                },
                { filter: "image" }
            );
        },
        getBase64(url){
            let that = this;
            let canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            MAX_WH = 800,
            fontSize,
            image = new Image();
            image.crossOrigin = "Anonymous";
            image.onload = function() {
                if (image.height > MAX_WH) {
                    image.width *= MAX_WH / image.height;
                    image.height = MAX_WH;
                }
                if (image.width > MAX_WH) {
                    // 宽度等比例缩放 *=
                    image.height *= MAX_WH / image.width;
                    image.width = MAX_WH;
                }
                canvas.height = image.height;
                canvas.width = image.width;
                if (image.width > 100 && image.width < 500) {
                    fontSize = "24px";
                } else if (image.width >= 500 && image.width < 1000) {
                    fontSize = "44px";
                } else if (image.width >= 1000 && image.width < 1500) {
                    fontSize = "64px";
                }
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                ctx.font = `${fontSize} Arial`;
                ctx.fillStyle = "tomato";
                let time = moment().format("YYYY/MM/DD");
                ctx.textAlign = "end";
                ctx.textBaseline = "middle";
                ctx.fillText(time, canvas.width - 20, canvas.height - 60);
                let dataURL = canvas.toDataURL("image/png/jpg");
                that.base64list.push(dataURL);
                that.$emit('change',that.base64list)
            }
            image.src = url;
        }
    }
}
</script>

<style>

</style>