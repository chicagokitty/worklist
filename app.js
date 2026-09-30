'use strict';

const zone = 'America/Chicago';
const parts = new Intl.DateTimeFormat('en-CA', {
  timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit'
}).formatToParts(new Date());
const part = name => parts.find(item => item.type === name).value;
// Calendar dates are compared in the course timezone, independent of the viewer's timezone.
const today = `${part('year')}-${part('month')}-${part('day')}`;
const todayAnchor = new Date(`${today}T12:00:00Z`);
const dateAfter = days => {
  if (days === null || days === undefined) return null;
  const date = new Date(todayAnchor);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
const tomorrow = dateAfter(1);
const $ = id => document.getElementById(id);
const data = window.WORKLIST;
const storageKey = 'worklist-task-status-v1';
let storageAvailable = true;
function readOverrides() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    storageAvailable = false;
    return {};
  }
}
function loadTasks() {
  const saved = readOverrides();
  return data.tasks.map(task => {
    const override = saved[task.id];
    const done = override?.statusVersion === task.statusVersion && typeof override.done === 'boolean'
      ? override.done : task.done;
    return {...task, done};
  });
}
let tasks = loadTasks();
function saveTask(task) {
  const saved = readOverrides();
  const baseline = data.tasks.find(item => item.id === task.id);
  if (task.done === baseline.done) delete saved[task.id];
  else saved[task.id] = {done: task.done, statusVersion: task.statusVersion};
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    storageAvailable = false;
  }
  updateStorageNote();
}
function updateStorageNote() {
  $('storage-note').textContent = storageAvailable
    ? '勾选保存在当前浏览器；向我报告的完成状态会同步至网站。'
    : '当前浏览器无法保存勾选，刷新后将恢复网站同步状态。';
}
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[char]);
const deadlineLabel = task => {
  if (!task.dueDate) return 'DDL 待确认';
  const date = task.dueDate.slice(5).replace('-', '/');
  if (task.deadlineKind === 'suggested') return `建议 ${date} 完成`;
  const suffix = {'before-class':'上课前', 'in-class':'课内'}[task.deadlineKind];
  return `${date} ${task.time || suffix || '时刻待确认'}`;
};
const taskName = task => `${task.course} ${task.shortName} · ${deadlineLabel(task)}`;
const dueKey = task => task.dueDate
  ? `${task.dueDate}|${task.deadlineKind === 'before-class' ? '0' : task.deadlineKind === 'in-class' ? '1' : task.time ? `2${task.time}` : '3'}`
  : '9999-12-31';
const urgency = task => {
  if (task.done || task.deadlineKind === 'suggested') return '';
  if (task.dueDate === today) return 'due-today';
  if (task.dueDate === tomorrow) return 'due-tomorrow';
  if (task.dueDate && task.dueDate < today) return 'overdue';
  return '';
};
const statusLabel = task => {
  if (task.done) return '已完成';
  const labels = {'due-today':'今天', 'due-tomorrow':'明天', overdue:'已过 DDL'};
  return labels[urgency(task)] || (task.state === 'suggestion' ? '建议' : task.state === 'waiting' ? '等待中' : '');
};
const paperclip = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 17 7-7a3 3 0 0 0-4-4l-7 7a5 5 0 0 0 7 7l8-8"/></svg>';

function taskMarkup(task) {
    const materials = task.materials.map(id => data.materials[id]).filter(Boolean);
    return `<li class="task-row ${urgency(task)} ${task.done ? 'is-done' : ''}" data-task-id="${escapeHtml(task.id)}">
      <input class="task-checkbox" type="checkbox" id="check-${escapeHtml(task.id)}" data-task="${escapeHtml(task.id)}" ${task.done ? 'checked' : ''}>
      <div class="task-body">
        <div class="task-title-line"><label class="task-title" for="check-${escapeHtml(task.id)}"><span class="task-name">${escapeHtml(task.course)} ${escapeHtml(task.shortName)}</span><span class="title-separator"> · </span><span class="task-deadline">${escapeHtml(deadlineLabel(task))}</span></label><span class="task-status">${escapeHtml(statusLabel(task))}</span></div>
        ${task.note ? `<p class="task-note">${escapeHtml(task.note)}</p>` : ''}
        <div class="task-files">${materials.map(material => `<a href="${escapeHtml(material.url)}" target="_blank" rel="noopener noreferrer" aria-label="打开${escapeHtml(task.course+' '+task.shortName+'的'+material.title)}">${paperclip}<span>${escapeHtml(material.title)}</span><span aria-hidden="true">↗</span></a>`).join('') || '<span class="no-files">资料待补充</span>'}</div>
      </div>
    </li>`;
}

function renderTasks() {
  const sorted = [...tasks].sort((a, b) => dueKey(a).localeCompare(dueKey(b)));
  const pending = sorted.filter(task => !task.done);
  const completed = sorted.filter(task => task.done);
  $('task-count').textContent = `${pending.length} 项待办`;
  $('archive-count').textContent = completed.length;
  $('task-list').innerHTML = pending.map(taskMarkup).join('') || `<li class="empty-state">${tasks.length ? '待办已全部完成。' : '暂无待办任务。'}</li>`;
  $('completed-list').innerHTML = completed.map(taskMarkup).join('') || '<li class="empty-state">还没有已完成任务。</li>';
  updateProgress();
}

function updateProgress() {
  const completed = tasks.filter(task => task.done).length;
  const total = tasks.length;
  const ratio = total ? completed / total : 0;
  const percent = Math.round(ratio * 100);
  $('completed-count').textContent = completed;
  $('total-count').textContent = total;
  $('progress-percent').innerHTML = `${percent}<span>%</span>`;
  $('progress-ring').setAttribute('aria-valuenow', percent);
  $('progress-ring').setAttribute('aria-valuetext', `${completed} / ${total} 项已完成，${percent}%`);
  $('ring-value').style.strokeDashoffset = 100 - ratio * 100;
}

function changeTask(event) {
  const checkbox = event.target;
  if (!checkbox.matches('input[data-task]')) return;
  const task = tasks.find(item => item.id === checkbox.dataset.task);
  if (!task) return;
  // Keep keyboard focus in the current list instead of jumping to the moved task.
  const list = checkbox.closest('ul');
  const siblings = [...list.querySelectorAll('input[data-task]')];
  const index = siblings.indexOf(checkbox);
  const nextFocusId = (siblings[index + 1] || siblings[index - 1])?.id;
  const fallbackHeading = list.id === 'task-list' ? 'task-heading' : 'completed-heading';
  task.done = checkbox.checked;
  saveTask(task);
  renderTasks();
  (nextFocusId ? $(nextFocusId) : $(fallbackHeading))?.focus({preventScroll:true});
  $('status-message').textContent = `${taskName(task)}，${task.done ? '已移到页面底部的已完成列表' : '已恢复到待办列表'}`;
}
$('task-list').addEventListener('change', changeTask);
$('completed-list').addEventListener('change', changeTask);
window.addEventListener('storage', event => {
  if (event.key === storageKey || event.key === null) {
    tasks = loadTasks();
    renderTasks();
    updateStorageNote();
  }
});
$('current-date').dateTime = today;
$('current-date').textContent = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'UTC'
}).format(todayAnchor);
$('sync-note').textContent = `${new Intl.DateTimeFormat('zh-CN', {
  month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false, timeZone:zone
}).format(new Date(data.updatedAt))} 核查 · ${data.scope}`;
$('office-hours-list').innerHTML = data.officeHours.map(item => `<p><strong>${escapeHtml(item.person)}</strong><br>${escapeHtml(item.time)}<br>${escapeHtml(item.place)}</p>`).join('')
  + `<p><a href="${escapeHtml(data.materials['cmsc-syllabus'].url)}" target="_blank" rel="noopener noreferrer">查看课程官网 ↗</a></p>`;
updateStorageNote();
renderTasks();
