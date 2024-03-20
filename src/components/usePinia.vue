<template>
  <h2>{{ store.age }}</h2>
  <h2>{{ store.doubleAge }}</h2>
</template>

<script setup>
import { effect } from 'vue'
import { useStore } from '../store/useIndex'
import { useFnStore } from '../store/useFnStore'

const store = useStore()
const fnStore = useFnStore()

console.log(store)
store.age = 20
console.log(store.doubleAge)
const { a } = fnStore
console.log(a)
a.v = 1000
console.log(fnStore.doubleA)
</script>
