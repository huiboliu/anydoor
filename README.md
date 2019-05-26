## 这是一个练习 nodejs 用的微型静态资源服务器

## 安装

```

npm i -g
```

## 使用方法

```
anydoor # 把当前文件夹作为静态资源服务器根目录

anydoor -p 8080 # 设置端口号 为 8080

anydoor

```

- 第一节
- 第二节

### 缓存

1. 相关字段：
   Cache-Control,
   expires(过时)
2. If-Modified-Since/Last-Modified
3. If-None-Match/ETag

- 服务器 set 进去的: ETag, Last-Modified
- 服务器读到的：If-None-Match (string), If-Modified-Since (string)

cache-control
