window.DEMO = {
  tasks: [
    { id:'reading', group:'示例课程 A', category:'course', type:'阅读', title:'读一篇文章，留下三个问题', description:'把阅读、笔记和课堂讨论放在同一个任务里。', day:0, time:'上课前', priority:'先做这件', duration:'约 40 分钟', done:false, focus:true, material:['reading','notes'], steps:['阅读正文，标记不理解的段落','用自己的话记下核心观点','整理三个想在讨论中提出的问题'], source:'课程平台入口', sourceUrl:'https://canvas.uchicago.edu/' },
    { id:'practice', group:'示例课程 B', category:'course', type:'作业', title:'完成一组练习题', description:'题目文件、要求和提交入口，集中放在这里。', day:2, time:'23:59', priority:'本周完成', duration:'约 60 分钟', done:false, focus:true, material:['problem'], steps:['查看题目与提交要求','独立完成并整理过程','核对文件后前往课程平台提交'], source:'作业平台入口', sourceUrl:'https://www.gradescope.com/' },
    { id:'project', group:'示例项目', category:'project', type:'项目', title:'整理项目资料，写下下一步', description:'收拢零散资料，为下一次推进留一个清楚的起点。', day:3, time:'建议完成', priority:'按计划推进', duration:'约 25 分钟', done:false, focus:true, material:['project'], steps:['把资料归到对应主题','写下已知信息和未解决的问题','确定下一步行动'], source:null, sourceUrl:null },
    { id:'weekly', group:'个人安排', category:'personal', type:'计划', title:'留一点时间，回顾这一周', description:'哪些已经完成，哪些可以调整到下周。', day:4, time:'自行安排', priority:'时间灵活', duration:'约 15 分钟', done:false, focus:false, material:[], steps:['回顾已经完成的事项','重新安排未完成的任务'], source:null, sourceUrl:null },
    { id:'lecture', group:'示例课程 A', category:'course', type:'笔记', title:'整理上一节课的笔记', description:'已完成项目会留在归档里，需要时仍然找得到。', day:-1, time:'已完成', priority:'已完成', duration:'约 30 分钟', done:true, focus:false, material:['notes'], steps:['补全笔记','整理疑问'], source:null, sourceUrl:null }
  ],
  materials: [
    {id:'reading',title:'一篇待读文章',subtitle:'文章 · 示例课程 A',kind:'文章',format:'阅读样例',group:'示例课程 A',task:'reading',description:'这里将放文章 PDF、版本说明和来源链接。当前文件只是展示阅读入口的原创占位页。'},
    {id:'notes',title:'课堂笔记与问题',subtitle:'笔记 · 示例课程 A',kind:'笔记',format:'笔记样例',group:'示例课程 A',task:'lecture',description:'这里将放课堂笔记、复习要点和待讨论的问题。'},
    {id:'problem',title:'一份练习题目',subtitle:'题目 · 示例课程 B',kind:'题目',format:'题目样例',group:'示例课程 B',task:'practice',description:'这里将放题目文件和提交要求；入口与对应任务关联。'},
    {id:'project',title:'项目资料索引',subtitle:'资料 · 示例项目',kind:'资料',format:'资料样例',group:'示例项目',task:'project',description:'这里将放项目参考资料、记录和常用链接。'}
  ]
};
