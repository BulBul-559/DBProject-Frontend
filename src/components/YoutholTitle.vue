<script setup>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'

let youthol_title = ref()
// var chartDom = document.getElementById('main');

onMounted(() => {
  var myChart = echarts.init(youthol_title.value)
  var option

  option = {
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: 'Youthol',
            fontSize: 140,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#fff',
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 2000,
            loop: false,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                // Stop for a while.
                percent: 0.8,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 1,
                style: {
                  fill: '#fff'
                }
              }
            ]
          }
        }
      ]
    }
  }

  option && myChart.setOption(option)
})
</script>
<template>
  <div ref="youthol_title" class="title"></div>
</template>

<style scoped>
.title {
  width: 650px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
