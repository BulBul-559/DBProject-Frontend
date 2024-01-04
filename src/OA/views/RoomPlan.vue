<script setup>
import { ref, onMounted, reactive } from 'vue'
import { http } from 'assets/js/http'
import ExhibitRoomBorrow from '../components/exhibitRoomBorrow.vue'
import { useUserStore } from 'store/store.js'
import { errorAlert, successAlert } from 'assets/js/message.js'
let userStore = useUserStore()

let borrowInfo = reactive({
  dateValue: '',
  startTime: '',
  endTime: ''
})
let chartRef = ref()
let borrowFormRef = ref()

const verifyBorrowInfo = (rule, value, callback) => {
  if (borrowInfo.dateValue != '' && borrowInfo.startTime != '' && borrowInfo.endTime != '') {
    console.log('test')
    chartRef.value.add(borrowInfo.dateValue, borrowInfo.startTime, borrowInfo.endTime)
  }
  callback()
}
const rules = reactive({
  dateValue: [
    { required: true, validator: verifyBorrowInfo, message: '请选择借用日期', trigger: 'change' }
  ],
  startTime: [
    {
      required: true,
      validator: verifyBorrowInfo,
      message: '请选择借用开始时间',
      trigger: 'change'
    }
  ],
  endTime: [
    {
      required: true,
      validator: verifyBorrowInfo,
      message: '请选择借用结束时间',
      trigger: 'change'
    }
  ]
})

let roomBorrowData
let dateRange = ref([])
function GetRoomBorrow() {
  http
    .post('/GetRoomBorrow/', {})
    .then((res) => {
      roomBorrowData = res.data
      for (let i = roomBorrowData['recent14Day']['data'].length - 1; i >= 0; i--) {
        dateRange.value.push({ label: roomBorrowData['recent14Day']['data'][i][0], value: i })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

let applying = false
function applyRoom() {
  chartRef.value.add()
  if (borrowInfo.dateValue == '' || borrowInfo.startTime == '' || borrowInfo.endTime == '') {
    errorAlert('请完善信息')
    return
  }
  if (applying) {
    errorAlert('申请已提交，请稍后')
    return
  }
  applying = true
  http
    .post('/ApplyRoomBorrow/', {
      date: borrowInfo.dateValue,
      start_time: borrowInfo.startTime,
      end_time: borrowInfo.endTime,
      people: userStore.department,
      room_id: '302'
    })
    .then((res) => {
      console.log(res.data)
      applying = false
      if (res.data == 'success') {
        chartRef.value.GetNewData()
        successAlert('借用成功')
      } else if (res.data == 'busy') {
        errorAlert('借用失败')
      } else {
        errorAlert('未知错误')
      }
    })
    .catch(() => {})
}

onMounted(() => {
  GetRoomBorrow()
})
</script>
<template>
  <div class="options">
    <el-form
      class="date-picker"
      ref="borrowFormRef"
      :rules="rules"
      label-position="left"
      :model="borrowInfo"
      style="max-width: 860px"
    >
      <el-form-item prop="dateValue" label="借用日期" class="form-item">
        <el-select v-model="borrowInfo.dateValue" clearable placeholder="Select">
          <el-option
            v-for="item in dateRange"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="startTime" label="借用开始时间" class="form-item">
        <el-time-select
          v-model="borrowInfo.startTime"
          :max-time="borrowInfo.endTime"
          class="mr-4"
          placeholder="Start time"
          start="08:00"
          step="00:30"
          end="22:00"
        />
      </el-form-item>
      <el-form-item prop="endTime" label="借用结束时间" class="form-item">
        <el-time-select
          v-model="borrowInfo.endTime"
          :min-time="borrowInfo.startTime"
          placeholder="End time"
          start="08:00"
          step="00:30"
          end="22:00"
        />
      </el-form-item>
    </el-form>
    <div class="btn" @click="applyRoom">借用</div>
  </div>
  <ExhibitRoomBorrow ref="chartRef"></ExhibitRoomBorrow>
</template>

<style scoped>
.options {
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}

.btn {
  font-size: 20px;
  margin: 8px 20px;
  padding: 8px 20px;
  border-radius: 10px;
  font-weight: 700;
  color: #008aff;
  background-color: white;
  border: 3px #008aff solid;
}

.btn:hover {
  color: white;
  background-color: #008aff;
}
.date-picker {
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}
.form-item {
  margin: 10px;
}

@media only screen and (max-width: 768px) {
  .date-picker {
    margin: 20px 0;
  }
  .options {
    flex-direction: column;
  }
}
</style>
