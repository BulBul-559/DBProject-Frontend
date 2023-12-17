<script setup>
import { http } from 'assets/js/http'
import { ref, reactive } from 'vue'
import { errorAlert, successAlert, messageBox } from 'assets/js/message.js'

defineProps(['drawer'])
const emit = defineEmits(['displayMemberAdd', 'getInfo'])

const departmentOption = [
  { label: '程序部', value: '程序部' },
  { label: '美工部', value: '美工部' },
  { label: '综合部', value: '综合部' },
  { label: '闪客部', value: '闪客部' },
  { label: '视频推广部', value: '视频推广部' },
  { label: '摄影部', value: '摄影部' }
]

const identityOption = [
  { label: '试用', value: '试用' },
  { label: '正式', value: '正式' },
  { label: '管理员', value: '管理员' }
]

const dutyDay = [
  { label: '0：未安排', value: '0' },
  { label: '1：周一', value: '1' },
  { label: '2：周二', value: '2' },
  { label: '3：周三', value: '3' },
  { label: '4：周四', value: '4' },
  { label: '5：周五', value: '5' },
  { label: '6：周六', value: '6' },
  { label: '7：周日', value: '7' }
]
const dutyFrame = [
  { label: '0：未安排', value: '0' },
  { label: '1：12节', value: '1' },
  { label: '2：34节', value: '2' },
  { label: '3：56节', value: '3' },
  { label: '4：78节', value: '4' },
  { label: '5：910节', value: '5' }
]
const verifyContent = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入学号'))
  }
  callback()
}

const ruleFormRef = ref()
const rules = reactive({
  sdut_id: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  ],
  college: [
    {
      required: true,
      message: '请输入学院',
      trigger: 'blur'
    }
  ],
  grade: [
    {
      required: true,
      message: '请输入专业班级',
      trigger: 'blur'
    }
  ],
  department: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'change'
    }
  ],
  identity: [
    {
      required: true,
      message: '请选择成员身份',
      trigger: 'change'
    }
  ]
})

const memberInfo = reactive({
  sdut_id: '',
  name: '',
  college: '',
  grade: '',
  department: '',
  identity: '',
  duty: [
    { day: 0, frame: 0 },
    { day: 0, frame: 0 }
  ]
})

function postAddOneYoutholer() {
  http
    .post('/addOneYoutholer/', {
      sdut_id: memberInfo.sdut_id,
      name: memberInfo.name,
      college: memberInfo.college,
      grade: memberInfo.grade,
      department: memberInfo.department,
      identity: memberInfo.identity,
      duty: memberInfo.duty
    })
    .then((res) => {
      console.log(res)
      if (res.data == '添加成功') {
        successAlert('添加成功')
        emit('displayMemberAdd', false)
        emit('getInfo')
      } else {
        errorAlert('添加失败')
      }
    })
    .catch((err) => {
      console.log(err)
      errorAlert('添加失败')
    })
}

function checkDuty() {
  if (
    (memberInfo.duty[1].day == 0 && memberInfo.duty[1].frame != 0) ||
    (memberInfo.duty[0].day == 0 && memberInfo.duty[0].frame != 0) ||
    (memberInfo.duty[1].day != 0 && memberInfo.duty[1].frame == 0) ||
    (memberInfo.duty[0].day != 0 && memberInfo.duty[0].frame == 0)
  ) {
    errorAlert('请完善值班信息')
    return false
  }
  return true
}

const addOneYoutholer = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (checkDuty()) {
        postAddOneYoutholer()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
  //   postAddOneYoutholer()
}

let handleClose = (done) => {
  emit('displayMemberEdit', false)
  done()
}
</script>
<template>
  <el-drawer :modelValue="drawer" title="编辑成员信息" direction="rtl" :before-close="handleClose">
    <template #default>
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        label-position="top"
        label-width="100px"
        :model="memberInfo"
        style="max-width: 460px"
      >
        <el-form-item prop="sdut_id" label="学号">
          <el-input v-model="memberInfo.sdut_id" />
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="memberInfo.name" />
        </el-form-item>
        <el-form-item prop="college" label="学院">
          <el-input v-model="memberInfo.college" />
        </el-form-item>
        <el-form-item prop="grade" label="专业班级">
          <el-input v-model="memberInfo.grade" />
        </el-form-item>
        <el-form-item prop="department" label="部门">
          <el-select v-model="memberInfo.department" class="m-2" placeholder="部门">
            <el-option
              v-for="item in departmentOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="identity" label="类别">
          <el-select v-model="memberInfo.identity" class="m-2" placeholder="类别">
            <el-option
              v-for="item in identityOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="duty[0].day" label="值班1">
          <el-select v-model="memberInfo.duty[0].day" class="m-2 duty-select" placeholder="Select">
            <el-option
              v-for="item in dutyDay"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="memberInfo.duty[0].frame"
            class="m-2 duty-select"
            placeholder="Select"
          >
            <el-option
              v-for="item in dutyFrame"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="duty[1].day" label="值班2">
          <el-select v-model="memberInfo.duty[1].day" class="m-2 duty-select" placeholder="Select">
            <el-option
              v-for="item in dutyDay"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="memberInfo.duty[1].frame"
            class="m-2 duty-select"
            placeholder="Select"
          >
            <el-option
              v-for="item in dutyFrame"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" plain @click="addOneYoutholer(ruleFormRef)">添加新成员</el-button>
      </el-form>
    </template>
  </el-drawer>
</template>

<style scoped>
.duty-select {
  margin: 0 3px;
}
</style>
