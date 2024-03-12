# mpx-common-sdk-template
基于mpx开发通用sdk组件模板

## 开发

```bash
$ npm ci

$ npm run watch:web
```


## 项目结构

```js
├── app.mpx
├── assets
│   └── css  ---------------------------- 全局样式
│       └── common.styl
├── common
│   ├── api  ---------------------------- 接口协议
│   │   ├── caller
│   │   │   ├── ali.ts
│   │   │   ├── web.ts
│   │   │   └── wx.ts
│   │   └── index.ts
│   ├── dataCenter  --------------------- 数据中心
│   │   ├── base.ts
│   │   ├── const.ts
│   │   ├── env.ts
│   │   └── index.ts
│   ├── eventBus    --------------------- 事件通信
│   │   ├── base.ts
│   │   ├── eventCallback.ts
│   │   └── index.ts
│   ├── payBridge   --------------------- 平台通信
│   │   ├── bridge
│   │   │   ├── fusion.ts
│   │   │   └── passengerBridge.ts
│   │   └── index.ts
│   ├── raven       --------------------- 埋点
│   │   ├── common.ts
│   │   ├── event.ts
│   │   ├── event.web.ts
│   │   ├── event.wx.ts
│   │   └── menu.ts
│   ├── typeDeclare --------------------- 声明文件
│   │   ├── index.ts
│   │   └── type.d.ts
│   └── utils
│       ├── index.ts
│       └── script.ts
├── components      --------------------- 组件
│   └── channels
│       └── index.mpx
├── example.mpx
├── index.html
├── main.ts
└── pages           --------------------- 页面
    └── examples
        ├── index.mpx
        └── main.mpx
```