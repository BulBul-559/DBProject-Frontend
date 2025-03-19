<script setup>
import { ref, onMounted, reactive } from 'vue'
import { less768 } from 'assets/js/screen'
import { http } from 'assets/js/http'
import { errorAlert, successAlert } from 'assets/js/message.js'

const tableRef = ref()
let borrowFormRef = ref()
let borrowInfo = reactive({
  battery: 0,
  memoryCard: 0,
  tripod: 0,
  lamp: 0,
  len: 0,
  card: 0
})

let tableData = reactive([])
let loading = ref(false)
let _table_size = ref('large')

function GetBestMachine() {
  if (loading.value == true) {
    errorAlert('正在获取数据，请稍后')
    return
  }

  loading.value = true
  http
    .post('/GetBestMachine/', {
      battery: borrowInfo.battery,
      memory_card: borrowInfo.memoryCard,
      tripod: borrowInfo.tripod,
      lamp: borrowInfo.lamp,
      len: borrowInfo.len,
      card: borrowInfo.card
    })
    .then((res) => {
      console.log(res)
      let data = res.data
      tableData.length = 0
      for (let i = 0; i < data.length; i++) {
        let temp = {
          machine_id: data[i].machine_id,
          machine_name: data[i].machine_name,
          machine_type: data[i].machine_type
        }
        tableData.push(temp)
      }
      loading.value = false
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('获取借用信息失败')
      loading.value = false
    })
}
const ApplyMachineBorrow = (index, row) => {
  let mechine_id = row.machine_id
  http
    .post('/ApplyMachineBorrow/', {
      mechine_id: mechine_id,
      battery: borrowInfo.battery,
      memory_card: borrowInfo.memoryCard,
      tripod: borrowInfo.tripod,
      lamp: borrowInfo.lamp,
      len: borrowInfo.len,
      card: borrowInfo.card
    })
    .then((res) => {
      if (res.data == 'success') {
        successAlert('申请成功')
        tableData.length = 0
        // getBorrowInfo()
      } else {
        errorAlert('申请失败')
      }
    })
    .catch((err) => {
      console.log(err)
      errorAlert('未知错误')
    })
}

onMounted(() => {
  // getAllYoutholer()
  if (less768()) {
    _table_size.value = 'small'
  }
})
</script>
<template>
  <div class="main_box">
    <div class="requir-box">
      <el-form
        ref="borrowFormRef"
        :model="borrowInfo"
        style="max-width: 860px"
        class="choice"
        label-position="top"
      >
        <div class="box">
          <el-form-item prop="battery" label="电池">
            <el-input-number
              v-model="borrowInfo.battery"
              :min="0"
              :max="20"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item prop="memoryCard" label="内存卡">
            <el-input-number
              v-model="borrowInfo.memoryCard"
              :min="0"
              :max="30"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item prop="tripod" label="三脚架">
            <el-input-number
              v-model="borrowInfo.tripod"
              :min="0"
              :max="50"
              @change="handleChange"
            />
          </el-form-item>
        </div>
        <div class="box">
          <el-form-item prop="lamp" label="灯">
            <el-input-number v-model="borrowInfo.lamp" :min="0" :max="50" @change="handleChange" />
          </el-form-item>
          <el-form-item prop="len" label="镜头">
            <el-input-number v-model="borrowInfo.len" :min="0" :max="20" @change="handleChange" />
          </el-form-item>
          <el-form-item prop="card" label="滤镜">
            <el-input-number v-model="borrowInfo.card" :min="0" :max="10" @change="handleChange" />
          </el-form-item>
        </div>
      </el-form>
      <div class="btn" @click="GetBestMachine">查看推荐设备</div>
    </div>
    <el-divider />
    <div class="result">
      <el-table
        ref="tableRef"
        class="table"
        row-key="unique_id"
        key="unique_id"
        :data="tableData"
        v-loading="loading"
        :size="_table_size"
      >
        <el-table-column prop="machine_id" label="设备编号" sortable />
        <el-table-column prop="machine_name" label="设备名称" sortable />
        <el-table-column prop="machine_type" label="设备类型" sortable />
        <!-- <el-table-column prop="option" label="操作">
          <template #default="scope">
            <el-button type="danger" @click="ApplyMachineBorrow(scope.$index, scope.row)"
              >申请</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.result {
  width: 60%;
}
.requir-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.main_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.choice {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-form-item {
  width: 300px;
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  width: 120px;
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
</style>
