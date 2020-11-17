<template>
  <van-nav-bar
    class="base-nav"
    :title="title"
    :left-arrow="showLeft"
    :right-text="rightText"
    @click-left="routerBack"
    @click-right="$emit('onClickRight')"
  >
    <slot name="rightText" slot="right"></slot>
  </van-nav-bar>
</template>

<script>
/**
 *  作者：0          时间：2019/7/2 14:41
 *  1,常量从js文件引入，不要定义魔术变量
 */
export default {
  name: "Base",
  components: {},
  props: {
    title: {
      type: String,
      default: "标题"
    },
    rightText: {
      type: String,
      default: ""
    },
    showLeft: {
      type: Boolean,
      default: true
    },
    active:'',
    special:''
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    routerBack(){
      this.$router.back()
      localStorage.setItem('menuActive', this.active)//将菜单的状态存储起来，返回时可以还原当前菜单选中状态
    }
    
  }
};
</script>

<style lang="less">
.base-nav {
  z-index: 999 !important;
  background-color: #649DA6;
  position: sticky;
  display: flex;
  align-items: center;
  top: 0;
  .van-nav-bar__left{
    margin-bottom: 12px;
  }
  & > div,
  i {
    color: #fff !important;
  }
  &::after {
    border-width: 0;
  }
  /*  右侧文字*/
  .van-nav-bar__text {
    color: #fff;
  }
}
</style>
