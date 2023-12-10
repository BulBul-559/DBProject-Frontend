<script setup>
// import { userRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
// import { useUserStore } from './store/user.js'
import axios from 'axios'

import Cookies from 'js-cookie'
// const userStore = useUserStore()
axios.defaults.withCredentials = true //让ajax携带cookie
axios.defaults.baseURL = 'http://127.0.0.1:8000' //初始化基础地

function toLogin() {
  window.location.href = '/login/'
  // userStore.add()
}

function toOA() {
  window.location.href = '/OA/'
}

let is_login = ref(0)

function logout() {
  axios
    .post('/verify/logout/')
    .then((res) => {
      console.log(res)
      checkSignIn()
    })
    .catch(function (error) {
      console.log(error)
    })
}

function checkSignIn() {
  if (Cookies.get('is_login') == 1) {
    is_login.value = 1
  } else {
    is_login.value = 0
  }
}
onMounted(() => {
  console.log(Cookies.get('is_login'))
  checkSignIn()
})
</script>
<template>
  <div class="content">
    <div class="hello-title">Youthol</div>
    <div class="divider"></div>
    <div class="choice-list">
      <div v-if="is_login" class="choice" @click="toOA">OA系统</div>
      <div class="choice">我要投稿</div>
      <div class="choice">关于我们</div>
    </div>
    <div class="sign-box">
      <div v-if="is_login" class="sign-btn" @click="logout">退出</div>
      <div v-else class="sign-btn" @click="toLogin">登录</div>
    </div>
  </div>
  <router-view name="MemberDuty"></router-view>

  <!-- <nav>
    <RouterLink to="/">index</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <RouterView /> -->
  <!-- <Login></Login> -->
</template>

<style scoped>
.sign-btn {
  margin: 30px;
  padding: 10px 20px;
  font-size: 22px;
  border: 2px solid white;
  border-radius: 15px;
}
.divider {
  margin: 10px;
  width: 80%;
  border: 1px solid white;
}
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.choice-list {
  display: flex;
  justify-content: center;
  align-items: center;
}

.choice {
  margin: 10px;
  font-size: 20px;
}
.hello-title {
  font-size: 150px;
}
</style>