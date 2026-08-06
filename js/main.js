// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// "DR.plot()" mark scrolls back to the hero chart, centered in the viewport
const markScroll = document.getElementById('mark-scroll');
const heroChart = document.getElementById('hero-chart');

if (markScroll && heroChart) {
  markScroll.addEventListener('click', (e) => {
    e.preventDefault();
    heroChart.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
      inline: 'nearest'
    });
    history.replaceState(null, '', '#hero-chart');
  });
}

// Reveal sections gently as they enter the viewport
const revealTargets = document.querySelectorAll('.section, .project-row, .skill-card');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));
}

// ===== Developer Journey — accordion + timeline reveal =====
(function initDevJourney() {
  const groups = document.querySelectorAll('[data-accordion]');
  if (!groups.length) return;

  function openPanel(panel) {
    if (!panel) return;
    panel.classList.add('is-open');
    const timelines = panel.querySelectorAll('.timeline');
    // slight delay so nodes animate in as the panel finishes expanding
    window.setTimeout(() => {
      timelines.forEach(tl => tl.classList.add('in-view'));
    }, prefersReducedMotion ? 0 : 150);
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.classList.remove('is-open');
    panel.querySelectorAll('.timeline').forEach(tl => tl.classList.remove('in-view'));
  }

  groups.forEach(group => {
    // only the triggers that belong directly to this accordion group,
    // not ones inside a nested accordion further down
    const triggers = Array.from(group.querySelectorAll('.accordion-trigger'))
      .filter(t => t.closest('[data-accordion]') === group);

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';

        // close sibling panels in this same group (single-open accordion)
        triggers.forEach(t => {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            closePanel(document.getElementById(t.getAttribute('aria-controls')));
          }
        });

        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        willOpen ? openPanel(panel) : closePanel(panel);
      });
    });
  });
})();
