import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log('构建模式:', mode);
  console.log('命令:', command);
  console.log('应用名称:', env.APP_NAME);

  const manifest = {
    name: env.APP_NAME,
    short_name: env.APP_NAME,
    description: '应用描述',
    theme_color: '#ffffff',
    background_color: "#ffffff",
    orientation: "portrait",
    start_url: `/${env.APP_NAME}/`,
    id: env.APP_NAME,
    scope: `/${env.APP_NAME}/`,
    display: "fullscreen",
    icons: [
      {
        "src": "logo.png",
        "sizes": "64x64 32x32 24x24 16x16 192x192 512x512",
        "type": "image/png"
      }
    ],
  };
  return {
    base: `/${env.APP_NAME}/`,
    plugins: [
      react({
        babel: {
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }]
          ]
        }
      }),
      svgr({
        svgrOptions: {
          icon: true, // 可根据需要配置
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest,
        strategies: 'injectManifest',   // 使用注入模式
        srcDir: './',                  // 源文件目录
        filename: 'service-worker.js',              // 自定义 SW 文件名
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,ico,jpg,png,svg}'],
        },
        devOptions: {
          enabled: true,      // 开发环境下启用 SW
          type: 'module',     // 使用 module 类型（仅 Chromium 内核）
        },
      })
    ],
    resolve: {
      alias: {
        // 配置别名（根据你的项目调整）
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      }
    },
    define: {
      AppName: JSON.stringify(env.APP_NAME),
      'process.env': {

      },
    },
    server: {
      port: 3000,  // 开发服务器端口
      open: true,   // 自动打开浏览器
      proxy: {
        '/gw': {
          target: 'https://jiayou.work',
          changeOrigin: true,
        },
        '/images': {
          target: 'https://jiayou.work',
          changeOrigin: true,
        },
        '/upload': {
          target: 'https://jiayou.work',
          changeOrigin: true,
        },
        '/proxy': {
          target: 'https://jiayou.work',
          changeOrigin: true,
        },
      },
      hmr: {
        overlay: true,
      },
    },
    build: {
      outDir: 'build',  // 构建输出目录
      sourcemap: false  // 生成 sourcemap
    }
  }
})