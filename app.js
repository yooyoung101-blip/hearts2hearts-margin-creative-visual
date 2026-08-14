(() => {
  const body = document.body;
  const gate = document.getElementById('gate');
  const enter = document.getElementById('enter-site');

  body.classList.add('is-locked');

  const openSite = () => {
    if (gate.classList.contains('is-open')) return;
    gate.classList.add('is-open');
    body.classList.remove('is-locked');
    window.setTimeout(() => gate.setAttribute('aria-hidden', 'true'), 850);
  };

  enter.addEventListener('click', openSite);
  window.addEventListener('keydown', (event) => {
    if (!gate.classList.contains('is-open') && (event.key === 'Enter' || event.code === 'Space')) {
      event.preventDefault();
      openSite();
    }
  });

  const drawer = document.getElementById('index-drawer');
  const backdrop = document.getElementById('index-backdrop');
  const drawerOpen = document.getElementById('index-open');
  const drawerClose = document.getElementById('index-close');

  const setDrawer = (open) => {
    drawer.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    drawerOpen.setAttribute('aria-expanded', String(open));
    body.classList.toggle('is-locked', open);
    if (open) drawerClose.focus();
    else drawerOpen.focus();
  };

  drawerOpen.addEventListener('click', () => setDrawer(true));
  drawerClose.addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));
  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setDrawer(false)));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
  });

  const progress = document.getElementById('progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const chapterLabel = document.getElementById('current-chapter');
  const chapters = [...document.querySelectorAll('.chapter')];
  const chapterObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) chapterLabel.textContent = visible.target.dataset.chapter;
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .1, .3] });
  chapters.forEach((chapter) => chapterObserver.observe(chapter));

  const kvButtons = document.querySelectorAll('[data-kv-target]');
  const kvSlides = document.querySelectorAll('[data-kv]');
  kvButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.kvTarget;
      kvButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      kvSlides.forEach((slide) => slide.classList.toggle('is-active', slide.dataset.kv === target));
    });
  });

  const deskState = {
    composition: 'GROUP 8',
    lens: '50MM / BALANCED',
    light: 'SOFT / DIRECTIONAL'
  };

  const briefText = {
    'GROUP 8': 'Keep all eight inside one frame. Build two connected eye-lines, one empty interval and a single shared object. Shoot the clean master before unit variations.',
    '4+4 UNIT': 'Stage two units with the same gesture at different timing. Leave a deliberate gap between the groups so the berry line can bridge both halves.',
    'PAIR RELAY': 'Direct four pairs around one action: give, mirror, interrupt and complete. Every second frame must answer the previous frame.',
    '1×8 TRACE': 'Shoot eight portraits in fixed camera position. Each member begins with the final gesture of the member before them, creating one continuous edit.'
  };

  const updateBrief = () => {
    document.getElementById('brief-composition').textContent = deskState.composition;
    document.getElementById('brief-lens').textContent = deskState.lens;
    document.getElementById('brief-light').textContent = deskState.light;
    document.getElementById('brief-direction').textContent = `${briefText[deskState.composition]} Use ${deskState.lens.toLowerCase()} framing with ${deskState.light.toLowerCase()} light.`;
  };

  document.querySelectorAll('[data-desk-group]').forEach((group) => {
    const key = group.dataset.deskGroup;
    group.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        group.querySelectorAll('button').forEach((item) => item.classList.toggle('is-active', item === button));
        deskState[key] = button.dataset.value;
        updateBrief();
      });
    });
  });

  const memberButtons = [...document.querySelectorAll('[data-member]')];
  const signalOutput = document.getElementById('signal-output');
  let selectedMembers = [];
  const prompts = [
    ['GESTURE RELAY', 'The first member begins a hand movement; the second finishes it in the next cut. Keep camera height and crop identical.'],
    ['SHARED OBJECT', 'One object exits the first frame and enters the second. Change only the receiving gesture, not the object position.'],
    ['EYE-LINE CUT', 'Place both members in separate frames. Their eye-lines meet only in the edit, creating one implied space.'],
    ['MIRROR DISTANCE', 'Repeat one pose at two camera distances: a spatial 35mm unit and an intimate 85mm answer.'],
    ['PROXIMITY SHIFT', 'Begin with physical distance, then close the gap without changing expression. The relationship—not the pose—is the reveal.']
  ];

  const renderSignal = () => {
    if (selectedMembers.length < 2) {
      signalOutput.innerHTML = `<span>WAITING FOR 02 SIGNALS</span><strong>${selectedMembers[0] || 'SELECT A PAIR'}</strong><p>Choose one more member to create a shoot prompt.</p>`;
      return;
    }
    const indexA = memberButtons.findIndex((button) => button.dataset.member === selectedMembers[0]);
    const indexB = memberButtons.findIndex((button) => button.dataset.member === selectedMembers[1]);
    const [title, copy] = prompts[(indexA + indexB) % prompts.length];
    signalOutput.innerHTML = `<span>${selectedMembers.join(' × ')}</span><strong>${title}</strong><p>${copy}</p>`;
  };

  memberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const member = button.dataset.member;
      if (selectedMembers.includes(member)) {
        selectedMembers = selectedMembers.filter((item) => item !== member);
      } else {
        if (selectedMembers.length === 2) {
          const removed = selectedMembers.shift();
          memberButtons.find((item) => item.dataset.member === removed)?.classList.remove('is-selected');
        }
        selectedMembers.push(member);
      }
      memberButtons.forEach((item) => item.classList.toggle('is-selected', selectedMembers.includes(item.dataset.member)));
      renderSignal();
    });
  });
})();
