# 心理年龄测试

纯前端的自我探索小站。20 道选择题、评分、心理年龄估算和报告都在浏览器本地完成，不上传答案。

## 本地预览

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 检查

```bash
npm test
npm run build
npm start
```

`npm start` 会在本地启动生产版本，默认地址仍是 [http://localhost:3000](http://localhost:3000)。

## 部署成公开网址

这是纯前端站点，不需要数据库或 API 密钥。代码可以放在 GitHub。

分享网址使用 `NEXT_PUBLIC_SITE_URL`。没有配置时，页面会使用当前浏览器的公开访问地址。`localhost`、`127.0.0.1` 和局域网地址不会写入分享文案。变量说明见 `.env.example`。

### GitHub Pages

1. 把项目推到 GitHub 的 `main` 或 `master` 分支。
2. 在仓库 Settings → Pages 中，把 Source 设为 GitHub Actions。
3. 如果网站不在域名根路径，到 Settings → Secrets and variables → Actions → Variables，添加：
   - `NEXT_PUBLIC_SITE_URL`：完整公开地址，例如 `https://your-name.github.io/heart-age`
   - `NEXT_PUBLIC_BASE_PATH`：仓库路径，例如 `/heart-age`
4. 推送后，`.github/workflows/pages.yml` 会执行测试和静态构建，并发布 `out` 目录。

用户站点 `https://your-name.github.io` 不需要 `NEXT_PUBLIC_BASE_PATH`。

### 需要 Node 的平台

不设置 `GITHUB_PAGES` 时，构建仍是常规 Next.js 输出。

- Vercel：导入 GitHub 仓库，Build Command 为 `npm run build`。
- 其他 Node 平台：`npm run build` 之后用 `npm start` 启动。

答题进度只写在访问者自己的浏览器里。
