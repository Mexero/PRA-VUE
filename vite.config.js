import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      strategies: 'injectManifest',
      //includeAssets: ['/assets/discord-C4p_KTJx.webp', '/assets/literalmentenosotros-DGGsUPbd.webp', '/assets/logo-CDIneW-9.webp', '/assets/HabIcon-5hK6Ejw0.svg', '/assets/PokedexIcon-P_6eSSZ8.webp', '/assets/ClasesIcon-D3jrF5OJ.webp', '/assets/DotesIcon-CYgV0zXz.svg', '/assets/ObjetosIcon-D9tIa6To.webp', '/assets/EstadosIcon-BGaW0WlS.webp', '/assets/ReglasIcon-CWN7kAUE.svg', '/assets/lupa-ByV5WMBw.svg', 'assets/Staatliches-Regular-D0tQKDij.ttf', 'assets/OutfitRegular-SQKIufFL.ttf'],
      srcDir: 'src',
      filename: 'sw.js',
      injectRegister: 'auto',
      manifest: {
        name: "PRA Wiki",
        short_name: "PRA",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#D20020",
        icons: [
          {
            src: "/icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})