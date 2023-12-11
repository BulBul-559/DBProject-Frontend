<script setup>
import { ref, reactive, onMounted } from 'vue'
import { errorAlert } from 'assets/js/message.js'
import * as echarts from 'echarts'
let is_signin = ref(false)
// let location = reactive({
//   latitude: 0,
//   longtitude: 0
// })

let nowDuty = reactive({
  is_start: false,
  start_time: '',
  duty_state: '不在值班时间内'
})

function getLocation() {
  let lat = 0
  let longt = 0
  navigator.geolocation.getCurrentPosition(
    (res) => {
      console.log(res.coords)
      console.log(res.coords.latitude)
      console.log(res.coords.longitude)
    },
    (res) => {
      // errorAlert('获取位置失败,请允许浏览器获取你的位置')
      console.log(res)
      errorAlert(res.message)
    },
    (res) => {
      console.log(res)
    }
  )
  return { lat, longt }
}

function signIn() {
  getLocation()
}

const main = ref()
onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value)
  // 绘制图表
  myChart.setOption({
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })
  // getLocation()
})
</script>
<template>
  <div class="main-layout">
    <div class="start-duty">
      <div v-if="!is_signin" class="sign-btn" @click="signIn">签到</div>
      <div v-else class="sign-btn" @click="signOut">签退</div>
      <div class="now-duty">
        <div class="now-duty-time">{{ nowDuty.is_start ? nowDuty.start_time : '未值班' }}</div>
        <div class="now-duty-state">{{ nowDuty.duty_state }}</div>
      </div>
    </div>
    <el-divider />
    <div class="exhibit-info">
      <div ref="main" style="width: 100%; height: 400px"></div>
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
  /* background-color: #9dffa0; */
}
</style>