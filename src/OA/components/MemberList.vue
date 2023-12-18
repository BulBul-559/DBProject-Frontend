<script setup>
import { ref, onMounted, reactive } from 'vue'
import { http } from 'assets/js/http'
import { less768 } from 'assets/js/screen'

defineProps({
  title: {
    default: ''
  }
})

let _width = ref('70%')
let _height = ref('620px')
let tableData = reactive([])
const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}
function getTodayDuty() {
  http
    .post('/GetTodayDuty/')
    .then((res) => {
      let data = res.data
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i].start_time)
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
      // console.log(tableData)
    })
    .catch(function (error) {
      console.log(error)
    })
}
onMounted(() => {
  // let width = window.innerWidth
  // let height = window.innerHeight
  if (less768()) {
    _width.value = '95%'
    _height.value = '400px'
  }
  getTodayDuty()
})
</script>
<template>
  <div class="list" :style="{ '--width': _width, '--height': _height }">
    <el-table
      class="animate__animated animate__fadeInDown"
      :data="tableData"
      :default-sort="{ prop: 'start_time', order: 'descending' }"
      :key="true"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="姓名" sortable />
      <el-table-column
        prop="department"
        label="部门"
        :filters="[
          { text: '程序部', value: '程序部' },
          { text: '美工部', value: '美工部' },
          { text: '综合部', value: '综合部' },
          { text: '闪客部', value: '闪客部' },
          { text: '视频推广部', value: '视频推广部' },
          { text: '摄影部', value: '摄影部' },
          { text: '管理组', value: '管理组' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
      <el-table-column prop="start_time" label="开始时间" sortable />
      <el-table-column prop="end_time" label="结束时间" sortable />
      <el-table-column
        prop="duty_state"
        label="状态"
        :filters="[
          { text: '正在值班', value: '正在值班' },
          { text: '正常值班', value: '正常值班' },
          { text: '异常', value: '值班时间不足30分钟' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
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
