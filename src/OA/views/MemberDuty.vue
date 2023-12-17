<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { errorAlert, successAlert, messageBox } from 'assets/js/message.js'

// import ShowDataBasicBar from '../components/ShowDataBasicBar.vue'
// import ShowDataBasicPie from '../components/ShowDataBasicPie.vue'
// import MemberList from '../components/MemberList.vue'
import exhibitDutyInfo from '../components/exhibitDutyInfo.vue'
import applyDutyLeave from '../components/applyDutyLeave.vue'

import { http } from 'assets/js/http'
import { useUserStore } from 'store/store'

// let location = reactive({
//   latitude: 0,
//   longtitude: 0
// })
let is_duty = ref(false)
let userStore = useUserStore()
let applyDutyDrawer = ref(false)

let nowDuty = reactive({
  start_time: '',
  duty_state: '不在值班时间内',
  pass_time: '00:00:00',
  timer: ''
})

const debounce = (function () {
  let timer = 0
  return function (callback, ms = 200) {
    //设置默认200ms
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()
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
  debounce(async () => {
    http
      .post('/StartDuty/', {
        sdut_id: userStore.sdut_id
      })
      .then((res) => {
        if (res.data == '签到失败') {
          errorAlert('签到失败')
          return
        }

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
  }, 500)
}

function toSecond(time) {
  let timeParts = time.split(':')

  if (timeParts.length === 3) {
    // 如果有时、分、秒三个部分
    let hours = parseInt(timeParts[0], 10)
    let minutes = parseInt(timeParts[1], 10)
    let seconds = parseInt(timeParts[2], 10)

    // 计算总秒数
    let totalSeconds = hours * 3600 + minutes * 60 + seconds

    return totalSeconds
  }
}

function toSignOutState() {
  http
    .post('/FinishDuty/', {
      sdut_id: userStore.sdut_id
    })
    .then((res) => {
      let data = res.data
      if (data.message == '签退成功') {
        is_duty.value = false
        clearInterval(nowDuty.timer)

        // 存到 pinia 中
        userStore.$patch({
          duty_start_time: '',
          duty_state: ''
        })
        is_duty.value = false
        nowDuty.start_time = ''
        nowDuty.duty_state = '已签退'

        successAlert('签退成功')
      } else {
        is_duty.value = false
        clearInterval(nowDuty.timer)
        // 存到 pinia 中
        userStore.$patch({
          duty_start_time: '',
          duty_state: ''
        })
        is_duty.value = false
        nowDuty.start_time = ''
        nowDuty.duty_state = '已签退'
        errorAlert(data.message)
      }
      console.log(res)
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('签退失败')
    })
}

function finishDuty() {
  const success = () => {
    toSignOutState()
  }

  const error = (action) => {
    if (action === 'cancel') {
      errorAlert('取消签退')
    } else {
      errorAlert('取消签退')
    }
  }

  let text = "'值班不足30分钟，不会计入总时长，确定签退吗？'"
  let title = '签退'
  let confirmText = '确认签退'
  let cancelText = '取消'
  if (toSecond(nowDuty.pass_time) < 1800) {
    messageBox(text, title, confirmText, cancelText, success, error)
  } else {
    toSignOutState()
  }
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
}

function displayApplyDuty(res) {
  applyDutyDrawer.value = res
}

function applyLeave() {
  // applyDutyDrawer.value = true
  displayApplyDuty(true)
}

onMounted(() => {
  checkDuty()
})

onUnmounted(() => {
  // 页面销毁前，清除定时器
  clearInterval(nowDuty.timer)
})
</script>
<template>
  <div class="main-layout">
    <div class="start-duty animate__animated animate__fadeInDown">
      <div class="sigb-btn-box">
        <div v-if="!is_duty" class="sign-btn" @click="startDuty">签到</div>
        <div v-else class="sign-btn" @click="finishDuty">签退</div>
      </div>
      <div class="now-duty">
        <div class="now-duty-time">{{ is_duty ? nowDuty.pass_time : '未值班' }}</div>
        <el-divider class="duty_divider" />
        <div class="now-duty-state">{{ nowDuty.duty_state }}</div>
      </div>
      <div class="my-duty">
        <div class="record-btn my-duty-btn">值班记录</div>
        <div class="leave-btn my-duty-btn" @click="applyLeave">值班请假</div>
      </div>
    </div>
    <el-divider />
    <!-- <router-view name="Exhibition"></router-view> -->
    <exhibitDutyInfo> </exhibitDutyInfo>
    <applyDutyLeave :drawer="applyDutyDrawer" @displayApplyDuty="displayApplyDuty"></applyDutyLeave>
  </div>
</template>

<style scoped>
.start-duty {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.sigb-btn-box {
  width: 30%;
  /* width: 250px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sign-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  font-size: 60px;
  color: #008aff;
  border-radius: 4000px;
  border: 3px solid #008aff;
  background-color: white;
  /* box-shadow: 0 0 10px 10px hsla(208, 80%, 61%, 0.498); */
  transition:
    box-shadow 0.25s,
    transform 0.5s;
}

.sign-btn:hover {
  box-shadow: 0 0 10px 10px rgba(215, 215, 215, 0.694);
  transform: scale(1.05, 1.05);
}

.now-duty {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 50px;
}

.now-duty-time {
  font-size: 30px;
}
.now-duty-state {
  border-radius: 25px;
  font-size: 50px;
  padding: 20px 20px;
  /* border: 3px solid #008aff; */
  color: #008aff;
}

.my-duty {
  width: 30%;
  /* width: 250px; */
  /* height: 200px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.my-duty-btn {
  font-size: 40px;
  padding: 20px;
  margin: 20px 0;
  /* animation-name: slidein; */
  transition:
    box-shadow 0.25s,
    transform 0.5s;
}

.record-btn {
  color: #008aff;
  background-color: white;
  border-radius: 30px;
  border: 3px solid #008aff;
}

.leave-btn {
  color: #008aff;
  background-color: white;
  border-radius: 30px;
  /* border: 3px solid #fe8a13; */
  border: 3px solid #008aff;
}

.record-btn:hover {
  box-shadow: 0 0 10px 10px rgba(215, 215, 215, 0.694);
  transform: scale(1.05, 1.05);
}

.leave-btn:hover {
  box-shadow: 0 0 10px 10px rgba(215, 215, 215, 0.694);
  transform: scale(1.05, 1.05);
}

.main-layout {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.duty_divider {
  margin: 10px;
}
</style>
