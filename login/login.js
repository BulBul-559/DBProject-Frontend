import '../src/assets/css/reset.css'
import 'animate.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Login from '../src/login/SysLogin.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia()
const app = createApp(Login)

app.use(pinia)
app.use(ElementPlus)
// app.use(router)
app.mount('#login-root')
