import '../public/assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import clickOutside from './directives/clickOutside'

const app = createApp(App)

app.directive('click-outside', clickOutside)

app.use(router)

app.mount('#app')

//Service worker
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registrado!'))
        .catch((error) => { console.error('El registro del SW falló:', error) });
}