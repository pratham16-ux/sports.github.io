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

  /* ---- INPUT RESTRICTIONS (live, as-you-type) ---- */

  // Name fields: letters, spaces, hyphens only — max 16 chars
  ['fname', 'lname'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('maxlength', '16');
    el.addEventListener('input', () => {
      // Strip anything that isn't a letter, space, or hyphen
      const cleaned = el.value.replace(/[^A-Za-z\s\-]/g, '');
      if (el.value !== cleaned) el.value = cleaned;
    });
  });

  // Phone field: digits only, exactly 10
  const phoneEl = document.getElementById('phone');
  if (phoneEl) {
    phoneEl.setAttribute('maxlength', '10');
    phoneEl.setAttribute('inputmode', 'numeric');
    phoneEl.addEventListener('input', () => {
      const cleaned = phoneEl.value.replace(/\D/g, '').slice(0, 10);
      if (phoneEl.value !== cleaned) phoneEl.value = cleaned;
    });
  }

  /* ---- VALIDATION HELPERS ---- */

  function isValidEmail(value) {
    // RFC-aligned: local@domain.tld — rejects missing @, missing dot in domain, consecutive dots, etc.
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) &&
           !/\.{2,}/.test(value) &&
           !value.trim().startsWith('.') &&
           !value.trim().endsWith('.');
  }

  function markInvalid(field, msg) {
    field.classList.add('shake');
    field.style.borderColor = 'var(--red)';
    setTimeout(() => {
      field.classList.remove('shake');
      field.style.borderColor = '';
    }, 600);

    // Show inline error hint if one exists next to the field
    let hint = field.parentElement.querySelector('.field-error');
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'field-error';
      hint.style.cssText = 'font-family:var(--font-mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--red);margin-top:4px;display:block;';
      field.parentElement.appendChild(hint);
    }
    hint.textContent = msg;
    setTimeout(() => { if (hint) hint.textContent = ''; }, 3000);
  }

  /* ---- FORM SUBMIT: VALIDATION + SIGNUP REDIRECT ---- */
  document.querySelectorAll('.auth-form').forEach((form) => {
    const isSignup = !!form.querySelector('#fname'); // signup has fname; signin does not

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      /* 1. Required-field blank check */
      form.querySelectorAll('[required]').forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          markInvalid(field, 'This field is required');
        }
      });

      if (isSignup) {
        /* 2. First name — letters only, 1–16 chars */
        const fname = document.getElementById('fname');
        if (fname && fname.value.trim()) {
          if (!/^[A-Za-z\s\-]{1,16}$/.test(fname.value.trim())) {
            valid = false;
            markInvalid(fname, 'Letters only, max 16 characters');
          }
        }

        /* 3. Last name — letters only, 1–16 chars */
        const lname = document.getElementById('lname');
        if (lname && lname.value.trim()) {
          if (!/^[A-Za-z\s\-]{1,16}$/.test(lname.value.trim())) {
            valid = false;
            markInvalid(lname, 'Letters only, max 16 characters');
          }
        }

        /* 4. Phone — exactly 10 digits */
        const phone = document.getElementById('phone');
        if (phone && phone.value.trim()) {
          const digits = phone.value.replace(/\D/g, '');
          if (digits.length !== 10) {
            valid = false;
            markInvalid(phone, 'Enter a valid 10-digit number');
          }
        }

        /* 5. Email — stricter format check */
        const email = document.getElementById('email');
        if (email && email.value.trim()) {
          if (!isValidEmail(email.value)) {
            valid = false;
            markInvalid(email, 'Enter a valid email address');
          }
        }
      }

      if (!valid) return;

      /* All good — show toast then redirect */
      if (isSignup) {
        showToast(form.dataset.success || 'Account created — check your email to confirm…');
        setTimeout(() => {
          window.location.href = 'signin.html';
        }, 2000); // short delay so user sees the toast
      } else {
        showToast(form.dataset.success || 'Welcome back — redirecting to your dashboard…');
      }
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