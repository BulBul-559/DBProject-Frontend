<script setup>
import { http } from '../../assets/js/http'
import { useUserStore } from '../../store/store'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { errorAlert, successAlert, messageBox } from 'assets/js/message.js'
let userStore = useUserStore()

const tableRef = ref()

// const clearFilter = () => {
//   tableRef.value.clearFilter()
// }

// const formatter = (row, column) => {
//   let res = '地址是：' + row.address

//   return res
// }

// const filterTag = (value, row) => {
//   return row.tag === value
// }

const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}

// const tableData = [
//   {
//     name: '',
//     sdut_id: '',
//     department: '',
//     identity: '',
//     option: ''
//   }
// ]

let tableData = reactive([])

function getAllYoutholer() {
  http
    .post('/GetAllYoutholer/', {})
    .then((res) => {
      console.log(res)
      let data = res.data
      for (let i = 0; i < data.length; i++) {
        let item = {
          sdut_id: data[i].sdut_id,
          unique_id: data[i].sdut_id + data[i].department,
          name: data[i].name,
          department: data[i].department,
          identity: data[i].identity
        }
        tableData.push(item)
      }
    })
    .catch(function (error) {
      console.log(error)
      errorAlert('获取成员信息失败')
    })
}
onMounted(() => {
  getAllYoutholer()
})

const handleEdit = (index, row) => {
  console.log(row.sdut_id)
}
const handleDelete = (index, row) => {
  console.log(index, row)

  const success = () => {
    console.log('Deleted success')
  }
  const error = () => {
    console.log('Cancel Deleted')
  }

  let title = '删除成员'
  let text = '确定要删除 ' + row.name + ' 吗？'
  let confirmText = '确定删除'
  let cancelText = '取消'

  messageBox(text, title, confirmText, cancelText, success, error)
}

function addOneYouthol() {}

function addManyYouthol() {}
</script>
<template>
  <div class="main-layout">
    <div class="options">
      <div class="add-btn" @click="addOneYouthol">新增成员</div>
      <div class="add-btn" @click="addManyYouthol">批量导入</div>
    </div>

    <el-table ref="tableRef" class="table" row-key="unique_id" :data="tableData" size="large">
      <el-table-column prop="name" label="姓名" sortable />
      <el-table-column prop="sdut_id" label="学号" sortable />
      <el-table-column
        prop="department"
        label="部门"
        :filters="[
          { text: '程序部', value: '程序部' },
          { text: '美工部', value: '美工部' },
          { text: '综合部', value: '综合部' },
          { text: '闪客部', value: '闪客部' },
          { text: '视频推广部', value: '视频推广部' },
          { text: '摄影部', value: '摄影部' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
      <el-table-column
        prop="identity"
        label="类别"
        :filters="[
          { text: '试用', value: '试用' },
          { text: '正式', value: '正式' },
          { text: '管理员', value: '管理员' }
        ]"
        :filter-method="filterHandler"
        sortable
      />
      <el-table-column prop="option" label="操作">
        <template #default="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
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
.table {
  width: 80%;
}
.options {
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
}

.add-btn {
  font-size: 20px;
  margin: 10px 20px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  color: #008aff;
  background-color: white;
  border: 3px #008aff solid;
}

.add-btn:hover {
  color:  white;
  background-color: #008aff ;
}
</style>
