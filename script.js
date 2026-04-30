/* ===========================
   NOTENEXA — script.js
   =========================== */

'use strict';

/* ── STATE ─────────────────────────────────── */

let notes = [];
let currentFilter = 'all';
let searchQuery = '';
let isListView = false;
let editingId = null;
let pendingDeleteId = null;
let currentTags = [];

/* ── STORAGE ────────────────────────────────── */

const STORAGE_KEY = 'notenexa_notes';
const THEME_KEY   = 'notenexa_theme';

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    notes = raw ? JSON.parse(raw) : [];
  } catch { notes = []; }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/* ── THEME ─────────────────────────────────── */

function getTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; }

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(THEME_KEY, t);
  const lbl = document.getElementById('themeLabel');
  if (lbl) lbl.textContent = t === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

/* ── DATE FORMAT ────────────────────────────── */

function formatDate(ts) {
  const now  = Date.now();
  const diff = now - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ── FILTER & SEARCH ────────────────────────── */

function getFilteredNotes() {
  return notes.filter(n => {
    const matchesFilter =
      currentFilter === 'all'     ? true :
      currentFilter === 'pinned'  ? n.pinned :
      n.category === currentFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.tags || []).some(t => t.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });
}

/* ── COUNTS ─────────────────────────────────── */

function updateCounts() {
  const all      = notes.length;
  const pinned   = notes.filter(n => n.pinned).length;
  const work     = notes.filter(n => n.category === 'work').length;
  const personal = notes.filter(n => n.category === 'personal').length;
  const ideas    = notes.filter(n => n.category === 'ideas').length;
  const other    = notes.filter(n => n.category === 'other').length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('countAll',      all);
  set('countPinned',   pinned);
  set('countWork',     work);
  set('countPersonal', personal);
  set('countIdeas',    ideas);
  set('countOther',    other);
}

/* ── RENDER NOTES ───────────────────────────── */

function tagBadge(cat) {
  return `<span class="tag ${cat}">${cat}</span>`;
}

function renderNotes() {
  const grid  = document.getElementById('notesGrid');
  const empty = document.getElementById('emptyState');
  const emptyMsg = document.getElementById('emptyMsg');
  const filtered = getFilteredNotes();

  grid.className = `notes-grid${isListView ? ' list-mode' : ''}`;

  if (!filtered.length) {
    grid.innerHTML = '';
    empty.style.display = 'flex';
    emptyMsg.textContent = searchQuery
      ? `No notes found for "${searchQuery}".`
      : currentFilter !== 'all'
        ? `No notes in this category yet.`
        : 'No notes yet. Create your first note!';
    return;
  }

  empty.style.display = 'none';

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  grid.innerHTML = sorted.map(n => {
    const preview = n.content
      ? n.content.replace(/\n/g, ' ').slice(0, 120) + (n.content.length > 120 ? '…' : '')
      : '<em style="opacity:.5">No content</em>';

    const titleClass = n.title ? 'note-card-title' : 'note-card-title untitled';
    const titleText  = n.title || 'Untitled';

    const tagsHtml = (n.tags || []).slice(0, 3).map(t =>
      `<span class="tag-pill" style="font-size:11px;padding:2px 7px">${escHtml(t)}</span>`
    ).join('');

    return `
    <div class="note-card${n.pinned ? ' pinned' : ''}" data-id="${n.id}">
      <div class="note-card-header">
        <div class="${titleClass}">${escHtml(titleText)}</div>
        ${tagBadge(n.category)}
      </div>
      <div class="note-card-body">${preview}</div>
      <div class="note-card-footer">
        <span class="note-card-date">${formatDate(n.updatedAt)}</span>
        <div style="display:flex;gap:4px;align-items:center">
          ${tagsHtml}
          <div class="note-card-actions">
            <button class="btn-icon" data-action="pin" data-id="${n.id}" title="${n.pinned ? 'Unpin' : 'Pin'}" aria-label="${n.pinned ? 'Unpin' : 'Pin'}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="${n.pinned ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </button>
            <button class="btn-icon" data-action="delete" data-id="${n.id}" title="Delete" aria-label="Delete note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('[data-action="pin"]').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); togglePin(btn.dataset.id); })
  );
  grid.querySelectorAll('[data-action="delete"]').forEach(btn =>
    btn.addEventListener('click', e => { e.stopPropagation(); openDeleteConfirm(btn.dataset.id); })
  );
  grid.querySelectorAll('.note-card').forEach(card =>
    card.addEventListener('click', () => openEditModal(card.dataset.id))
  );
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── NOTE CRUD ──────────────────────────────── */

function createNote(data) {
  const note = {
    id: crypto.randomUUID(),
    title: data.title || '',
    content: data.content || '',
    category: data.category || 'other',
    tags: data.tags || [],
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  notes.unshift(note);
  saveNotes();
  return note;
}

function updateNote(id, data) {
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return;
  notes[idx] = { ...notes[idx], ...data, updatedAt: Date.now() };
  saveNotes();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
}

function togglePin(id) {
  const n = notes.find(n => n.id === id);
  if (!n) return;
  n.pinned = !n.pinned;
  n.updatedAt = Date.now();
  saveNotes();
  updateCounts();
  renderNotes();
  showToast(n.pinned ? 'Note pinned' : 'Note unpinned');
}

/* ── MODAL ──────────────────────────────────── */

function openNewModal() {
  editingId   = null;
  currentTags = [];

  document.getElementById('modalTitleLabel').textContent = 'New Note';
  document.getElementById('noteTitle').value    = '';
  document.getElementById('noteContent').value  = '';
  document.getElementById('noteCategory').value = 'other';
  document.getElementById('deleteNoteBtn').style.display = 'none';
  document.getElementById('tagsList').innerHTML = '';
  document.getElementById('tagsInput').value    = '';
  document.getElementById('pinBtn').classList.remove('pinned');
  renderTagPills();

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('noteTitle').focus();
}

function openEditModal(id) {
  const n = notes.find(n => n.id === id);
  if (!n) return;

  editingId   = id;
  currentTags = [...(n.tags || [])];

  document.getElementById('modalTitleLabel').textContent = 'Edit Note';
  document.getElementById('noteTitle').value    = n.title;
  document.getElementById('noteContent').value  = n.content;
  document.getElementById('noteCategory').value = n.category;
  document.getElementById('deleteNoteBtn').style.display = 'inline-flex';
  document.getElementById('tagsInput').value    = '';

  const pinBtn = document.getElementById('pinBtn');
  n.pinned ? pinBtn.classList.add('pinned') : pinBtn.classList.remove('pinned');

  renderTagPills();
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('noteTitle').focus();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  editingId = null;
}

function saveNoteFromModal() {
  const title    = document.getElementById('noteTitle').value.trim();
  const content  = document.getElementById('noteContent').value.trim();
  const category = document.getElementById('noteCategory').value;
  const isPinned = document.getElementById('pinBtn').classList.contains('pinned');

  if (!title && !content) {
    showToast('Please add a title or content'); return;
  }

  if (editingId) {
    updateNote(editingId, { title, content, category, tags: currentTags, pinned: isPinned });
    showToast('Note updated');
  } else {
    const n = createNote({ title, content, category, tags: currentTags });
    if (isPinned) { n.pinned = true; saveNotes(); }
    showToast('Note saved');
  }

  closeModal();
  updateCounts();
  renderNotes();
}

/* ── TAGS ───────────────────────────────────── */

function renderTagPills() {
  const list = document.getElementById('tagsList');
  list.innerHTML = currentTags.map((t, i) => `
    <span class="tag-pill">
      ${escHtml(t)}
      <button type="button" data-idx="${i}" aria-label="Remove tag ${t}">&times;</button>
    </span>
  `).join('');

  list.querySelectorAll('button').forEach(btn =>
    btn.addEventListener('click', () => {
      currentTags.splice(+btn.dataset.idx, 1);
      renderTagPills();
    })
  );
}

function handleTagInput(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = e.target.value.replace(/,/g, '').trim().toLowerCase();
    if (val && !currentTags.includes(val) && currentTags.length < 6) {
      currentTags.push(val);
      renderTagPills();
    }
    e.target.value = '';
  }
}

/* ── DELETE CONFIRM ─────────────────────────── */

function openDeleteConfirm(id) {
  pendingDeleteId = id;
  document.getElementById('confirmOverlay').classList.add('open');
}

function closeDeleteConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  pendingDeleteId = null;
}

function confirmDeleteNote() {
  if (!pendingDeleteId) return;
  deleteNote(pendingDeleteId);
  closeDeleteConfirm();
  closeModal();
  updateCounts();
  renderNotes();
  showToast('Note deleted');
}

/* ── TOAST ──────────────────────────────────── */

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

/* ── AI ASSISTANT ───────────────────────────── */

const AI_RESPONSES = {
  default: [
    "Great idea! I'd suggest breaking it into smaller, actionable steps first. Would you like me to help outline that?",
    "That's an interesting thought. Consider also exploring the second-order effects — what happens after the first change?",
    "I can help you refine this. Try starting with the core problem statement before jumping to solutions.",
    "You're on the right track! Adding more specific details will make this much more powerful.",
    "Have you considered the reverse approach? Sometimes working backwards from the goal reveals a clearer path.",
  ],
  summarize: [
    `You have ${notes.length} notes in NoteNexa. Recent topics include: ${notes.slice(0,3).map(n=>n.title||'Untitled').join(', ') || 'no notes yet'}. Your most active category is "${getMostActiveCategory()}".`,
  ],
  productivity: [
    "Here are 3 productivity tips: 1) Use time-blocking — dedicate specific hours to specific tasks. 2) Practice the 2-minute rule: if it takes less than 2 minutes, do it now. 3) End each day by writing tomorrow's top 3 priorities.",
  ],
  brainstorm: [
    "Brainstorming mode activated! Try this: set a 5-minute timer and write down every idea without filtering. Quantity over quality first. Then review and pick your top 3 to develop further. What topic shall we brainstorm?",
  ],
};

function getMostActiveCategory() {
  const counts = { work: 0, personal: 0, ideas: 0, other: 0 };
  notes.forEach(n => counts[n.category] = (counts[n.category] || 0) + 1);
  return Object.entries(counts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'general';
}

function getAIResponse(input) {
  const q = input.toLowerCase();
  if (q.includes('summarize') || q.includes('summary') || q.includes('notes'))
    return AI_RESPONSES.summarize[0];
  if (q.includes('productivity') || q.includes('tips') || q.includes('focus'))
    return AI_RESPONSES.productivity[0];
  if (q.includes('brainstorm') || q.includes('ideas') || q.includes('creative'))
    return AI_RESPONSES.brainstorm[0];
  return AI_RESPONSES.default[Math.floor(Math.random() * AI_RESPONSES.default.length)];
}

function appendAIMessage(text, isUser = false) {
  const msgs = document.getElementById('aiMessages');
  const div  = document.createElement('div');
  div.className = `ai-msg${isUser ? ' user' : ''}`;
  div.innerHTML = `
    <div class="ai-avatar">${isUser ? 'U' : 'N'}</div>
    <div class="ai-bubble">${escHtml(text)}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendAIMessage(text) {
  if (!text.trim()) return;
  appendAIMessage(text, true);
  document.getElementById('aiInput').value = '';

  const typing = document.createElement('div');
  typing.className = 'ai-msg ai-typing';
  typing.innerHTML = '<div class="ai-avatar">N</div><div class="ai-bubble">Thinking…</div>';
  document.getElementById('aiMessages').appendChild(typing);
  document.getElementById('aiMessages').scrollTop = 9999;

  setTimeout(() => {
    typing.remove();
    appendAIMessage(getAIResponse(text));
  }, 900 + Math.random() * 600);
}

/* ── PAGE NAVIGATION ────────────────────────── */

function showDashboard() {
  document.getElementById('landing').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');
  updateCounts();
  renderNotes();
}

function showLanding() {
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('landing').classList.add('active');
}

/* ── INIT ───────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  setTheme(getTheme());

  /* LANDING BUTTONS */
  document.getElementById('goToDashboard').addEventListener('click', showDashboard);
  document.getElementById('getStarted').addEventListener('click', showDashboard);
  document.getElementById('learnMore').addEventListener('click', () => {
    document.getElementById('featuresSection').scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('backToLanding').addEventListener('click', showLanding);

  /* THEME TOGGLES */
  document.getElementById('themeToggleLanding').addEventListener('click', toggleTheme);
  document.getElementById('themeToggleDash').addEventListener('click', toggleTheme);

  /* NEW NOTE BUTTONS */
  document.getElementById('newNoteBtn').addEventListener('click', openNewModal);
  document.getElementById('newNoteBtnTop').addEventListener('click', openNewModal);

  /* MODAL */
  document.getElementById('saveNote').addEventListener('click', saveNoteFromModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  /* PIN BUTTON in modal */
  document.getElementById('pinBtn').addEventListener('click', () => {
    document.getElementById('pinBtn').classList.toggle('pinned');
  });

  /* DELETE */
  document.getElementById('deleteNoteBtn').addEventListener('click', () => {
    if (editingId) openDeleteConfirm(editingId);
  });
  document.getElementById('cancelDelete').addEventListener('click', closeDeleteConfirm);
  document.getElementById('confirmDelete').addEventListener('click', confirmDeleteNote);
  document.getElementById('confirmOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('confirmOverlay')) closeDeleteConfirm();
  });

  /* TAGS */
  document.getElementById('tagsInput').addEventListener('keydown', handleTagInput);

  /* SEARCH */
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    clearSearch.style.display = searchQuery ? 'flex' : 'none';
    renderNotes();
  });
  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearch.style.display = 'none';
    renderNotes();
    searchInput.focus();
  });

  /* SIDEBAR NAV */
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      currentFilter = item.dataset.filter;
      document.getElementById('areaTitle').textContent = {
        all: 'All Notes', pinned: 'Pinned Notes', work: 'Work',
        personal: 'Personal', ideas: 'Ideas', other: 'Other'
      }[currentFilter] || 'Notes';
      renderNotes();
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  /* VIEW TOGGLE */
  document.getElementById('gridView').addEventListener('click', () => {
    isListView = false;
    document.getElementById('gridView').classList.add('active');
    document.getElementById('listView').classList.remove('active');
    renderNotes();
  });
  document.getElementById('listView').addEventListener('click', () => {
    isListView = true;
    document.getElementById('listView').classList.add('active');
    document.getElementById('gridView').classList.remove('active');
    renderNotes();
  });

  /* SIDEBAR MOBILE */
  const sidebar    = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');

  function openSidebar()  { sidebar.classList.add('open'); }
  function closeSidebar() { sidebar.classList.remove('open'); }

  menuToggle.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);

  document.addEventListener('click', e => {
    if (window.innerWidth <= 768 &&
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      closeSidebar();
    }
  });

  /* AI PANEL */
  const aiPanel  = document.getElementById('aiPanel');
  const aiToggle = document.getElementById('aiToggle');

  aiToggle.addEventListener('click', () => {
    aiPanel.classList.toggle('open');
  });
  document.getElementById('closeAI').addEventListener('click', () => {
    aiPanel.classList.remove('open');
  });

  document.getElementById('aiSend').addEventListener('click', () => {
    sendAIMessage(document.getElementById('aiInput').value);
  });
  document.getElementById('aiInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendAIMessage(e.target.value);
  });
  document.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => sendAIMessage(chip.dataset.prompt));
  });

  /* KEYBOARD SHORTCUTS */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k' &&
        document.getElementById('dashboard').classList.contains('active')) {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    if (e.key === 'Escape') {
      closeModal();
      closeDeleteConfirm();
      aiPanel.classList.remove('open');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' &&
        document.getElementById('dashboard').classList.contains('active') &&
        !document.getElementById('modalOverlay').classList.contains('open')) {
      e.preventDefault();
      openNewModal();
    }
  });

  /* SEED SAMPLE DATA if first time */
  if (!localStorage.getItem('notenexa_seeded')) {
    const samples = [
      { title: 'Welcome to NoteNexa!', content: 'This is your smart note-taking workspace. Create, organize, and search your notes with ease. Press Ctrl+N to create a new note, or Ctrl+K to search.', category: 'other', tags: ['welcome', 'start'] },
      { title: 'Q4 Strategy Planning', content: 'Key goals for Q4:\n- Launch new product feature\n- Improve user retention by 20%\n- Expand to 3 new markets\n- Hire 5 engineers\n\nFocus: Customer success above all.', category: 'work', tags: ['strategy', 'q4'] },
      { title: 'Books to Read', content: 'Fiction:\n- Tomorrow, and Tomorrow, and Tomorrow\n- The Midnight Library\n\nNon-fiction:\n- The Creative Act by Rick Rubin\n- Thinking Fast and Slow\n- Zero to One', category: 'personal', tags: ['books', 'reading'] },
      { title: 'App Ideas Dump', content: '1. AI-powered journaling with mood tracking\n2. Collaborative recipe manager for families\n3. Micro-habit tracker with streaks\n4. Local-first encrypted notes app (done!)\n5. Voice memo → structured notes converter', category: 'ideas', tags: ['startup', 'ideas'] },
    ];

    samples.forEach(s => createNote(s));
    notes[0].pinned = true;
    saveNotes();
    localStorage.setItem('notenexa_seeded', '1');
  }
});