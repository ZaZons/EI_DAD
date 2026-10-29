import { createApp } from 'vue'
import { io } from 'socket.io-client'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import AboutPage from '@/pages/about/AboutPage.vue'
import SinglePlayerGamePage from '@/pages/game/SinglePlayerGamePage.vue'

const app = createApp(App)

const socket = io('http://localhost:3000')
app.provide('socket', socket)

app.use(createPinia())
app.use(router)

app.mount('#app')
