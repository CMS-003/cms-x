import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('构建模式:', mode);
  console.log('命令:', command);
  console.log('应用名称:', env.APP_NAME);

  return {
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
      APP: JSON.stringify(env.APP_NAME),
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