<template>
    <div class="setBox">
        <base-nav  title="设置"></base-nav>
        <van-cell-group>
            <van-cell
                @click="toNext(item.router, index)"
                v-for="(item, index) in setList"
                :key="index"
                :title="item.label"
                :value="item.content"
                is-link
            >
                <img
                slot="icon"
                class="set_icon"
                style="margin-right: 10px"
                :src="item.icon"
                alt=""
                />
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
export default {
    data(){
        return{
            setList: [
                {
                    icon: require("../../assets/images/site_img_03.png"),
                    label: "修改密码",
                    router: "/updatePassword"
                },
                {
                    icon: require("../../assets/images/site_img_05.png"),
                    label: "注销登录",
                    router: ""
                },
            ]
        }
    },
    methods:{
        //  todo 跳转到相应的页面、或者注销
        toNext(rou, index) {
            rou ? this.$router.push(rou) : this.logOut();
        },
        //  todo 注销
        logOut() {
            let that = this;
            this.$dialog.confirm({
                title: "注销登录",
                message: "您是否要注销登录？"
            }).then(() => {
                this.$axios.post(this.$api.UserLogout).then(res => {
                    console.log("注销登录",res)
                    // if (res.result.success) {
                    //     localStorage.clear();
                    //     this.$router.push("login");
                    // }else{
                    //     this.$toast(res.result.failCause)
                    // }
                    localStorage.clear();
                    this.$router.push("login");
                });
            }).catch(() => {});
            // this.setBackButton(function() {
            //     that.$dialog.close();
            // });
        }
    }
}
</script>

<style lang="less">
    .setBox{
        .set_icon{
            width: 20px;
            height: 20px;
        }
    }
</style>