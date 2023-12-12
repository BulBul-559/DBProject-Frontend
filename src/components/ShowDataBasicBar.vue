<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

let propData = defineProps({
  title: {
    default: ''
  },
  xData: {},
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
  let myChart = echarts.init(showData.value)
  // 绘制图表
  myChart.setOption({
    title: {
      text: propData.title
    },
    tooltip: {},
    xAxis: {
      // 这里要放人名
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '值班时间',
        type: 'bar', //这个表示图表类型
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
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
}
</style>
