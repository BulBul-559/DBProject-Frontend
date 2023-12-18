<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { http } from 'assets/js/http'

let propData = defineProps({
  title: {
    default: ''
  },
  xData: {},
  seriesData: {}
})

let _width = ref('65%')
let _height = ref('620px')
let showData = ref()

function initChart(xData, seriesData) {
  // output each xData element
  // 基于准备好的dom，初始化echarts实例
  let myChart = echarts.init(showData.value)
  // 绘制图表
  myChart.setOption({
    title: {
      text: propData.title
    },
    tooltip: {},
    xAxis: {
      // 这里要放人名
      data: xData
    },
    yAxis: {},
    series: [
      {
        name: '值班时间',
        type: 'bar', //这个表示图表类型
        data: seriesData
      }
    ]
  })
}

function getTodatDuty() {
  http
    .post('/GetTodayDuty/')
    .then((res) => {
      let xData
      let seriesData
      let data = res.data
      let tempData = []
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i].start_time)
        let item = {
          sdut_id: data[i].sdut_id,
          name: data[i].name,
          department: data[i].department,
          start_time: data[i].start_time,
          end_time: data[i].end_time,
          duty_state: data[i].duty_state,
          total_time: data[i].total_time
        }
        tempData.push(item)
      }

      const idTotalTimeMap = {}

      // 遍历原始数组，累加每个 id 的总时间
      tempData.forEach((obj) => {
        const { name, total_time } = obj
        if (idTotalTimeMap[name]) {
          // 如果已经存在该 id，则累加 total_time
          idTotalTimeMap[name] += total_time
        } else {
          // 如果不存在该 id，则初始化为 total_time
          idTotalTimeMap[name] = total_time
        }
      })

      // 将累加结果转为新的数组
      let merged = Object.keys(idTotalTimeMap).map((name) => ({
        name: name, // 转为数字，如果 id 是字符串
        total_time: idTotalTimeMap[name]
      }))

      merged.sort((a, b) => b.total_time - a.total_time)
      merged = merged.slice(0, 10)

      xData = merged.map((item) => item.name)
      seriesData = merged.map((item) => (item.total_time / 3600).toFixed(2))

      initChart(xData, seriesData)
      // console.log(tableData)
    })
    .catch(function (error) {
      console.log(error)
    })
}
onMounted(() => {
  let width = window.innerWidth
  // let height = window.innerHeight
  if (width < 768) {
    _height.value = '400px'
  }
  getTodatDuty()
})
</script>

<template>
  <div ref="showData" class="chart" :style="{ '--width': _width, '--height': _height }"></div>
</template>

<style scoped>
.chart {
  width: var(--width);
  height: var(--height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
