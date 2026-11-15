'use strict';

const data = window.WORKLIST;
const zone = 'America/Chicago';
const byId = id => document.getElementById(id);
const storageKey = 'worklist-task-status-v1';
const courseNames = {MATH: 'MATH 25700', CMSC: 'CMSC 27130', SOSC: 'SOSC 13100', PHYS: 'PHYS 12100'};
const calendarDay = new Intl.DateTimeFormat('sv-SE', {timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit'});
const localDate = new Intl.DateTimeFormat('zh-CN', {timeZone: zone, month: 'long', day: 'numeric', weekday: 'short'});
const localTime = new Intl.DateTimeFormat('en-GB', {timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'});
const finals = [...data.finals].sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
let today, tomorrow, undoItems = [], feedbackTimeout;
let groups = new Map();
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

function readOverrides() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch { return {}; }
}
let overrides = readOverrides();
let sessionOnly = false;

function completed(task) {
  const entry = overrides[task.id];
  return entry?.statusVersion === task.statusVersion && typeof entry.done === 'boolean'
    ? entry.done : task.done;
}
function isReading(task) {
  return (task.course === 'SOSC' || task.course === 'SOSC 13100') && task.taskKind === 'preclass-reading';
}
function classDay(task) { return task.classDate || task.dueDate; }

function deadlineLabel(task) {
  if (task.deadlineKind === 'relative' && task.relativeDeadline) return 'DDL ' + task.relativeDeadline;
  if (!task.dueDate) return 'DDL 待确认';
  const date = task.dueDate.slice(5).replace('-', '/');
  if (task.deadlineKind === 'suggested') return '建议 ' + date + ' 完成';
  if (task.deadlineKind === 'feedback') return '可选反馈 ' + date + ' ' + (task.time || '时刻待确认');
  const suffix = {'before-class': '课前', 'in-class': '课内', 'same-day': '当天'}[task.deadlineKind];
  return 'DDL ' + date + ' ' + (task.time || suffix || '时刻待确认');
}
function dueKey(task) {
  const priority = {'before-class': '0', 'in-class': '1'}[task.deadlineKind] || (task.time ? '2' + task.time : '3');
  return (task.dueDate || '9999-12-31') + '|' + priority;
}
function rowLinks(items) {
  const links = new Map();
  for (const item of items) {
    let keys = item.displayMaterials || item.materials || [];
    if (isReading(item) && keys.some(key => key !== 'sosc-syllabus')) {
      keys = keys.filter(key => key !== 'sosc-syllabus');
    }
    for (const key of keys) {
      const m = data.materials[key];
      if (m && !links.has(m.url)) links.set(m.url, m.title);
    }
  }
  return [...links].map(([url, title]) => '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(title) + '</a>').join('');
}
function rowMarkup(id, items) {
  const task = items[0];
  const course = courseNames[task.course] || task.course;
  const label = course + ' ' + (isReading(task) ? '课前阅读（' + items.length + ' 篇）' : task.shortName.replace(/^HW(\d+)$/, 'HW $1'));
  const urgency = task.dueDate === today ? 'due-today' : task.dueDate === tomorrow ? 'due-tomorrow' : '';
  const links = rowLinks(items);
  return '<li class="task-row ' + urgency + '"><input id="check-' + escapeHtml(id) + '" data-task="' + escapeHtml(id) + '" type="checkbox">' +
    '<label for="check-' + escapeHtml(id) + '">' + escapeHtml(label) + '</label>' +
    '<span class="deadline">' + escapeHtml(deadlineLabel(task)) + '</span>' +
    (links ? '<div class="files">' + links + '</div>' : '') + '</li>';
}
function renderTasks() {
  groups = new Map();
  for (const task of [...data.tasks].sort((a, b) => dueKey(a).localeCompare(dueKey(b)))) {
    const date = isReading(task) && classDay(task);
    if (completed(task) || (date && date < today)) continue;
    const id = date ? 'sosc-readings-' + date : task.id;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(task);
  }
  byId('task-count').textContent = groups.size + ' 项';
  byId('task-list').innerHTML = [...groups].map(([id, items]) => rowMarkup(id, items)).join('') || '<li class="empty">暂无待办任务。</li>';
}
function persist(items, done) {
  const merged = sessionOnly ? {...overrides} : readOverrides();
  for (const task of items) {
    if (done === task.done) delete merged[task.id];
    else merged[task.id] = {done, statusVersion: task.statusVersion};
  }
  overrides = merged;
  try {
    localStorage.setItem(storageKey, JSON.stringify(merged));
    sessionOnly = false;
    return '';
  } catch {
    sessionOnly = true;
    return '（仅本次打开有效）';
  }
}
function feedback(message, items = []) {
  clearTimeout(feedbackTimeout);
  undoItems = items;
  byId('status-message').textContent = message;
  byId('undo').hidden = !items.length;
  feedbackTimeout = setTimeout(() => {
    byId('status-message').textContent = '';
    byId('undo').hidden = true;
    undoItems = [];
  }, 10000);
}
byId('task-list').addEventListener('change', event => {
  const input = event.target;
  const items = groups.get(input.dataset.task);
  if (!items || !input.checked) return;
  const next = input.closest('li').nextElementSibling?.querySelector('input')?.id;
  const note = persist(items, true);
  renderTasks();
  feedback('已标为完成' + note, items);
  (byId(next) || byId('undo')).focus({preventScroll: true});
});
byId('undo').addEventListener('click', () => {
  if (!undoItems.length) return;
  const task = undoItems[0];
  const note = persist(undoItems, false);
  renderTasks();
  feedback('已恢复待办' + note);
  const key = isReading(task) && classDay(task) ? 'sosc-readings-' + classDay(task) : task.id;
  (byId('check-' + key) || byId('task-heading')).focus({preventScroll: true});
});
window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) {
    overrides = readOverrides();
    renderTasks();
  }
});

function countdown(exam, now) {
  const start = Date.parse(exam.start), end = Date.parse(exam.end);
  if (now >= end) return '已结束';
  if (now >= start) return '考试中';
  const minutes = Math.ceil((start - now) / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor(minutes % 1440 / 60);
  if (days) return '距开考 ' + days + ' 天 ' + hours + ' 小时';
  return '距开考 ' + (hours ? hours + ' 小时 ' : '') + (minutes % 60) + ' 分钟';
}
byId('exam-list').innerHTML = finals.map(exam => {
  const start = new Date(exam.start), end = new Date(exam.end);
  return '<li class="exam-row"><span class="exam-course">' + escapeHtml(exam.course) +
    '</span><span class="countdown"></span><span class="exam-detail"><time datetime="' +
    escapeHtml(exam.start) + '">' + localDate.format(start) + '　' + localTime.format(start) +
    '–' + localTime.format(end) + '</time> · ' + escapeHtml(exam.room) + '</span></li>';
}).join('');
function refreshClock() {
  const now = new Date();
  const date = calendarDay.format(now);
  if (today !== date) {
    today = date;
    const day = new Date(date + 'T12:00:00Z');
    day.setUTCDate(day.getUTCDate() + 1);
    tomorrow = day.toISOString().slice(0, 10);
    byId('current-date').dateTime = date;
    byId('current-date').textContent = localDate.format(now);
    renderTasks();
  }
  byId('exam-list').querySelectorAll('.countdown').forEach((span, i) => {
    span.textContent = countdown(finals[i], now.getTime());
  });
}
refreshClock();
setInterval(refreshClock, 1000 * 30);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshClock(); });
