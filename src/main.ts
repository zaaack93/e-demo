/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

loadFonts()

function getParameterByName(name, url) {
  if (!url)
    url = window.location.href

  name = name.replace(/[\[\]]/g, '\\$&')

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results)
    return null
  if (!results[2])
    return ''

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// Create vue app
const app = createApp(App)

// Mount vue app
// Use plugins
// app.provide('keycloak', keycloak)
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})
app.mount('#app')
