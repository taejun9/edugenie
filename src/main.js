import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/base.css'
import router from './helpers/router.js'

const app = createApp(App)

// Vue Router 사용
app.use(router)

app.mount('#app')
