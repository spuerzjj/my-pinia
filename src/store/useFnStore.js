import { defineStore } from '../pinia/index'
import { ref, reactive, computed } from 'vue'

export const useFnStore = defineStore('fnStore', () => {
  const a = reactive({ v: 10 })

  const doubleA = computed(() => {
    return a.v * 2
  })

  return {
    a,
    doubleA
  }
})
