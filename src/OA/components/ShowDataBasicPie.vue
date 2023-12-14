<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { http } from 'assets/js/http'

let propData = defineProps({
  title: {
    default: ''
  },
  seriesData: {},
  _width: {
    default: '65%'
    // default: '70%'
  },
  _height: {
    default: '620px'
  }
})

function initChart(data) {
  let myChart = echarts.init(showData.value)
  // 绘制图表
  var option

  option = {
    title: {
      text: propData.title,
      subtext: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '部门值班总时长',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  option && myChart.setOption(option)
}

let showData = ref()
onMounted(() => {
  http
    .post('/getTodayDuty/')
    .then((res) => {
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
        const { department, total_time } = obj
        if (idTotalTimeMap[department]) {
          // 如果已经存在该 id，则累加 total_time
          idTotalTimeMap[department] += total_time
        } else {
          // 如果不存在该 id，则初始化为 total_time
          idTotalTimeMap[department] = total_time
        }
      })

      // 将累加结果转为新的数组
      let merged = Object.keys(idTotalTimeMap).map((department) => ({
        department: department, // 转为数字，如果 id 是字符串
        total_time: idTotalTimeMap[department]
      }))

      merged.sort((a, b) => b.total_time - a.total_time)

      let resData = merged.map((obj) => ({
        name: obj.department,
        value: (obj.total_time / 3600).toFixed(2)
      }))
      initChart(resData)
      // console.log(tableData)
    })
    .catch(function (error) {
      console.log(error)
    })
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
