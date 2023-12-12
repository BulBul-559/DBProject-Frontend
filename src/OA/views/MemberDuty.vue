<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { errorAlert, successAlert } from 'assets/js/message.js'

// Import Swiper Vue.js components
// Import Swiper styles

import ShowDataBasicBar from 'components/ShowDataBasicBar.vue'
import ShowDataBasicPie from 'components/ShowDataBasicPie.vue'
import MemberList from '../components/MemberList.vue'
import { http } from '../../assets/js/http'
import { useUserStore } from '../../store/store'

// let location = reactive({
//   latitude: 0,
//   longtitude: 0
// })
let is_duty = ref(false)
let look_data = ref('列表')
let userStore = useUserStore()

let nowDuty = reactive({
  start_time: '',
  duty_state: '不在值班时间内',
  pass_time: '00:00:00',
  timer: ''
})

// function getLocation() {
//   let lat = 0
//   let longt = 0
//   navigator.geolocation.getCurrentPosition(
//     (res) => {
//       console.log(res.coords)
//       console.log(res.coords.latitude)
//       console.log(res.coords.longitude)
//     },
//     (res) => {
//       // errorAlert('获取位置失败,请允许浏览器获取你的位置')
//       console.log(res)
//       errorAlert(res.message)
//     },
//     (res) => {
//       console.log(res)
//     }
//   )
//   return { lat, longt }
// }

function startDuty() {
  http
    .post('/StartDuty/', {
      sdut_id: userStore.sdut_id
    })
    .then((res) => {
      is_duty.value = true
      successAlert('签到成功')
      let data = res.data

      // 存到 pinia 中
      userStore.$patch({
        is_login: true,
        duty_start_time: data.start_time,
        duty_state: data.duty_state
      })
      is_duty.value = true
      nowDuty.start_time = data.start_time
      nowDuty.duty_state = data.duty_state

      nowDuty.timer = setInterval(() => {
        nowDuty.pass_time = getTime(nowDuty.start_time)
      }, 1000)

      console.log(res)
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('签到失败')
    })
}

function finishDuty() {
  http
    .post('/FinishDuty/', {
      sdut_id: userStore.sdut_id
    })
    .then((res) => {
      let data = res.data
      if (data.message == '签退成功') {
        is_duty.value = false
        clearInterval(nowDuty.timer)
        successAlert('签退成功')
      }
      console.log(res)
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('签退失败')
    })
}

function getTime(start_time) {
  let now = new Date()
  // 获取目标时间，假设目标时间是今天的 %H:%M:%S
  let targetTime = new Date(start_time)
  // 计算时间差（单位：毫秒）
  let timeDiff = now.getTime() - targetTime.getTime()
  // 将毫秒转换为秒
  let seconds = Math.floor(timeDiff / 1000)
  // 计算时、分、秒
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds % 3600) / 60)
  let remainingSeconds = seconds % 60

  // 格式化输出
  var formattedTime =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    remainingSeconds.toString().padStart(2, '0')

  return formattedTime
}
onMounted(() => {
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
      is_duty.value = true
      nowDuty.start_time = data.start_time
      nowDuty.duty_state = data.duty_state

      nowDuty.timer = setInterval(() => {
        nowDuty.pass_time = getTime(nowDuty.start_time)
      }, 1000)
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('检查签到状态失败')
    })
})

onUnmounted(() => {
  // 页面销毁前，清除定时器
  clearInterval(nowDuty.timer)
})
</script>
<template>
  <div class="main-layout">
    <div class="start-duty">
      <div v-if="!is_duty" class="sign-btn" @click="startDuty">签到</div>
      <div v-else class="sign-btn" @click="finishDuty">签退</div>
      <div class="now-duty">
        <div class="now-duty-time">{{ is_duty ? nowDuty.pass_time : '未值班' }}</div>
        <el-divider class="duty_divider" />
        <div class="now-duty-state">{{ nowDuty.duty_state }}</div>
      </div>
    </div>
    <el-divider />
    <div class="exhibit-info">
      <el-radio-group v-model="look_data" size="large">
        <el-radio-button label="排名" />
        <el-radio-button label="部门" />
        <el-radio-button label="列表" />
      </el-radio-group>
      <ShowDataBasicBar v-if="look_data == '排名'" :title="''"></ShowDataBasicBar>
      <ShowDataBasicPie v-if="look_data == '部门'" :title="''"></ShowDataBasicPie>
      <MemberList v-if="look_data == '列表'" :title="''"></MemberList>
    </div>
  </div>
</template>

<style scoped>
.sign-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  font-size: 60px;
  color: white;
  border-radius: 4000px;
  background-color: #008aff;
}

.now-duty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 50px;
}
.main-layout {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}

.start-duty {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.exhibit-info {
  width: 100%;
  font-size: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: #9dffa0; */
}
.duty_divider {
  margin: 10px;
}
.now-duty-time {
  font-size: 30px;
}
.now-duty-state {
  border-radius: 25px;
  font-size: 50px;
  padding: 20px 20px;
  border: 3px solid #008aff;
  color: #008aff;
}
</style>
