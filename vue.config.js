const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
  pluginOptions: {
    electronBuilder: {
      preload: "./src/preload.ts",
      // List native deps here if they don't work
      // externals: ["lodash.zip", "clipboard", "ffi-napi"],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ["./node_modules"],
      nodeIntegration: true, // 系统默认不支持node，需要将node集成进来
      // builderOptions: {
      //   appId: "com.gdcs.audiovision",
      //   productName: "云媒体管控系统", //项目名，也是生成的安装文件名，即aDemo.exe
      //   win: {
      //     //win相关配置
      //     icon: "./public/favicon.ico", //图标，当前图标在根目录下，注意这里有两个坑
      //     target: [
      //       {
      //         target: "nsis", //利用nsis制作安装程序
      //         arch: [
      //           "x64" //64位
      //         ]
      //       }
      //     ]
      //   },
      //   nsis: {
      //     oneClick: false, // 是否一键安装
      //     allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
      //     allowToChangeInstallationDirectory: true, // 允许修改安装目录
      //     installerIcon: "./public/favicon.ico", // 安装图标
      //     uninstallerIcon: "./public/favicon.ico", //卸载图标
      //     installerHeaderIcon: "./public/favicon.ico", // 安装时头部图标
      //     createDesktopShortcut: true, // 创建桌面图标
      //     createStartMenuShortcut: true, // 创建开始菜单图标
      //     shortcutName: "Mtv" // 图标名称
      //   },
      //   linux: {
      //     desktop: {
      //       StartupNotify: "false",
      //       Encoding: "UTF-8",
      //       MimeType: "x-scheme-handler/deeplink"
      //     },
      //     target: ["rpm", "deb"]
      //   },
      //   deb: {
      //     priority: "optional",
      //     afterInstall: "installer/linux/after-install.tpl"
      //   }
      // }
    }
  },
})
