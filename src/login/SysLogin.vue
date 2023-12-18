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

function verifySignIn() {
  http
    .post('/getUserInfo/', {})
    .then((res) => {
      // 在这里设置 Pinia状态？
      console.log(res)
      return true
    })
    .catch(function (error) {
      console.log(error)
      return false
    })
  return false
}

function switchBox(res) {
  box_state.value = res
  console.log(box_state.value)
}

// 生命周期
onMounted(() => {
  if (verifySignIn() == true) {
    window.location.href = '/youthol/'
  }
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
