<script setup>
import { http } from 'assets/js/http'
import { ref, reactive, onMounted } from 'vue'
import { errorAlert, successAlert } from 'assets/js/message.js'

defineProps(['drawer'])
const emit = defineEmits(['displayApplyDuty'])

const formatterApplyTime = (data) => {
  let res = data.apply_time

  return res
}
const formatterLeaveDate = (data) => {
  let res = data.leave_date.split(' ')[0]

  return res
}
const formatterDay = (data) => {
  let res = ''
  res += '周'
  switch (data.day) {
    case 1:
      res += '一'
      break
    case 2:
      res += '二'
      break
    case 3:
      res += '三'
      break
    case 4:
      res += '四'
      break
    case 5:
      res += '五'
      break
    case 6:
      res += '六'
      break
    case 7:
      res += '日'
      break
  }
  return res
}

const formatterFrame = (data) => {
  let res = ''
  res += '第'
  switch (data.frame) {
    case 1:
      res += '12节'
      break
    case 2:
      res += '34节'
      break
    case 3:
      res += '56节'
      break
    case 4:
      res += '78节'
      break
    case 5:
      res += '910节'
  }
  return res
}

let tableData = reactive([])
let leaveInfo = reactive({
  date: []
})
let dutyOption = reactive([])
let allow = ref(false)

function postLeaveApply() {
  http
    .post('/applyDutyLeave/', {
      leave: leaveInfo.date
    })
    .then((res) => {
      if (res.data == '请假成功') {
        successAlert('请假成功')
        getLeaveRecord()
        emit('displayApplyDuty', false)
      } else if (res.data == '重复请假') {
        errorAlert('请勿重复请假')
      }
    })
    .catch((err) => {
      console.log(err)
      errorAlert('添加失败')
    })
}

function submitLeave() {
  if (leaveInfo.date.length == 0) {
    errorAlert('请选择请假时间')
  } else {
    postLeaveApply()
  }
}

let handleClose = (done) => {
  emit('displayApplyDuty', false)
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

function getDutyInfo() {
  http
    .post('/getSingleDutyTime/', {})
    .then((res) => {
      console.log(res)
      let data = res.data
      dutyOption.length = 0
      if (data[0].day == 0 && data[1].day == 0) {
        // 说明没有值班任务
        // 将按钮禁用
        allow.value = true
        dutyOption.push('无值班任务')
        successAlert({
          label: '当前无值班任务',
          value: '0,0'
        })
        return
      }
      // 至少有一个值班任务
      // 显示最近四或五次值班任务
      const nowDate = new Date()
      let cnt = 0
      // 特判今天
      for (let j = 0; j < 2; j++) {
        if (data[j].day == 0) continue

        if (data[j].day == ((nowDate.getDay() + 6) % 7) + 1) {
          // 今天需要值班
          let ymd = toStringDate(nowDate) + 'T'
          let startTime = 0
          switch (data[j].frame) {
            case 1:
              startTime = '08:00:00'
              break
            case 2:
              startTime = '10:00:00'
              break
            case 3:
              startTime = '14:00:00'
              break
            case 4:
              startTime = '16:00:00'
              break
            case 5:
              startTime = '19:00:00'
              break
          }
          const anotherDate = new Date(ymd + startTime)
          // 计算两个日期之间的分钟差
          let timeDifference = Math.floor((anotherDate - nowDate) / (1000 * 60))
          if (timeDifference < 30) {
            continue
          } else {
            let temp = toStringDate(nowDate) + '第'
            temp += (data[j].frame * 2 - 1).toString() + (data[j].frame * 2).toString() + '节'
            dutyOption.push({
              label: temp,
              value:
                toStringDate(nowDate) +
                ',' +
                data[j].day.toString() +
                ',' +
                data[j].frame.toString() +
                ',' +
                cnt.toString()
            })
            cnt++
          }
        }
      }
      for (let i = 1; dutyOption.length < 4; i++) {
        let futureDate = new Date(nowDate.getTime() + i * 24 * 60 * 60 * 1000)
        let days = ((futureDate.getDay() + 6) % 7) + 1 //转化为 1 周一 2 周二 。。。 7周天
        for (let j = 0; j < 2; j++) {
          if (data[j].day == 0) continue

          if (data[j].day == days) {
            // 如果这一天有值班则添加进去
            let temp = toStringDate(futureDate) + '第'
            temp += (data[j].frame * 2 - 1).toString() + (data[j].frame * 2).toString() + '节'
            dutyOption.push({
              label: temp,
              value:
                toStringDate(futureDate) +
                ',' +
                data[j].day.toString() +
                ',' +
                data[j].frame.toString() +
                ',' +
                cnt.toString()
            })
          }
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

function getLeaveRecord() {
  http
    .post('/getSingleLeaveRecord/', {})
    .then((res) => {
      let data = res.data
      console.log(data)
      tableData.length = 0
      for (let i = 0; i < data.length; i++) {
        let temp = {
          apply_time: data[i].apply_time,
          leave_date: data[i].leave_date,
          day: data[i].day,
          frame: data[i].frame
        }
        tableData.push(temp)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
onMounted(() => {
  getDutyInfo()
  getLeaveRecord()
})
</script>
<template>
  <el-drawer :modelValue="drawer" title="值班请假" direction="rtl" :before-close="handleClose">
    <template #default>
      <el-form label-position="top" label-width="100px" :model="leaveInfo" style="max-width: 460px">
        <el-form-item prop="leaveChoice" label="时间">
          <el-select v-model="leaveInfo.date" class="m-2" placeholder="时间" multiple>
            <el-option
              v-for="item in dutyOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" plain @click="submitLeave" :disabled="allow">提交请假</el-button>
      </el-form>
      <el-table
        :data="tableData"
        :default-sort="{ prop: 'apply_time', order: 'descending' }"
        :key="true"
        border
        style="width: 100%; margin: 20px 0 0 0"
      >
        <el-table-column
          prop="apply_time"
          label="申请时间"
          :formatter="formatterApplyTime"
          sortable
        />
        <el-table-column
          prop="leave_date"
          label="请假日期"
          :formatter="formatterLeaveDate"
          sortable
        />
        <el-table-column prop="day" label="星期" :formatter="formatterDay" sortable />
        <el-table-column prop="frame" label="节" :formatter="formatterFrame" sortable />
      </el-table>
    </template>
  </el-drawer>
</template>

<style scoped>
.duty-select {
  margin: 0 3px;
}
</style>
