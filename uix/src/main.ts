import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { globalCookiesConfig } from 'vue3-cookies'
import { createPinia } from 'pinia'

import 'primeicons/primeicons.css'

globalCookiesConfig({
  expireTimes: '2d',
  path: '/',
  domain: '',
  secure: true,
  sameSite: 'None',
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
