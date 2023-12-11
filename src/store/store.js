import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  // 为了完整类型推理，推荐使用箭头函数
  const sdut_id = ref()
  const is_login = ref(false)

  return { sdut_id, is_login }
})
