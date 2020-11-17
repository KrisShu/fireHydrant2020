<template>
  <div class="showPhotoBox">
        <div class="takePhoto" v-if="takePhoto && photoList.length < takephotolength">
            <img class="takephoto" @click="opentake" src="../assets/images/takephoto.png" alt="">
        </div>
        <base-take-photo ref="BaseTake"  v-model="photoList" ></base-take-photo>

        <div class="showPhoto">
            <!--  -->
            <van-image
                v-if="issingle && photo"
                fit="cover"
                :src="photo"
                @click="previewPic('issingle')"
            />
            <!--  -->
            <van-image
                v-if="issingle && !photo"
                fit="cover"
                :src="defaultimg"
                @click="previewPic('issingle')"
            />
            <!--  -->
            <div class="showMorePhoto"  v-else v-for="(item, index) in photoList" :key="index">
                <van-image
                    fit="cover"
                    :src="item"
                    @click="previewPic(index)"
                />
                <van-icon
                    v-if="isdisabled"
                    name="clear"
                    @click="deleteimg(index)"
                ></van-icon>
                
            </div>
        </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import Vue from "vue";
Vue.use(ImagePreview);
import BaseTakePhoto from './BaseTakePhoto'
export default {
    components:{
        BaseTakePhoto
    },
    model: {
        prop: "photoList",
        event: "change"
    },
    props:{
        takePhoto:{//是否显示拍照按钮，false不显示为查看图片状态，true显示为拍照状态
            type:Boolean,
            default:false
        },
        photoList:{//存放照片的数组列表
            type:Array,
            default(){
                return []
            }
        },
        truePhoto:Array,
        photo:{//单张显示图片的时候这个字段为字符串
            type:String,
        },
        truesinglephoto:{//单张显示图片的真实图片转换数组
            type:String,
        },
        issingle:{//是否为单张显示
            type:Boolean,
            default:true
        },
        isdisabled: {
            type: Boolean,
            default: true
        },
        takephotolength:{
            type:Number,
            default:1
        },
        istype:{
            type:String,
            default:'hydrant'
        }
    },
    data(){
        return{
            // truesinglephotoArr:[]
        }
    },
    computed:{
        truesinglephotoArr:function(){//如果为单张显示照片则将单张照片转换为数组格式
            let photoArr = []
            photoArr.push(this.truesinglephoto)
            return photoArr
        },
        defaultimg:function(){
            return this.istype == 'hydrant' ? require('../assets/images/timg.jpg'):require('../assets/images/piepnetwork.png')
        }
    },
    methods:{
        previewPic(index){
            console.log(index);
            if(index == 'issingle' && !this.takePhoto){//单张图片且只看
                let instance = ImagePreview({
                    images: this.truesinglephotoArr,
                    closeOnPopstate: true
                });
            }else if(this.takePhoto){//编辑状态
                let instance = ImagePreview({
                    images: this.photoList,
                    startPosition: index,
                    closeOnPopstate: true
                });
            }else{//多张且只看
                let instance = ImagePreview({
                    images: this.truePhoto,
                    startPosition: index,
                    closeOnPopstate: true
                });
            }


        },
        //点击拍照
        opentake(){
            this.$refs.BaseTake.show = true
        },
        deleteimg(index){
            console.log("要删除的下标",index)
            this.photoList.splice(index,1)
        }
    }
}
</script>

<style lang="less">
    .showPhotoBox{
        display: flex;
        .takephoto{
            width:105px;
            height: 65px;
        }
        .showPhoto{
            display: flex;
            justify-content: start;
            .van-image{
                width: 100px;
                height: 120px;
            }
            .showMorePhoto{
                .van-image{
                    margin-left: 10px;
                    width: 105px ;
                    height: 65px ;
                }
                .van-icon{
                    left: -10px;
                    top: -56px;
                    font-size: 18px;
                    position: relative;
                    color: #909399;
                }
            }
        }
    }
</style>