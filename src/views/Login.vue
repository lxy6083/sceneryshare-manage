<template>
  <div class="login_container">
      <div class="login_title">管理员登录</div>
        <div class="login_box">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="rule_form">
                <el-form-item prop="username">
                    <el-input type="text" v-model="ruleForm.username" placeholder="用户名"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="密码"/>
                </el-form-item>
                <el-form-item>
                    <div class="login_btn">
                        <el-button @click="submitForm" type="primary">登录</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
  </div>
</template>

<script>
import {getLoginStatus} from '../api/index';
import {mixin} from '../mixins/index'
export default {
    mixins:[mixin],
    data () {
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    {required: true, message:"请输入用户名",trigger:"blur"}
                ],
                password: [
                    {required: true, message:"请输入密码",trigger:"blur"}
                ]
            }
        };
    },
    methods: {
      submitForm() {
        let params = new URLSearchParams();
        params.append("name",this.ruleForm.username);
        params.append("password",this.ruleForm.password);
        getLoginStatus(params)
          .then(res => {
              if(res.code === 1) {
                localStorage.setItem('username',this.ruleForm.username);
                localStorage.setItem('adminId',res.adminMsg.id);
                console.log('adminId',localStorage.getItem('adminId'));
                this.$router.push('/sceneryManagement');
                this.notify(res.msg,"success");
              }else {
                this.notify(res.msg,"error");
              }
          });
      }
    }
}
</script>

<style scoped>
.login_container {
    width: 100%;
    height: 100%;
    background-color: #007acc;
}

.login_title {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 25px;
}



.login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    height: 300px;
    background-color: #fff;

}

.rule_form {
    margin: 10% 10%;

}

.login_btn {
    text-align: center;
}

.login_btn button {
    width: 100%;
    height: 36px;
}

</style>
