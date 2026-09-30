# worklist

[打开网页](https://chicagokitty.github.io/worklist/)

白底黑字的单页任务清单。当前为布局演示，所有任务与截止日期均为虚构示例；真实内容尚未接入。

## 页面与规则

- 全部任务直接显示在首页，按截止日期及时间升序排列；未知 DDL 排在最后。
- 名称格式：课程名 + 任务简写 + DDL。文件链接就在任务下方，点击直接打开。
- 今天到期标红，明天到期标深粉，之后到期使用普通颜色；按 America/Chicago 判断今天和明天。
- 已完成任务仍留在原位置，用灰色和删除线区分；可以取消勾选。
- 圆环进度按整份清单计算：完成任务数 / 全部任务数，并显示四舍五入到整数的百分比。
- 保留 Canvas、Gradescope 与 Office Hours 入口。示例材料是原创占位页。
- 演示勾选仅在当前页面生效，刷新或重置演示后恢复初始状态。

## 文件

- `index.html`：单页结构
- `style.css`：电脑和手机布局
- `demo-data.js`：虚构示例任务与材料链接
- `app.js`：DDL 排序、颜色、勾选和圆环进度
- `materials/sample-reading.html`：原创材料占位页

原生 HTML/CSS/JavaScript，无需安装依赖。GitHub Pages 从 main 分支根目录发布。仓库与演示网站公开；接入真实内容前另行确定存放与访问方式。
