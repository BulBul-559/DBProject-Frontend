<script setup>
import { reactive, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { http } from '../assets/js/http.js' //配置了基本的设置
import { useUserStore } from '../store/store.js'

// basic user infomation
// let userInfo = reactive({
//   profileSrc: '/src/assets/img/me.jpg',
//   username: '孙美源',
//   department: '程序部'
// })

// the bottom of the page, display some specific information
let stateBar = reactive({
  allDuty: '4.5',
  dutyState: '未值班',
  nowBrorrow: '1'
})

let userStore = useUserStore()

// verify the token is vaild or not
function verifySignIn() {
  http
    .post(
      '/getYoutholerInfo/',
      {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('YoutholAccessToken')
        }
      }
    )
    .then((res) => {
      // 在这里设置 Pinia状态？
      userStore.$patch({
        sdut_id: res.data.sdut_id,
        is_login: true,
        name: res.data.name,
        department: res.data.department,
        identity: res.data.identity
      })
      // store.$patch({ sdut_id: res.data.sdut_id })
      console.log('已登录')
    })
    .catch(function (error) {
      console.log(error)
      userStore.$patch({ sdut_id: 'no id', is_login: false })
    })
}

function Logout() {
  localStorage.removeItem('YoutholAccessToken')
  userStore.$patch({ sdut_id: '', is_login: false })
  window.location.href = '/'
}

onMounted(() => {
  if (userStore.is_login == true) {
    //先检查 pinia
    return
  } else if (verifySignIn() == false) {
    //未登录重定向
    window.location.href = '/'
  }
})
</script>

<template>
  <div class="main-layout">
    <el-container>
      <el-container>
        <el-aside class="aside-nav">
          <div class="user-info">
            <!-- <el-image class="profile" :src="userInfo.profileSrc" fit="cover" /> -->
            <div class="user-info-detail">
              <div class="user-name">{{ userStore.name }}</div>
              <div class="department">{{ userStore.department }}</div>
            </div>
          </div>
          <el-scrollbar>
            <router-link to="/">
              <div class="home nav-item">首页</div>
            </router-link>

            <router-link to="/duty">
              <div class="duty nav-item">值班</div>
            </router-link>

            <router-link to="/borrow">
              <div class="borrow nav-item">设备</div>
            </router-link>

            <router-link to="/study">
              <div class="study nav-item">培训</div>
            </router-link>

            <router-link to="/room">
              <div class="room nav-item">场地</div>
            </router-link>

            <div class="logout nav-item" @click="Logout">退出</div>
          </el-scrollbar>
          <!-- <img src="../assets/img/youthol.png" alt="" class="youthol-logo" /> -->
        </el-aside>
        <el-main>
          <!-- <el-scrollbar> -->
          <router-view name="MainComponment"></router-view>
          <!-- </el-scrollbar> -->
        </el-main>
      </el-container>

      <el-footer class="state-bar">
        <div class="all-duty">累计值班：{{ stateBar.allDuty }}小时</div>
        <div class="duty-state">{{ userStore.duty_state }}</div>
        <div class="now-brorrow">正在借用设备：{{ stateBar.nowBrorrow }}</div>
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.youthol-logo {
  /* margin: 0 0 30px; */
  /* width: auto;
  height: 70%; */
  width: 70%;
  height: auto;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.profile {
  border-radius: 50px;
  width: 70px;
  height: 70px;
  /* padding 5px; */
}

.user-info-detail {
  padding: 10px;
}

.user-info-detail > div {
  color: white;
  padding: 5px;
}

.el-scrollbar {
  width: 100%;
}
.aside-nav {
  height: 100%;
  width: 200px;
  /* background-color: #0058a5; */
  background-color: #008aff;
  /* background-color: #f68512; */
  font-size: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.nav-item {
  width: 100%;
  padding: 20px 0px;
  border-top: 0.5px solid white;
  border-bottom: 0.5px solid white;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.el-footer {
  height: 30px;
  width: 100%;
  display: flex;
  background-color: #008aff;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
}

.main-layout {
  height: 100%;
}
.el-container {
  height: 100%;
}

.state-bar {
  z-index: 10000;
  color: white;
}
</style>
