#### [README for English](http://git.sankuai.com/projects/XM/repos/waka-cli/browse/README_en.md)

## waka
A simple CLI scaffolding for front-end projects.

### 安装
waka 依赖 [Node.js](https://nodejs.org/en/) (>=6.x)：

```
$ mnpm install @mx/waka -g
```

如果没安装 [mnpm](http://npm.sankuai.com/)，就用下面的命令安装 waka:

```
$ npm install @mx/waka -g --registry=http://r.npm.sankuai.com
```

### 用法
```
$ waka init <template-name> <project-name>
```

例如:

```
$ waka init vue-webpack my-project
```

上述命令会从 [waka-templates/vue-webpack](https://github.com/waka-templates/vue-webpack) 拉取 `vue-webpack` 模板来初始化你的 `./my-project/` 项目。


### 基本命令

* `waka` or `waka -h` --- 查看 waka 的帮助信息
* `waka list` --- 列举所有官方模板。官方模板地址：[waka-templates](https://github.com/waka-templates).
* `waka init template-name your-project-name` --- 用指定的模板初始化你的项目.
* `waka tunnel` --- 创建调试管道
* `waka token -u your-github-user-name -p your-personal-token` --- 设置 auth token，用于 BA 认证。

`waka list` 和 `waka init` 命令都会向 `api.github.com` 发起请求。在设置 auth token 的情况下，github限制的请求频率是 60次/小时，超过次数之后，github会拒绝请求，返回403。

而设置token后，请求频率是5000次/小时。

相关文档：

* [Rate Limiting](https://developer.github.com/v3/#rate-limiting)
* [Basic Authentication](https://developer.github.com/v3/auth/#basic-authentication)

## 模板
Waka 提供了一些简单的官方模板。此外，也可以使用github上的第三方仓库作为模板或者使用自身本地的模板来初始化项目。

### 官方模板
所有的官方模板都可以从 [waka-templates organization](https://github.com/waka-templates) 上找到. 当有新模板添加时， 你能通过 `waka init <template-name> <project-name>` 来使用该模板， 也可以运行  `waka list` 来查看所有的模板.

即将能用的模板如下:

* [vue-webpack](https://github.com/waka-templates/vue-webpack) --- A simple template webpack + vuejs setup for projects
* [zepto-webpack](https://github.com/waka-templates/zepto-webpack) --- A simple template webpack + zepto setup for projects
* [react-webpack](https://github.com/waka-templates/react-webpack) ---  A simple template webpack + react setup for projects

Additional, you also can check [template simple](https://github.com/waka-templates/template-simple) to write owner customized template.

### 利用他人的仓库作模板
waka 允许使用他人的 github repo 作为项目的模板:

```
waka init username/repo my-project
```

运行上述命令之后，将会使用 `username/repo` 作为模板来初始化你的项目。

### 本地模板

waka 支持使用本地模板初始化项目:

```
waka init ~/local/template/path my-project
```

There is a [guide](https://github.com/waka-templates/template-simple) for to writing owner customized template.

## Note

如果你想为 waka 提供官方模板，请参照这份模板书写指南：[官方模板书写指南](https://github.com/waka-templates/template-simple)。

在指南中，官方模板必须符合两条规则：

* 模板根目录下有 `template` 目录
* 模板根目录下有 `meta.{js,json}` 文件

**当你使用他人的github仓库或者本地模板时，如果github仓库或者本地模板的根目录没有 `template` 目录， waka 将会使用该仓库或者本地模板所在的目录作为渲染模板。**

## Thanks
To [metalsmith scaffolder](https://github.com/metalsmith/metalsmith/blob/master/examples/project-scaffolder) for the head start.



