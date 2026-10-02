# worklist

[打开网页](https://chicagokitty.github.io/worklist/)

白底黑字的单页任务清单。2026-10-01 核查 Canvas、CMSC Gradescope、Ed Discussion 和教师官网后同步；当前范围为截至 10/14 的课程安排，以及此前未完成事项。

## 页面与更新

- 待办按 DDL 升序排列，未知 DDL 最后；今天红色、明天深粉，按 America/Chicago 判断。
- 建议完成日、课前阅读、课内测验、未发布作业及建议事项明确标注，不虚构截止时刻。
- 勾选后移入底部已完成列表，取消勾选后按 DDL 恢复。圆环显示完成数 / 总数及四舍五入的百分比。
- 勾选保存在当前浏览器，不自动跨设备同步。用户向助理报告完成状态后，更新 data.js 的 done 并递增该任务的 statusVersion，覆盖旧的浏览器记录。
- 保留 Canvas、Gradescope 与已核实的 CMSC Office Hours。
- 按需更新，不设置提醒或自动抓取。最后检查时间及覆盖范围显示在页面上；10/1 已覆盖 CMSC Ed Discussion。

## 资料

这是公开的任务网页。材料副本放在用户已确认创建的私有仓库 [worklist-materials](https://github.com/chicagokitty/worklist-materials)，按“课程完整编号 / Day N / 文内标题 - chap N.pdf”归档；大纲、跨课次作业、旧讲义与实验按用途归档。已取得的材料直接链接 GitHub 文件，登录有权限的账号后打开。MHE 第 1 章因原件禁止服务器转载，使用出版社 PDF 直达链接；尚未取得的文件继续明确标注。保留 sourceUrl 追溯原始来源，不存会话参数或凭证。

## 2026-10-01 更新

- MATH 新增 Lecture 2；Lecture 1 改用 5 页排版版，保留旧手写版。
- PHYS Lecture 1 已归档，HW1 和 Intro lab 截止日期未变。
- Nikhil 仅 10/6 的 Office Hours 临时改为 13:45–15:45；常规时间仍为周二 15–17 时。
- 增加 SOSC course pack 领取事项，预计可领取日期不是截止日期。
- 保留已补齐的 Measuring Populism PDF；所有已有任务的 done 与 statusVersion 保持不变。

## 文件

- index.html：单页结构
- style.css：电脑和手机布局
- data.js：任务、来源、材料与 Office Hours
- app.js：排序、颜色、勾选保存、圆环进度

原生 HTML/CSS/JavaScript，无需安装依赖；GitHub Pages 从 main 分支根目录发布。
