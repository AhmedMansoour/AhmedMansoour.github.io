/* Fixed one-click jump between the top and bottom of the portfolio. */
(() => {
  'use strict';

  function initQuickJump() {
    if (document.querySelector('.quick-jump')) return;

    const style = document.createElement('style');
    style.textContent = `
      .quick-jump {
        position: fixed;
        right: max(20px, env(safe-area-inset-right));
        bottom: max(22px, env(safe-area-inset-bottom));
        z-index: 70;
        display: grid;
        place-items: center;
        width: 49px;
        height: 49px;
        padding: 0;
        color: #ecfff4;
        background: #173e40;
        border: 1px solid #628d84;
        border-radius: 50%;
        box-shadow: 0 8px 27px rgba(9, 34, 34, .26);
        cursor: pointer;
        transition: background .2s ease, box-shadow .2s ease, transform .2s ease;
      }
      .quick-jump:hover {background: #20665e;box-shadow: 0 11px 32px rgba(9,34,34,.34);transform: translateY(-2px)}
      .quick-jump:focus-visible {outline: 3px solid #d7b777;outline-offset: 3px}
      .quick-jump svg {width: 23px;height: 23px;transition: transform .22s ease}
      .quick-jump.is-up svg {transform: rotate(180deg)}
      @media(max-width: 600px) {
        .quick-jump {right: max(14px, env(safe-area-inset-right));bottom: max(16px, env(safe-area-inset-bottom));width: 44px;height: 44px}
      }
      @media(prefers-reduced-motion: reduce) {
        .quick-jump,.quick-jump svg {transition: none}
        .quick-jump:hover {transform: none}
      }
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quick-jump';
    button.setAttribute('aria-label', 'Jump to bottom of page');
    button.title = 'Jump to bottom';
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6"/></svg>';
    document.body.appendChild(button);

    let jumpUp = false;
    let updateQueued = false;

    function updateDirection() {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const position = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      const shouldJumpUp = maxScroll > 0 && position >= maxScroll / 2;
      if (shouldJumpUp === jumpUp) return;
      jumpUp = shouldJumpUp;
      button.classList.toggle('is-up', jumpUp);
      const label = jumpUp ? 'Jump to top of page' : 'Jump to bottom of page';
      button.setAttribute('aria-label', label);
      button.title = jumpUp ? 'Jump to top' : 'Jump to bottom';
    }

    function queueUpdate() {
      if (updateQueued) return;
      updateQueued = true;
      window.requestAnimationFrame(() => {
        updateQueued = false;
        updateDirection();
      });
    }

    button.addEventListener('click', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const bottom = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.scrollTo({top: jumpUp ? 0 : bottom, behavior: reducedMotion ? 'instant' : 'smooth'});
    });
    window.addEventListener('scroll', queueUpdate, {passive: true});
    window.addEventListener('resize', queueUpdate);
    document.addEventListener('portfolio:route', () => window.requestAnimationFrame(queueUpdate));
    updateDirection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickJump, {once: true});
  } else {
    initQuickJump();
  }
})();
