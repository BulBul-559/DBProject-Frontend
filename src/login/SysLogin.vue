<script setup>
import { ref } from 'vue'
import axios from 'axios'
import 'animate.css'

let username = ref('')
let password = ref('')

function test() {
  console.log(username.value)
  console.log(password.value)
  axios
    .get('https://api.bulbul559.cn/bulbox/getYouAskMe/')
    // axios.get('https://api.bulbul559.cn/bulbox/getQues/')
    .then((res) => {
      console.log(res)
    })
    .catch(function (error) {
      console.log(error)
    })
}
</script>

<template>
  <div class="login-box">
    <img src="../assets/img/youthol.png" alt="" class="youthol-logo" />
    <div class="username-box box-content">
      <div class="tips">用户名</div>
      <input class="username input-box" v-model="username" />
    </div>
    <div class="password-box box-content">
      <div class="tips">密码</div>
      <input class="password input-box" type="password" v-model="password" />
    </div>
    <div class="login-btn" @click="test">登 录</div>
  </div>
</template>

<style scoped>
.login-box {
  background-color: white;
  margin: 30vh auto;
  padding: 20px;
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 0 40px 0 rgba(77, 77, 77, 0.452);
}
.box-content {
  width: 70%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.youthol-logo {
  margin: 0 0 20px;
  width: 30%;
  height: auto;
}
.tips {
  margin: 10px;
  font-size: 20px;
  color: rgb(88, 88, 88);
}
.input-box {
  width: 80%;
  padding: 2px 10px;
  font-size: 20px;
  height: 36px;
  border: 0px solid;
  border-radius: 5px;
  box-shadow: 0 0 4px 0 rgba(77, 77, 77, 0.452);
}

.login-btn {
  width: 100px;
  height: 40px;
  margin: 20px 0 10px;
  padding: 5px;
  font-size: 22px;
  color: white;
  background-color: #2298ff;
  border-radius: 10px;
  box-shadow: 0 0 4px 0 rgba(77, 77, 77, 0.452);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>