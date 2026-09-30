'use strict';
// Fictional layout examples. These dates and task descriptions are not course requirements.
window.DEMO = {
  tasks: [
    {id:'cmsc-hw',course:'CMSC',shortName:'HW1',day:1,time:'23:59',done:false,materials:['problem']},
    {id:'sosc-reading',course:'SOSC',shortName:'读示例文章 Chapter 1',day:0,time:'12:30',done:false,materials:['reading','outline']},
    {id:'phys-lab',course:'PHYS',shortName:'Lab 1',day:3,time:'17:30',done:false,materials:['lab']},
    {id:'math-hw',course:'MATH',shortName:'HW1',day:0,time:'23:59',done:false,materials:['problem']},
    {id:'sosc-outline',course:'SOSC',shortName:'阅读提纲',day:6,time:'18:00',done:false,materials:['outline']},
    {id:'math-notes',course:'MATH',shortName:'Lecture 1 笔记',day:0,time:'17:00',done:true,materials:['notes']}
  ],
  materials: {
    reading:{title:'阅读材料',url:'materials/sample-reading.html?type=reading'},
    outline:{title:'阅读提纲',url:'materials/sample-reading.html?type=outline'},
    problem:{title:'作业题目',url:'materials/sample-reading.html?type=problem'},
    lab:{title:'实验说明',url:'materials/sample-reading.html?type=lab'},
    notes:{title:'课堂讲义',url:'materials/sample-reading.html?type=notes'}
  }
};
