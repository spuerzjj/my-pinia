import { getCurrentInstance, inject, computed, reactive } from 'vue'
import { piniaSymbol } from './piniaSymbol'

/**
 * defineStore参数有三种
 * 1. id + options
 * 2. options，id包含在options里
 * 3. id + setup函数
 */

export function defineStore(idOrOptions, optionsOrSetup) {
  // 参数归一
  let id, options

  // 第一种，第三种传参的方式
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = optionsOrSetup
  } else {
    // 第二种写法
    options = idOrOptions
    id = options.id
  }

  // 返回的函数
  const useStore = () => {
    // 当前组件实例
    const instance = getCurrentInstance()
    let piniaStore = instance && inject(piniaSymbol)

    if (!piniaStore._stores.has(id)) {
      // map中没有这个store
      // 新建store

      if (typeof optionsOrSetup === 'function') {
        // 函数式
        createSetupStore(id, optionsOrSetup, piniaStore)
      } else {
        // 选项式
        createOptionStore(id, options, piniaStore)
      }
    }
    return piniaStore._stores.get(id)
  }

  return useStore
}

/**
 *
 * @param {*} id
 * @param {*} setup
 * @param {*} piniaStore
 */
function createSetupStore(id, setup, piniaStore) {
  // useStore返回的响应式对象
  const store = reactive({})

  // 运行setup函数
  const setupStore = setup()

  for (let key in setupStore) {
    const prop = setupStore[key] //可能是属性，也可能是函数
    if (typeof prop === 'function') {
      setupStore[key] = wrapAction(prop)
    }
  }
  Object.assign(store, setupStore)
  piniaStore._stores.set(id, store)

  // 改变函数this指向
  function wrapAction(action) {
    return function (...args) {
      let ret = action.call(store, ...args)
      return ret
    }
  }
}

// 选项式
/**
 *
 * @param {*} id key
 * @param {*} options 选项
 * @param {*} piniaStore 调用前，useStore里通过inject获取到的piniaStore
 */
function createOptionStore(id, options, piniaStore) {
  const { state, actions, getters } = options // 解构options
  //专门处理 state, actions, getters的函数
  function setup() {
    piniaStore.state[id] = state ? state() : {} // 存入state，如果state存在则运行函数得到结果，如不存在则创建一个空对象存入
    // 1. 处理state的数据
    const localState = piniaStore.state[id]
    // 2. 处理actions，直接把actions复制到localState上
    Object.assign(localState, actions)
    // 3. 处理getters，把每一个getter函数用计算属性包装一下，使其建立起与state.xxx的依赖关系
    const computedGetters = Object.keys(getters).reduce((computedGetters, name) => {
      computedGetters[name] = computed(() => {
        let store = piniaStore._stores.get(id)
        return getters[name].call(store, store) //this和参数均为store
      })
      return computedGetters
    }, {})

    Object.assign(localState, computedGetters)
    return localState
  }

  createSetupStore(id, setup, piniaStore)
}
