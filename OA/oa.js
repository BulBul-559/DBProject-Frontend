import '../src/assets/css/reset.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import OA from '../src/OA/OA.vue'
import router from '../src/OA/router/'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const pinia = createPinia()
const app = createApp(OA)

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#oa-root')
