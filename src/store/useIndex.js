import { defineStore } from '../pinia/index'

export const useStore = defineStore('stroeId', {
  state: () => {
    return {
      name: 'jacky chen',
      age: 40
    }
  },

  actions: {
    increment(num) {
      this.age += num
      return this.age
    }
  },
  getters: {
    doubleAge: state => state.age * 2
  }
})
