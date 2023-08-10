import { defineConfig } from 'vite'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import viteComponents, {
  VuetifyResolver
} from 'vite-plugin-components'
import envCompatible from 'vite-plugin-env-compatible'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createVuePlugin } from 'vite-plugin-vue2'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

import path from 'path'

// const { createVuePlugin } = require('vite-plugin-vue2')
// const path = require('path')
const REPLACEMENT = `${path.resolve(__dirname, './src')}/`
export default defineConfig({
  server: {
    host: '0.0.0.0',
    https: false,
    port: 8088,
    proxy: {
      '/api': {
        // 路径中有 /api 的请求都会走这个代理 , 可以自己定义一个,下面移除即可
        target: 'https://xxx.xxx.com', // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
        // target: 'http://localhost:9000', // 目标代理接口地址,实际跨域要访问的接口,这个地址会替换掉 axios.defaults.baseURL
        secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        ws: true //,       // 是否启用  websockets;
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: REPLACEMENT
      },
      {
        find: 'src/',
        replacement: REPLACEMENT
      },
      {
        find: /^~@\//,
        replacement: REPLACEMENT
      }
    ],
    extensions: ['.vue', '.js', '.jsx', '.mjs', '.ts', '.tsx', '.json', '.css', '.scss']
  },
  plugins: [
    createVuePlugin({ jsx: true }),
    viteComponents({
      customComponentResolvers: [
        VuetifyResolver()
      ]
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(__dirname, './src/icons/svg')],
      symbolId: 'icon-[dir]-[name]'
    }),
    viteCommonjs(),
    ViteRequireContext(/* options */),
    envCompatible(),
    PkgConfig(),
    OptimizationPersist()
  ]
}
)
