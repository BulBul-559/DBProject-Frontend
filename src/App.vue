<script setup>
// import { userRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from './store/store.js'
import YoutholTitle from './components/YoutholTitle.vue'
import { http } from './assets/js/http.js' //配置了基本的设置

function toLogin() {
  window.location.href = '/youthol/login/'
  // userStore.add()
}

function toOA() {
  window.location.href = '/youthol/OA/'
}

let store = useUserStore()

function verifySignIn() {
  http
    .post(
      '/getUserInfo/',
      {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('YoutholAccessToken')
        }
      }
    )
    .then((res) => {
      // 在这里设置 Pinia状态？
      store = useUserStore()
      store.$patch({ sdut_id: res.data.sdut_id, is_login: true })
      console.log('已登录')
    })
    .catch(function (error) {
      console.log(error)
      store.$patch({ sdut_id: 'no id', is_login: false })
    })
}

function logout() {
  localStorage.removeItem('YoutholAccessToken')
  store.$patch({ sdut_id: '', is_login: false })
}

onMounted(() => {
  verifySignIn()
})
</script>
<template>
  <div class="main-layout">
    <YoutholTitle></YoutholTitle>
    <!-- <div class="hello-title">Youthol</div> -->
    <div class="divider"></div>
    <div class="choice-list">
      <div v-if="store.is_login" class="choice" @click="toOA">OA系统</div>
      <div class="choice">我要投稿</div>
      <div class="choice">关于我们</div>
    </div>
    <div class="sign-box">
      <div v-if="store.is_login" class="sign-btn" @click="logout">退出</div>
      <div v-else class="sign-btn" @click="toLogin">登录</div>
    </div>
  </div>
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
.main-layout {
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
