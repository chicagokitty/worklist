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
const cloneTasks = () => window.DEMO.tasks.map(task => ({ ...task, dueDate: dateAfter(task.day) }));
let tasks = cloneTasks();
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[char]);
const deadlineLabel = task => task.dueDate
  ? `${task.dueDate.slice(5).replace('-', '/')} ${task.time || '时刻待确认'}`
  : 'DDL 待确认';
const taskName = task => `${task.course} ${task.shortName} · ${deadlineLabel(task)}`;
const dueKey = task => task.dueDate ? `${task.dueDate}T${task.time || '23:59'}` : '9999-12-31T23:59';
const urgency = task => {
  if (task.dueDate === today) return 'due-today';
  if (task.dueDate === tomorrow) return 'due-tomorrow';
  if (task.dueDate && task.dueDate < today) return 'overdue';
  return '';
};
const statusLabel = task => {
  if (task.done) return '已完成';
  const labels = {'due-today':'今天', 'due-tomorrow':'明天', overdue:'已过期'};
  return labels[urgency(task)] || '';
};
const paperclip = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 17 7-7a3 3 0 0 0-4-4l-7 7a5 5 0 0 0 7 7l8-8"/></svg>';

function taskMarkup(task) {
    const materials = task.materials.map(id => window.DEMO.materials[id]).filter(Boolean);
    return `<li class="task-row ${urgency(task)} ${task.done ? 'is-done' : ''}" data-task-id="${escapeHtml(task.id)}">
      <input class="task-checkbox" type="checkbox" id="check-${escapeHtml(task.id)}" data-task="${escapeHtml(task.id)}" ${task.done ? 'checked' : ''}>
      <div class="task-body">
        <div class="task-title-line"><label class="task-title" for="check-${escapeHtml(task.id)}"><span class="task-name">${escapeHtml(task.course)} ${escapeHtml(task.shortName)}</span><span class="title-separator"> · </span><span class="task-deadline">${escapeHtml(deadlineLabel(task))}</span></label><span class="task-status">${escapeHtml(statusLabel(task))}</span></div>
        <div class="task-files">${materials.map(material => `<a href="${escapeHtml(material.url)}" target="_blank" rel="noopener noreferrer" aria-label="打开${escapeHtml(task.course+' '+task.shortName+'的'+material.title)}（示例）">${paperclip}<span>${escapeHtml(material.title)}</span><span aria-hidden="true">↗</span></a>`).join('') || '<span class="no-files">暂无关联文件</span>'}</div>
      </div>
    </li>`;
}

function renderTasks() {
  const sorted = [...tasks].sort((a, b) => dueKey(a).localeCompare(dueKey(b)) || a.id.localeCompare(b.id));
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
  renderTasks();
  (nextFocusId ? $(nextFocusId) : $(fallbackHeading))?.focus({preventScroll:true});
  $('status-message').textContent = `${taskName(task)}，${task.done ? '已移到页面底部的已完成列表' : '已恢复到待办列表'}`;
}
$('task-list').addEventListener('change', changeTask);
$('completed-list').addEventListener('change', changeTask);
$('reset-demo').addEventListener('click', () => {
  tasks = cloneTasks();
  renderTasks();
  $('status-message').textContent = '示例任务已重置。';
});
$('current-date').dateTime = today;
$('current-date').textContent = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'UTC'
}).format(todayAnchor);
renderTasks();
