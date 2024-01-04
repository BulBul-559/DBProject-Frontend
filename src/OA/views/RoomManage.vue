<script setup>
import { ref, onMounted, reactive } from 'vue'
import { less768 } from 'assets/js/screen'
import { http } from 'assets/js/http'
import { errorAlert, successAlert } from 'assets/js/message.js'
import { departmentFilter, identityFilter } from 'assets/js/filter.js'

const tableRef = ref()

let tableData = reactive([])
let dateRange = ref('')
let loading = ref(false)
let _date_picker_size = ref('large')
let _table_size = ref('large')

const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}

function getDutyInfo() {
  if (loading.value == true) {
    errorAlert('正在获取数据，请稍后')
    return
  }

  if (dateRange.value[0] == '' || dateRange.value[1] == '') {
    errorAlert('请选择时间')
    return
  }
  if (dateRange.value[0] === undefined || dateRange.value[1] === undefined) {
    errorAlert('请选择时间')
    return
  }

  loading.value = true
  http
    .post('/GetTotalDutyInRange/', {
      start_time: dateRange.value[0],
      end_time: dateRange.value[1]
    })
    .then((res) => {
      console.log(res)
      let data = res.data
      tableData.length = 0
      for (let i = 0; i < data.length; i++) {
        let item = {
          sdut_id: data[i].sdut_id,
          unique_id: data[i].sdut_id + data[i].department,
          name: data[i].name,
          department: data[i].department,
          identity: data[i].identity,
          total_time: (data[i].total_time / 3600).toFixed(2),
          absence: data[i].absence,
          leave: data[i].leave
        }
        tableData.push(item)
      }
      successAlert('共找到' + tableData.length + '条值班信息')
      loading.value = false
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('获取值班信息失败')
    })
}

onMounted(() => {
  // getAllYoutholer()
  if (less768()) {
    _date_picker_size.value = 'small'
    _table_size.value = 'small'
  }
})

const shortcuts = [
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date()
      return [start, end]
    }
  },
  {
    text: '昨天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      end.setTime(end.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: '过去一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
      return [start, end]
    }
  },
  {
    text: '过去一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
      return [start, end]
    }
  }
]
</script>
<template>
  <div class="main-layout">
    <div class="options">
      <div class="date-picker">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          unlink-panels
          range-separator="到"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          :size="_date_picker_size"
          :shortcuts="shortcuts"
        />
      </div>
      <div class="btn" @click="getDutyInfo">查询</div>
    </div>
    <el-divider />
    <el-table
      ref="tableRef"
      class="table"
      row-key="unique_id"
      key="unique_id"
      :data="tableData"
      v-loading="loading"
      :size="_table_size"
    >
      <el-table-column prop="name" label="姓名" sortable />
      <el-table-column prop="sdut_id" label="学号" sortable />
      <el-table-column
        prop="department"
        label="部门"
        :filters="departmentFilter"
        :filter-method="filterHandler"
        sortable
      />

      <el-table-column prop="total_time" label="累计时长（小时）" sortable />
      <el-table-column prop="absence" label="缺勤" sortable />
      <el-table-column prop="leave" label="请假" sortable />

      <el-table-column
        prop="identity"
        label="类别"
        :filters="identityFilter"
        :filter-method="filterHandler"
        sortable
      />
    </el-table>
  </div>
</template>

<style scoped>
.main-layout {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.options {
  width: 100%;
  display: flex;
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
@media only screen and (min-width: 768px) {
  .table {
    width: 80%;
  }
}

@media only screen and (max-width: 768px) {
  .date-picker {
    margin: 20px 0;
  }

  .table {
    width: 98%;
  }
  .options {
    flex-direction: column;
  }
}
</style>
