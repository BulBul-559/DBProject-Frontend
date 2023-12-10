import { ElMessage } from 'element-plus'

export const errorAlert = (mess) => {
  ElMessage({
    showClose: true,
    message: mess,
    type: 'error'
  })
}

export const successAlert = (mess) => {
  ElMessage({
    showClose: true,
    message: mess,
    type: 'success'
  })
}
