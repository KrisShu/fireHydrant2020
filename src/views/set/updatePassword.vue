<template>
    <div class="updatePassword">
        <base-nav title="修改密码"></base-nav>
        <div class="main">
            <van-cell-group>
                <van-field v-model="originPW" clearable  placeholder="请输入原始密码">
                <img class="left-icon" slot="left-icon" src="../../assets/images/update3.png" alt="">
                </van-field>

                <van-field v-model="password" type="password"  placeholder="请设置新密码">
                    <img class="left-icon2" slot="left-icon" src="../../assets/images/update1.png" alt="">
                </van-field>
                <van-field v-model="re_password" type="password"  placeholder="请再次确认密码">
                    <img class="left-icon2" slot="left-icon" src="../../assets/images/update2.png" alt="">
                </van-field>
            </van-cell-group>
        </div>
        <base-btn @click="updatePassword">提交</base-btn>
    </div>
</template>

<script>
export default {
    data(){
        return{
            originPW:'',
            password:'',
            re_password:'',
        }
    },
    methods:{
        updatePassword(){
            
            if(this.password !== this.re_password){
                this.$toast('新密码两次不一致')
                return
            }
            this.$axios.post(this.$api.ChangePassword,{
                account:this.$store.state.userInfo.account,
                oldPassword:this.originPW,
                newPassword:this.password

            }).then(res=>{
                console.log("修改密码成功",res)
                if(res.result.success){
                    this.$toast('修改密码成功，请重新登录')
                    localStorage.clear();
                    this.$router.push("login");
                }else{
                    this.$toast(res.result.failCause)
                }
               
            }).catch(err=>{
                console.log("修改密码失败",err)
            })
        }
    }
}
</script>

<style lang="less">
    .updatePassword{
        .left-icon{
            width: 14px;
            height: 20px;
        }
        .left-icon2{
            width: 18px;
            height: 20px;
        }
    }
</style>