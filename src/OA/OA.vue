<script setup>
import { reactive, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { http } from 'assets/js/http.js' //配置了基本的设置
import { less768 } from 'assets/js/screen.js' //配置了基本的设置
import { useUserStore } from 'store/store.js'
import { errorAlert } from 'assets/js/message.js'

import navList from './components/navList.vue'

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
    .post('/GetYoutholerInfo/', {})
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
      return true
    })
    .catch(function (error) {
      console.log(error)
      userStore.$patch({ sdut_id: 'no id', is_login: false })
      return false
    })
}

function checkDuty() {
  http
    .post('/CheckDuty/', {
      sdut_id: userStore.sdut_id
    })
    .then((res) => {
      console.log(res.data)
      let data = res.data
      if (data.duty_state == '未值班') return

      userStore.$patch({
        is_login: true,
        duty_start_time: data.start_time,
        duty_state: data.duty_state
      })
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('检查签到状态失败')
    })
}

let handleClose = (done) => {
  done()
}

let drawer = ref(false)
function displayHeaderNav(res) {
  drawer.value = res
}

let _size = ref('0%')
onMounted(() => {
  if (less768()) {
    _size.value = '90%'
  }
  if (userStore.is_login == true) {
    //先检查 pinia
    checkDuty()
    return
  } else if (verifySignIn() === false) {
    //未登录重定向
    window.location.href = '/youthol/'
  } else {
    checkDuty()
  }
})
</script>

<template>
  <div class="main-layout">
    <el-container>
      <el-header class="header-nav">
        <img
          src="../assets/img/youthol.png"
          alt=""
          class="youthol-logo"
          @click="displayHeaderNav(true)"
        />

        <el-drawer
          :size="_size"
          v-model="drawer"
          :with-header="false"
          direction="ttb"
          :before-close="handleClose"
        >
          <template #default>
            <div class="header-nav-drawer">
              <div class="nav-item" @click="displayHeaderNav(false)">关闭菜单</div>
              <navList @display-header-nav="displayHeaderNav"> </navList>
            </div>
          </template>
        </el-drawer>
      </el-header>

      <el-container>
        <el-aside class="aside-nav">
          <div class="user-info">
            <!-- <el-image class="profile" :src="userInfo.profileSrc" fit="cover" /> -->
            <div class="user-info-detail">
              <div class="user-name">{{ userStore.name }}</div>
              <div class="department">{{ userStore.department }}</div>
            </div>
          </div>
          <navList> </navList>

          <!-- <img src="../assets/img/youthol.png" alt="" class="youthol-logo" /> -->
        </el-aside>
        <el-main>
          <el-scrollbar>
            <router-view name="MainComponment"></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>

      <!-- <el-footer class="state-bar">
        <div class="all-duty">累计值班：{{ stateBar.allDuty }}小时</div>
        <div class="duty-state">{{ userStore.duty_state }}</div>
        <div class="now-brorrow">正在借用设备：{{ stateBar.nowBrorrow }}</div>
      </el-footer> -->
    </el-container>
  </div>
</template>

<style scoped>
@media only screen and (min-width: 768px) {
  /* for desktop */
  .youthol-logo {
    display: none;
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }
  .user-info-detail {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'SmileySans';
    font-size: 30px;
  }

  .user-info-detail > div {
    color: white;
    padding: 5px;
  }

  .el-scrollbar {
    width: 100%;
  }
  .header-nav {
    height: 0px;
  }
  .aside-nav {
    height: 100%;
    width: 200px;
    background-color: #008aff;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .nav-item {
    margin: 3px 0;
    width: 100%;
    padding: 20px 0px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }

  .nav-item:hover {
    opacity: 1;
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.7);
    transform: scale(1.05, 1.05);
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
    z-index: 100;
    color: white;
  }
}

@media only screen and (max-width: 768px) {
  /* for phone */
  .header-nav-drawer {
    width: 100%;
    height: 100%;
    /* background-color: #008aff; */
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
  }

  .user-info-detail {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'SmileySans';
    font-size: 30px;
  }

  .user-info-detail > div {
    color: white;
    padding: 5px;
  }

  .el-scrollbar {
    width: 100%;
  }

  .el-main {
    padding: 50px 10px 10px;
  }

  .youthol-logo {
    height: 40px;
    /* width: 105px; */
    width: auto;
  }
  .header-nav {
    height: 50px;
    width: 100%;
    z-index: 1000;
    /* background-color: #008aff; */
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
  }
  .aside-nav {
    height: 100%;
    width: 0px;
    background-color: #008aff;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .nav-item {
    margin: 3px 0;
    width: 100%;
    padding: 20px 0px;
    color: #f68512;
    font-weight: 800;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transition:
      transform 0.3s,
      box-shadow 0.3s;
  }

  .nav-item:hover {
    opacity: 1;
    box-shadow: inset 0 0 20px #57b1ff6f;
    transform: scale(1.05, 1.05);
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
    z-index: 100;
    color: white;
  }
}
</style>
