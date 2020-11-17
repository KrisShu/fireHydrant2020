<template>
  <div class="base-list">
    <van-pull-refresh
      :disabled="isRefresh"
      v-model="isLoading"
      @refresh="onRefresh"
    >
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多数据啦"
            @load="onLoad"
        >
            <slot>
                <van-cell-group>
                    <van-cell v-for="(item, index) in tableList" :key="index">
                        <slot name="content" :item="item"></slot>
                    </van-cell>
                </van-cell-group>
            </slot>
        </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

export default {
    props: {
        tableList: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    data(){
        return{
            isRefresh:true,
            isLoading:false,
            loading:false,
            finished:false,

        }
    },
    methods:{
        //刷新数据
        onRefresh(){

        },
        //加载数据
        onLoad(){
            let that = this;
            this.$emit("onLoad", function success(size, total = 5, page = {}) {
                page.SkipCount = size;
                that.loading = false;
                if (size >= total ) {
                    that.finished = true;
                }
            });
        }
    }
}
</script>

<style>

</style>