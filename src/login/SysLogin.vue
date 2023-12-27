<script setup>
// import { storeToRef, defineStore } from 'pinia'
// import { useUserStore } from '../store/user.js'
// import { FormRules } from 'element-plus'
import 'animate.css'

import { ref, onMounted } from 'vue'
import { http } from 'assets/js/http.js' //配置了基本的设置

import loginBox from './components/loginBox.vue'
import changePassword from './components/changePassword.vue'

let box_state = ref(true)

const verifySignIn = new Promise((resolve, reject) => {
  http
    .post('/GetUserInfo/', {})
    .then((res) => {
      // 在这里设置 Pinia状态？
      console.log(res)
      resolve()
    })
    .catch(function (error) {
      console.log(error)
      reject()
    })
})

function switchBox(res) {
  box_state.value = res
  console.log(box_state.value)
}

// 生命周期
onMounted(() => {
  verifySignIn
    .then(() => {
      window.location.href = '/youthol/'
    })
    .catch(() => {})
})
</script>

<template>
  <div class="main_layout">
    <loginBox v-if="box_state" @isLogin="switchBox"></loginBox>
    <changePassword v-else></changePassword>
  </div>
</template>

<style scoped>
@media only screen and (min-width: 768px) {
  /* for desktop */
}

@media only screen and (max-width: 768px) {
  /* for phone */
}
</style>
