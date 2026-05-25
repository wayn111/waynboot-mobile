import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from './build/svg-icons-plugin.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = env.port || env.npm_config_port || 4949
  const baseUrl = env.VUE_APP_BASE_URL || 'http://localhost:82'
  const isProd = mode === 'production'

  return {
    base: '/mall/',
    envPrefix: ['VITE_', 'VUE_APP_'],
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port: port,
      open: true,
      proxy: {
        '/dev-api': {
          target: baseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-api/, '')
        },
        '/upload': {
          target: baseUrl,
          changeOrigin: true
        }
      }
    },
    build: {
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: { drop_console: true, drop_debugger: true }
      } : undefined,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'vuex'],
            'vant': ['vant'],
            'wx': ['weixin-js-sdk'],
          }
        }
      }
    }
  }
})
