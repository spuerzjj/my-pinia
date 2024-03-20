<template>
  <h2>{{ store.name }}</h2>
  <h2>{{ store.age }}</h2>
  <h2>{{ store.doubleAge }}</h2>
</template>

<script setup>
import { effect } from 'vue'
import { useStore } from '../store/useIndex'
const store = useStore()
setTimeout(() => {
  queueMicrotask(() => {
    console.log('mmm')
  })
  store.increment(2)
}, 1000)

effect(() => {
  console.log(store.age)
  console.log(store.doubleAge)
})

// const { myName } = store
</script>
