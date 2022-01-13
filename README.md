# 米数前端项目脚手架

项目地址：[mishuweb-cli](https://github.com/XueWenPeng/mishuweb-cli)

## 项目调试

### `npm link`

在项目根目录下执行 `npm link` 将命令链接到全局执行环境

在任意目录下执行`package.json`中`bin`下配置的命令

### `npm unlink`

取消 `npm link`

## 项目结构
```js
├── bin // 脚手架目录
│   ├── cli.js // 脚手架命令入口文件  
│   ├── create.js // 创建项目
│   ├── generator.js // 下载远程模板的主逻辑
│   └── request.js // 获取GitHub模板相关信息的请求
├── README.md // 说明文档
├── package-lock.json // npm 依赖包版本小配置
├── package.json // npm 配置