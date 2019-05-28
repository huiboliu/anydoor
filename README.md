# web版任意门
  主要功能：通过本地的静态资源服务器，实现在网页里浏览本地文件系统的一个cli工具。


> PS：这是一个入门nodejs用的练手项目，[教程推荐](https://coding.imooc.com/class/146.html)。
> 技术点涉及node相关的"http", "fs", "path"等模块。http相关的缓存、压缩、内容分片等等

## 安装

```
npm i -g any-cute-door 
OR
yarn global add any-cute-door

```

## 使用方法

```
anydoor # 把当前文件夹作为静态资源服务器根目录

# 可选项
anydoor -p 8080   # 设置端口号 为 8080 

anydoor -d ~/ # 设置静态资源服务器根目录为用户的根目录

```
## TODO
1. 美化页面UI
2. 处理中文路径乱码问题
3. 增加多种格式的文件的预览


### http缓存相关的笔记

1. 相关字段：Cache-Control
2. Last-Modified/If-Modified-Since
3. ETag/If-None-Match
4. 服务器set进去的: ETag, Last-Modified
5. 浏览器器set进去的：If-None-Match (string), If-Modified-Since (string)
