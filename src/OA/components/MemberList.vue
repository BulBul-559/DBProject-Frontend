<script setup>
import { onMounted, reactive } from 'vue'
import { http } from '../../assets/js/http'

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

let tableData = reactive([])

onMounted(() => {
  http
    .post('/getTodayDuty/')
    .then((res) => {
      console.log(res.data)
      let data = res.data
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].start_time)
        let item = {
          sdut_id: data[i].sdut_id,
          name: data[i].name,
          department: data[i].department,
          start_time: data[i].start_time,
          end_time: data[i].end_time,
          duty_state: data[i].duty_state
        }
        tableData.push(item)
      }
      console.log(tableData)
    })
    .catch(function (error) {
      console.log(error)
    })
})
</script>
<template>
  <div class="list" :style="{ '--width': _width, '--height': _height }">
    <el-table :data="tableData" :key="true" border style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="start_time" label="开始时间" />
      <el-table-column prop="end_time" label="结束时间" />
      <el-table-column prop="duty_state" label="状态" />
    </el-table>
  </div>
</template>

<style scoped>
.list {
  margin: 20px 0;
  width: var(--width);
  height: var(--height);
}
</style>
