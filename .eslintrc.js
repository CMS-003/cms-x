
module.exports = {
  extends: [
    'react-app', // CRA 默认规则
  ],
  parserOptions: {
    ecmaVersion: 'latest',     // 支持最新 ECMAScript
    sourceType: 'module',      // 使用 import/export
    ecmaFeatures: {
      jsx: true,              // 启用 JSX
    },
  },
  rules: {
    // 自定义规则
    'react/prop-types': 'off', // 关闭 PropTypes 检查（推荐用于 TypeScript 项目）
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要显式导入 React
    'jsx-a11y/anchor-is-valid': 'off', // 关闭 Next.js/Link 的特定检查
    'no-unused-vars': 'off', // 未使用的变量警告（非错误）
    'no-mixed-operators': 'off',
  },
  globals: {
    APP: "readonly"
  }
};