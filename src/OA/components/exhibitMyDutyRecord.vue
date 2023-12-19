<script setup>
import { http } from 'assets/js/http'
import { ref, reactive, onMounted } from 'vue'

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

let tableData = reactive([])
let _size = ref('50%')

let handleClose = (done) => {
  emit('displayRecord', false)
  done()
}

function getMyDutyRecord() {
  http
    .post('/GetSingleDutyRecord/', {})
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
  let width = window.innerWidth
  // let height = window.innerHeight
  if (width < 768) {
    _size.value = '90%'
  }
  getMyDutyRecord()
})
</script>
<template>
  <el-drawer
    :size="_size"
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
