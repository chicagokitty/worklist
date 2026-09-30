# worklist

[打开网页](https://chicagokitty.github.io/worklist/)

白底黑字的单页任务清单。2026-09-30 根据用户确认的进度和课程原始来源同步；当前范围为截至 10/14 的课程安排，以及此前未完成事项。

## 页面与更新

- 待办按 DDL 升序排列，未知 DDL 最后；今天红色、明天深粉，按 America/Chicago 判断。
- 建议完成日、课前阅读、课内测验、未发布作业及建议事项明确标注，不虚构截止时刻。
- 勾选后移入底部已完成列表，取消勾选后按 DDL 恢复。圆环显示完成数 / 总数及四舍五入的百分比。
- 勾选保存在当前浏览器，不自动跨设备同步。用户向助理报告完成状态后，更新 data.js 的 done 并递增该任务的 statusVersion，覆盖旧的浏览器记录。
- 保留 Canvas、Gradescope 与已核实的 CMSC Office Hours。
- 按需更新，不设置提醒或自动抓取。最后检查时间及覆盖范围显示在页面上；未覆盖 Ed Discussion。

## 资料

这是公开仓库。仅发布授权的任务元数据和原始资料入口；不上传受限阅读文件、私人笔记、凭证或会话下载链接。公开 PDF 可直接打开，Canvas 文件需要校园登录；Library Reserves 为课程阅读库入口，按文章名查找。具体材料链接和截止日期来源保存在 data.js。

## 文件

- index.html：单页结构
- style.css：电脑和手机布局
- data.js：任务、来源、材料与 Office Hours
- app.js：排序、颜色、勾选保存、圆环进度

原生 HTML/CSS/JavaScript，无需安装依赖；GitHub Pages 从 main 分支根目录发布。
