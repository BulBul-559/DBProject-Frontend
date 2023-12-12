import { ElMessage, ElMessageBox } from 'element-plus'

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

export const messageBox = (text, title, confirmText, cancelText, success, error) => {
  ElMessageBox.confirm(text, title, {
    distinguishCancelAndClose: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  })
    .then(success)
    .catch(error)
}
