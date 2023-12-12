<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

let propData = defineProps({
  title: {
    default: ''
  },
  seriesData: {},
  _width: {
    default: '70%'
  },
  _height: {
    default: '620px'
  }
})

let showData = ref()
onMounted(() => {
  console.log(propData.title)
  let myChart = echarts.init(showData.value)
  // 绘制图表
  var option

  option = {
    title: {
      text: propData.title,
      subtext: 'Fake Data',
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
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
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
})
</script>

<template>
  <div ref="showData" class="chart" :style="{ '--width': _width, '--height': _height }"></div>
</template>

<style scoped>
.chart {
  width: var(--width);
  height: var(--height);
}
</style>
