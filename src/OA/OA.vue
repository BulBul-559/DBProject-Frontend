<script setup>
import { reactive, onMounted } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { http } from '../assets/js/http.js' //配置了基本的设置
import { useUserStore } from '../store/store.js'

let userInfo = reactive({
  profileSrc: '/src/assets/img/me.jpg',
  username: '孙美源',
  department: '程序部'
})

let stateBar = reactive({
  allDuty: '4.5',
  dutyState: '未值班',
  nowBrorrow: '1'
})
let store = useUserStore()

function verifySignIn() {
  http
    .post(
      '/verify/getUserInfo/',
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
      // store.$patch({ sdut_id: res.data.sdut_id })
      console.log(res)
    })
    .catch(function (error) {
      console.log(error)
    })
}

onMounted(() => {
  if (store.is_login == true) {
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
            <el-image class="profile" :src="userInfo.profileSrc" fit="cover" />
            <div class="user-info-detail">
              <div class="user-name">{{ userInfo.username }}</div>
              <div class="department">{{ userInfo.department }}</div>
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
          </el-scrollbar>
          <!-- <img src="../assets/img/youthol.png" alt="" class="youthol-logo" /> -->
        </el-aside>
        <el-main>
          <router-view name="MainComponment"></router-view>
        </el-main>
      </el-container>

      <el-footer class="state-bar">
        <div class="all-duty">累计值班：{{ stateBar.allDuty }}小时</div>
        <div class="duty-status">未值班</div>
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
  display: flex;
  background-color: #008aff;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  bottom: 0;
}

.main-layout {
  height: 100%;
}
.el-container {
  height: 100%;
}

.state-bar {
  color: white;
}
</style>