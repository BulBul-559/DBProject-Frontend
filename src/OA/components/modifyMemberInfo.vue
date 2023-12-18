<script setup>
import { http } from 'assets/js/http'
import { less768 } from 'assets/js/screen'
import { reactive, onMounted, ref } from 'vue'
import { errorAlert, successAlert, messageBox } from 'assets/js/message.js'

const propData = defineProps(['drawer', 'info'])
const emit = defineEmits(['displayMemberEdit', 'getInfo'])

let memberInfo = reactive(propData.info)

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

function modifyMemberInfo() {
  if (
    (memberInfo.duty[1].day == 0 && memberInfo.duty[1].frame != 0) ||
    (memberInfo.duty[0].day == 0 && memberInfo.duty[0].frame != 0) ||
    (memberInfo.duty[1].day != 0 && memberInfo.duty[1].frame == 0) ||
    (memberInfo.duty[0].day != 0 && memberInfo.duty[0].frame == 0)
  ) {
    errorAlert('请完善值班信息')
    return
  }

  http
    .post('/ModifySingleYoutholInfo/', {
      sdut_id: memberInfo.sdut_id,
      department: memberInfo.department,
      name: memberInfo.name,
      identity: memberInfo.identity,
      duty: memberInfo.duty
    })
    .then((res) => {
      console.log(res)
      successAlert('修改成功')
      emit('displayMemberEdit', false)
      emit('getInfo')
    })
    .catch((err) => {
      console.log(err)
      errorAlert('修改失败')
    })
}

let handleClose = (done) => {
  emit('displayMemberEdit', false)
  done()
}

const handleDelete = () => {
  const success = () => {
    http
      .post('/DeletYoutholer/', {
        sdut_id: memberInfo.sdut_id,
        department: memberInfo.department
      })
      .then((res) => {
        console.log(res)
        successAlert('删除成员成功')
        emit('displayMemberEdit', false)
        emit('getInfo')
      })
      .catch((err) => {
        console.log(err)
        errorAlert('删除成员失败')
      })
  }
  const error = () => {
    errorAlert('取消操作')
  }

  let title = '删除成员'
  let text = '确定要删除 ' + memberInfo.name + ' 吗？'
  let confirmText = '确定删除'
  let cancelText = '取消'

  messageBox(text, title, confirmText, cancelText, success, error)
}

let _size = ref('40%')
onMounted(() => {
  if (less768()) {
    _size.value = '90%'
  }
})
</script>
<template>
  <el-drawer
    :size="_size"
    :modelValue="drawer"
    title="编辑成员信息"
    direction="rtl"
    :before-close="handleClose"
  >
    <template #default>
      <el-form
        label-position="top"
        label-width="100px"
        :model="memberInfo"
        style="max-width: 460px"
      >
        <el-form-item prop="memberInfo.name" label="姓名">
          <el-input v-model="memberInfo.name" />
        </el-form-item>
        <el-form-item prop="memberInfo.department" label="部门">
          <el-select v-model="memberInfo.department" class="m-2" placeholder="部门">
            <el-option
              v-for="item in departmentOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="memberInfo.identity" label="类别">
          <el-select v-model="memberInfo.identity" class="m-2" placeholder="类别">
            <el-option
              v-for="item in identityOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="memberInfo.duty[0].day" label="值班1">
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
        <el-form-item prop="memberInfo.duty[1].day" label="值班2">
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
        <el-button type="primary" plain @click="modifyMemberInfo">确认修改</el-button>
        <el-button type="danger" plain @click="handleDelete">删除成员</el-button>
      </el-form>
    </template>
  </el-drawer>
</template>

<style scoped>
.duty-select {
  margin: 0 3px;
}
</style>
