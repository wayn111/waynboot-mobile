## waynboot-mall项目

waynboot-mall是一套全部开源的微商城项目，包含一个运营后台、h5商城和后台接口。
实现了一个商城所需的首页展示、商品分类、商品详情、sku详情、商品搜索、加入购物车、结算下单、订单状态流转、商品评论等一系列功能。
技术上基于Springboot2.0，整合了Redis、RabbitMQ、ElasticSearch等常用中间件，
贴近生产环境实际经验开发而来不断完善、优化、改进中。

[h5商城项目](https://github.com/wayn111/waynboot-mobile)
[运营后台项目](https://github.com/wayn111/waynboot-admin)  
[后台接口项目](https://github.com/wayn111/waynboot-mall)  

## waynboot-mobile

* 基于vue2 + VantUI开发的h5商城
* 提供一般商城项目所需要的基本功能
* `vw` 移动端适配，`css` 预处理器，浏览器默认样式处理
* axios响应拦截，统一异常处理
* 支持`svg-icon` 图标组件

## 文件目录
```javascript
|-- public                // public
|-- config                // config配置文件
|-- src
|   |-- api               // 接口列表
|   |-- assets            // 图片资源
|   |-- components        // 公共组件
|   |-- filter            // 全局过滤器
|   |-- icons             // svg图标
|   |-- router            // 路由
|   |-- store             // vuex
|   |-- styles            // 公共样式
|   |-- types             // 文件声明
|   |-- utils             // 工具函数
|   |-- views             // 商城各级页面
|   |   |-- ....          // ...
|   |-- App.vue           // 主页面
|   |-- main.js           // 入口文件
|   |-- permission.js     // 权限控制文件
|-- .eslintrc.js          // eslint配置
|-- babel.config.js       // babel配置文件
|-- jsconfig.config.js    // vscode配置文件
|-- env.development       // 开发环境配置
|-- env.production        // 生产环境配置
|-- jsconfig.config.js    // vscode配置文件
|-- package.json          // 客户端依赖
|-- postcss.config.js     // postcss配置文件
|-- vue.config.js         // vue相关配置文件
|-- ...
```

## 开发部署
```
# 克隆项目
git clone git@github.com:wayn111/waynboot-mobile.git

# 进入项目目录
cd waynboot-mobile

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

## 在线体验

- 注册一个账号
- 登陆

演示地址：https://www.wayn.ltd

## 演示图

<table>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-747e6a1f87aec9b4def2fcfea35c31be89e.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-a7b38a69ee8c09664f418144e4fbd494b7a.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-b2c9a914706af384815f686dfad9421cb45.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-f20a1e9e524b6edc117a10bd473179800a2.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-46798559cd1c1c835bbb33ea7cad43e303b.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-65739b9ba4fbf5b3e7f6995b6fd789e560a.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-aa2db733e6bb8f69eca266ab80fbe5d47ed.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-9543fd81e990293ff0dfb271d4fc8c649aa.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-f8091881053964d500ae470454acd5d318b.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-96cfec4abf17eadda150babd7e1ad6ef656.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-b9adf7939b993c9665e998e4dbc1e6780ce.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-47d4dd70dd9a848e39e8578e9a2f5a09619.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-6a9d0719f9263522e017240e08154a4d670.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-989f6f1fb0a67abeb1f767516a4e6f55c66.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-d4b26026685d15d1af529fdbdb176bf651f.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-9460edfa3630e955643ff370d0979e7ab36.png"/></td>
    </tr>
</table>


## waynboot-mall交流群

QQ群：<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=Mvf4HO4EhdXlfh0OLIq5I8wDIjRj6DlT&jump_from=webapi"><img border="0" src="https://pub.idqqimg.com/wpa/images/group.png" alt="waynboot-mall交流群" title="waynboot-mall交流群"></a>
有问题可以先提issue😁

## 感谢

- [panda-mall](https://github.com/Ewall1106/vue-h5-template)
- [litemall](https://github.com/linlinjava/litemall)
- [vant-ui](https://github.com/youzan/vant)
