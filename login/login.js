import '../src/assets/css/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Login from '../src/login/SysLogin.vue'
// import router from './router'

const app = createApp(Login)

app.use(createPinia())
// app.use(router)

app.mount('#login-root')
