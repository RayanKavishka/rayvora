const Alert = (function () {

  const ICONS  = { success: '✓', error: '✕', info: 'i', warning: '!' };
  const TITLES = { success: 'Success', error: 'Error', info: 'Info', warning: 'Warning' };
  const BAR    = { success: '#3fa661', error: '#E5502A', info: '#3f8fc9', warning: '#c98a20' };

  let ready = false;
  let toastStack, bannerSlot, snackbarSlot, modalSlot, modalCard;

  /* ---------- one-time setup ---------- */

  function injectStyles() {
    const css = `
      #alert-toast-stack{position:fixed;top:20px;right:20px;z-index:9000;display:flex;flex-direction:column;gap:10px;width:320px;max-width:90vw;}
      .rv-toast{background:var(--rv-surface,#fff);border:1px solid var(--rv-border,#EAE8F5);border-radius:12px;box-shadow:0 12px 32px -12px rgba(43,36,28,.18);padding:13px 14px;display:flex;gap:11px;align-items:flex-start;position:relative;overflow:hidden;font-family:inherit;}
      .rv-toast .rv-icon{width:26px;height:26px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;}
      .rv-toast .rv-body{flex:1;min-width:0;}
      .rv-toast .rv-title{font-weight:600;font-size:13.5px;margin:0 0 2px;color:var(--rv-text,#2B241C);}
      .rv-toast .rv-msg{font-size:12.5px;color:var(--rv-text-soft,#6b6459);margin:0;line-height:1.4;}
      .rv-toast .rv-close{background:none;border:none;color:var(--rv-text-soft,#6b6459);cursor:pointer;font-size:15px;line-height:1;padding:2px;}
      .rv-toast .rv-bar{position:absolute;left:0;bottom:0;height:3px;width:100%;transform-origin:left;}

      #alert-banner-slot{position:fixed;top:0;left:0;right:0;z-index:8990;display:flex;justify-content:center;pointer-events:none;}
      .rv-banner{pointer-events:auto;width:100%;background:#2B241C;color:#fff;padding:11px 20px;display:flex;align-items:center;justify-content:center;gap:14px;font-size:13px;font-weight:500;font-family:inherit;}
      .rv-banner .rv-close{background:none;border:none;color:#fff;opacity:.7;cursor:pointer;font-size:15px;}

      #alert-snackbar-slot{position:fixed;left:20px;bottom:20px;z-index:9000;}
      .rv-snackbar{background:#2B241C;color:#fff;border-radius:11px;padding:12px 14px;display:flex;align-items:center;gap:16px;box-shadow:0 12px 32px -12px rgba(43,36,28,.18);font-size:13px;font-family:inherit;}
      .rv-snackbar .rv-action{background:none;border:none;color:#B5BAFF;font-weight:700;cursor:pointer;font-size:13px;white-space:nowrap;}

      #alert-modal-slot{position:fixed;inset:0;z-index:9500;display:none;align-items:center;justify-content:center;background:rgba(20,17,12,.45);backdrop-filter:blur(3px);}
      .rv-modal-card{background:var(--rv-surface,#fff);border-radius:18px;width:340px;max-width:90vw;padding:24px;box-shadow:0 12px 32px -12px rgba(43,36,28,.18);font-family:inherit;}
      .rv-modal-card h3{margin:0 0 6px;font-size:17px;color:var(--rv-text,#2B241C);}
      .rv-modal-card p{margin:0 0 20px;font-size:13.5px;color:var(--rv-text-soft,#6b6459);line-height:1.55;}
      .rv-modal-actions{display:flex;gap:10px;}
      .rv-modal-actions button{flex:1;border:none;cursor:pointer;font-weight:600;font-size:13px;padding:10px 14px;border-radius:9px;font-family:inherit;}
      .rv-btn-ghost{background:transparent;border:1px solid var(--rv-border,#EAE8F5) !important;color:var(--rv-text,#2B241C);}
      .rv-btn-danger{background:#E5502A;color:#fff;}
      .rv-btn-primary{background:#2B241C;color:#fff;}
    `;
    const tag = document.createElement('style');
    tag.setAttribute('data-alert-styles', '');
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function injectContainers() {
    toastStack = el('div', { id: 'alert-toast-stack' });
    bannerSlot = el('div', { id: 'alert-banner-slot' });
    snackbarSlot = el('div', { id: 'alert-snackbar-slot' });
    modalSlot = el('div', { id: 'alert-modal-slot' });
    modalCard = el('div', { class: 'rv-modal-card' });
    modalSlot.appendChild(modalCard);
    document.body.append(toastStack, bannerSlot, snackbarSlot, modalSlot);
  }

  function init() {
    if (ready) return;
    ready = true;
    injectStyles();
    injectContainers();
  }

  function ensureReady() {
    if (ready) return;
    if (document.body) init();
    else document.addEventListener('DOMContentLoaded', init, { once: true });
  }
  ensureReady();

  /* ---------- small DOM + animation helpers ---------- */

  function el(tag, attrs, html) {
    const node = document.createElement(tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (html) node.innerHTML = html;
    return node;
  }

  function animateIn(node, from) {
    if (window.gsap) {
      gsap.fromTo(node, from.from, from.to);
    } else {
      node.style.transition = 'all .25s ease';
      Object.assign(node.style, from.to);
    }
  }

  function animateOut(node, vars, onDone) {
    if (window.gsap) {
      gsap.to(node, { ...vars, onComplete: onDone });
    } else {
      node.style.transition = 'all .2s ease';
      Object.assign(node.style, vars);
      setTimeout(onDone, 200);
    }
  }

  /* ---------- toast ---------- */

  function toast(type, text, title) {
    ensureReady();
    const node = el('div', { class: 'rv-toast' },
      `<div class="rv-icon" style="background:${BAR[type]}">${ICONS[type]}</div>
       <div class="rv-body">
         <p class="rv-title">${title || TITLES[type]}</p>
         <p class="rv-msg"></p>
       </div>
       <button class="rv-close">×</button>
       <div class="rv-bar" style="background:${BAR[type]}"></div>`
    );
    node.querySelector('.rv-msg').textContent = text; // textContent avoids HTML injection
    toastStack.appendChild(node);

    animateIn(node, { from: { x: 60, opacity: 0 }, to: { x: 0, opacity: 1, duration: .45, ease: 'back.out(1.6)' } });
    const bar = node.querySelector('.rv-bar');
    if (window.gsap) gsap.to(bar, { scaleX: 0, duration: 4, ease: 'none' });

    const remove = () => animateOut(node, { x: 60, opacity: 0, duration: .3 }, () => node.remove());
    const timer = setTimeout(remove, 4000);
    node.querySelector('.rv-close').addEventListener('click', () => { clearTimeout(timer); remove(); });
    return remove;
  }

  const success = (text, title) => toast('success', text, title);
  const error   = (text, title) => toast('error', text, title);
  const info    = (text, title) => toast('info', text, title);
  const warning = (text, title) => toast('warning', text, title);

  /* ---------- banner ---------- */

  function banner(text, opts = {}) {
    ensureReady();
    if (bannerSlot.querySelector('.rv-banner')) return; // one at a time
    const node = el('div', { class: 'rv-banner' },
      `<span></span><button class="rv-close">×</button>`
    );
    node.querySelector('span').textContent = text;
    bannerSlot.appendChild(node);

    animateIn(node, { from: { y: -60 }, to: { y: 0, duration: .4, ease: 'power2.out' } });
    const remove = () => animateOut(node, { y: -60, duration: .3 }, () => node.remove());
    node.querySelector('.rv-close').addEventListener('click', remove);
    if (opts.duration) setTimeout(remove, opts.duration);
    return remove;
  }

  /* ---------- snackbar ---------- */

  function snackbar(text, actionLabel, onAction, duration = 4000) {
    ensureReady();
    snackbarSlot.innerHTML = '';
    const node = el('div', { class: 'rv-snackbar' },
      `<span></span>${actionLabel ? `<button class="rv-action">${actionLabel}</button>` : ''}`
    );
    node.querySelector('span').textContent = text;
    snackbarSlot.appendChild(node);

    animateIn(node, { from: { y: 40, opacity: 0 }, to: { y: 0, opacity: 1, duration: .4, ease: 'power2.out' } });
    const remove = () => animateOut(node, { y: 40, opacity: 0, duration: .25 }, () => node.remove());
    const timer = setTimeout(remove, duration);
    if (actionLabel) {
      node.querySelector('.rv-action').addEventListener('click', () => {
        clearTimeout(timer);
        remove();
        if (onAction) onAction();
      });
    }
    return remove;
  }

  /* ---------- confirm modal ---------- */

  function confirm(text, onConfirm, opts = {}) {
    ensureReady();
    const {
      title = 'Are you sure?',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      danger = true,
      onCancel
    } = opts;

    modalCard.innerHTML = `
      <h3></h3>
      <p></p>
      <div class="rv-modal-actions">
        <button class="rv-btn-ghost" data-role="cancel">${cancelLabel}</button>
        <button class="${danger ? 'rv-btn-danger' : 'rv-btn-primary'}" data-role="confirm">${confirmLabel}</button>
      </div>`;
    modalCard.querySelector('h3').textContent = title;
    modalCard.querySelector('p').textContent = text;

    modalSlot.style.display = 'flex';
    animateIn(modalCard, { from: { scale: .9, opacity: 0 }, to: { scale: 1, opacity: 1, duration: .3, ease: 'back.out(1.7)' } });

    function close(cb) {
      animateOut(modalCard, { scale: .9, opacity: 0, duration: .2 }, () => {
        modalSlot.style.display = 'none';
        if (cb) cb();
      });
    }
    modalCard.querySelector('[data-role="cancel"]').onclick = () => close(onCancel);
    modalCard.querySelector('[data-role="confirm"]').onclick = () => close(onConfirm);
  }

  return { success, error, info, warning, banner, snackbar, confirm };
})();
