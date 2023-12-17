<script setup>
import { http } from 'assets/js/http'
import { ref, reactive, onMounted } from 'vue'
import { errorAlert, successAlert } from 'assets/js/message.js'

defineProps(['drawer'])
const emit = defineEmits(['displayRecord'])

const formatterStartTime = (data) => {
  let res = data.start_time

  return res
}

const formatterTotalTime = (data) => {
  let res = (data.total_time / 3600).toFixed(2)

  return res
}
const formatterEndTime = (data) => {
  let res = data.end_date
  // let res = data.leave_date.split(' ')[0]

  return res
}

let tableData = reactive([])

let handleClose = (done) => {
  emit('displayRecord', false)
  done()
}

function toStringDate(date) {
  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString().padStart(2, '0')
  let day = date.getDate().toString().padStart(2, '0')

  // 将年、月、日拼接成 YYYYMMDD 格式
  let yyMMdd = `${year}-${month}-${day}`

  return yyMMdd
}

function getMyDutyRecord() {
  http
    .post('/getSingleDutyRecord/', {})
    .then((res) => {
      let data = res.data
      console.log(data)
      tableData.length = 0
      for (let i = 0; i < data.length; i++) {
        let temp = {
          start_time: data[i].start_time,
          end_time: data[i].end_time,
          total_time: data[i].total_time,
          duty_state: data[i].duty_state
        }
        tableData.push(temp)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

onMounted(() => {
  getMyDutyRecord()
})
</script>
<template>
  <el-drawer
    size="50%"
    :modelValue="drawer"
    title="值班记录"
    direction="rtl"
    :before-close="handleClose"
  >
    <template #default>
      <el-table
        :data="tableData"
        :default-sort="{ prop: 'start_time', order: 'descending' }"
        :key="true"
        border
        style="width: 100%; margin: 20px 0 0 0"
      >
        <el-table-column
          prop="start_time"
          label="开始时间"
          :formatter="formatterStartTime"
          sortable
        />
        <el-table-column prop="end_time" label="结束时间" sortable />
        <el-table-column
          prop="total_time"
          label="总时长"
          :formatter="formatterTotalTime"
          sortable
        />
        <el-table-column prop="duty_state" label="状态" sortable />
      </el-table>
    </template>
  </el-drawer>
</template>

<style scoped></style>
