<script setup>
// import { userRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
// import { useUserStore } from './store/user.js'
import axios from 'axios'

import Cookies from 'js-cookie'
// const userStore = useUserStore()
axios.defaults.withCredentials = true //让ajax携带cookie
axios.defaults.baseURL = 'http://127.0.0.1:5173' //初始化基础地

function fun1() {
  window.location.href = '/login/index.html'
  // userStore.add()
}

let is_login = ref(0)
function fun2() {
  console.log(Cookies.get('is_login'))
  // window.location.href = '/login/index.html'
  // userStore.add()
}

function logout() {
  axios
    .post('http://127.0.0.1:8000/verify/logout/')
    .then((res) => {
      console.log(res)
      if (res.data == '登录成功') {
        console.log('登录成功')
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}
onMounted(() => {
  console.log(Cookies.get('is_login'))
  // console.log()
  if (Cookies.get('is_login') == 1) {
    is_login.value = 1
  } else {
    is_login.value = 0
  }
})
</script>
<template>
  <div class="content">
    <div class="hello-title">Youthol</div>
    <el-divider />
    <div class="choice-list">
      <div v-if="is_login" class="choice">OA系统</div>
      <div class="choice">我要投稿</div>
      <div class="choice">关于我们</div>
    </div>
    <div @click="fun2">click2</div>
    <div @click="fun1">click1</div>
    <div @click="logout">logout</div>
  </div>
  <!-- <nav>
    <RouterLink to="/">index</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <RouterView /> -->
  <!-- <Login></Login> -->
</template>

<style scoped>
.content {
  margin: 200px 0 0 0;
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
}
.hello-title {
  font-size: 100px;
}
</style>