import {  defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('userStore', () => {
  // 为了完整类型推理，推荐使用箭头函数
  const count = ref(0)
  function add(){
    count.value++;
  }

  return{count,add};
})
