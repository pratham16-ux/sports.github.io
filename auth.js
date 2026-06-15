/* ==========================================
   STACKLY ACCESS PORTAL — SHARED JS
   ========================================== */

(function () {
  'use strict';

  /* ---- LIVE SCOREBOARD CLOCK ---- */
  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    const tick = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- COUNTDOWN TO NEXT TOP-OF-HOUR SESSION ---- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const tick = () => {
      const now = new Date();
      const next = new Date(now);
      next.setMinutes(0, 0, 0);
      next.setHours(now.getHours() + 1);
      let diff = Math.floor((next - now) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      const pad = (n) => String(n).padStart(2, '0');
      countdownEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- ROLE TOGGLE (Member / Coach — the "two options") ---- */
  const roleToggle = document.querySelector('.role-toggle');
  const roleBtns = document.querySelectorAll('.role-btn');
  const roleNameEls = document.querySelectorAll('.role-name');
  const coachOnlyEls = document.querySelectorAll('.coach-only');
  const memberOnlyEls = document.querySelectorAll('.member-only');

  function setRole(role) {
    document.documentElement.setAttribute('data-role', role);
    roleBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.role === role));
    roleNameEls.forEach((el) => { el.textContent = role.toUpperCase(); });
    coachOnlyEls.forEach((el) => { el.hidden = role !== 'coach'; });
    memberOnlyEls.forEach((el) => { el.hidden = role !== 'member'; });
  }

  if (roleToggle) {
    roleBtns.forEach((btn) => {
      btn.addEventListener('click', () => setRole(btn.dataset.role));
    });
    setRole('member');
  }

  /* ---- PASSWORD VISIBILITY TOGGLE ---- */
  document.querySelectorAll('.toggle-pass').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? '🙈' : '👁';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  /* ---- SPORT CHIP MULTI-SELECT ---- */
  document.querySelectorAll('.sport-chip').forEach((chip) => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  /* ---- PASSWORD STRENGTH METER ---- */
  const pwInput = document.getElementById('password');
  const strengthSegs = document.querySelectorAll('.strength-seg');
  const strengthLabel = document.querySelector('.strength-label');
  if (pwInput && strengthSegs.length) {
    pwInput.addEventListener('input', () => {
      const val = pwInput.value;
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const colors = ['var(--red)', 'var(--red)', 'var(--amber)', 'var(--green)', 'var(--green)'];
      const labels = ['Too short', 'Weak', 'Okay', 'Strong', 'Excellent'];

      strengthSegs.forEach((seg, i) => {
        if (val.length === 0) {
          seg.style.background = '';
          seg.style.borderColor = '';
        } else if (i < score) {
          seg.style.background = colors[score];
          seg.style.borderColor = colors[score];
        } else {
          seg.style.background = '';
          seg.style.borderColor = '';
        }
      });
      if (strengthLabel) {
        strengthLabel.textContent = val.length === 0 ? 'Use 6+ characters' : labels[score];
      }
    });
  }

  /* ---- BASIC VALIDATION + DEMO SUBMIT ---- */
  document.querySelectorAll('.auth-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('shake');
          setTimeout(() => field.classList.remove('shake'), 500);
        }
      });
      if (!valid) return;
      showToast(form.dataset.success || 'Welcome back — redirecting to your dashboard…');
    });
  });

  function showToast(message) {
    let toast = document.querySelector('.auth-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'auth-toast';
      toast.innerHTML = '<span class="dot"></span><span class="toast-msg"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('.toast-msg').textContent = message;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

})();