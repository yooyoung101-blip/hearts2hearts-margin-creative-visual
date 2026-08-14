(() => {
  const soundBars = document.getElementById('sound-bars');
  for (let i = 0; i < 42; i += 1) {
    const bar = document.createElement('i');
    bar.style.setProperty('--h', `${18 + (i * 37) % 82}%`);
    soundBars.appendChild(bar);
  }

  const body = document.body;
  const gate = document.getElementById('gate');
  const enter = document.getElementById('enter-site');
  const openSite = () => {
    if (gate.classList.contains('is-open')) return;
    gate.classList.add('is-open');
    body.classList.remove('is-locked');
    setTimeout(() => gate.setAttribute('aria-hidden', 'true'), 900);
  };
  enter.addEventListener('click', openSite);
  window.addEventListener('keydown', (e) => {
    if (!gate.classList.contains('is-open') && (e.key === 'Enter' || e.code === 'Space')) {
      e.preventDefault(); openSite();
    }
  });

  const cursor = document.querySelector('.cursor');
  window.addEventListener('pointermove', e => {
    cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`;
  });
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });

  const drawer = document.getElementById('index');
  const backdrop = document.getElementById('backdrop');
  const indexOpen = document.getElementById('index-open');
  const setDrawer = open => {
    drawer.classList.toggle('is-open', open); backdrop.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open)); indexOpen.setAttribute('aria-expanded', String(open));
    body.classList.toggle('is-locked', open);
  };
  indexOpen.addEventListener('click', () => setDrawer(true));
  document.getElementById('index-close').addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));
  const wipe = document.getElementById('wipe');
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', e => {
    e.preventDefault(); const target = link.getAttribute('href'); setDrawer(false);
    wipe.classList.remove('is-active'); void wipe.offsetWidth; wipe.classList.add('is-active');
    setTimeout(() => document.querySelector(target)?.scrollIntoView(), 480);
  }));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setDrawer(false); });

  const progress = document.querySelector('.progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
  const chapterLabel = document.getElementById('chapter-label');
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(x => x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if (visible) chapterLabel.textContent = visible.target.dataset.chapter;
  }, {rootMargin:'-20% 0px -62% 0px', threshold:[0,.15,.4]});
  document.querySelectorAll('.chapter').forEach(el => observer.observe(el));

  const collected = [];
  const count = document.getElementById('signal-count');
  const status = document.getElementById('signal-status');
  const finalOpen = document.getElementById('final-open');
  document.querySelectorAll('[data-signal]').forEach(button => button.addEventListener('click', () => {
    if (button.classList.contains('is-found')) return;
    button.classList.add('is-found'); collected.push(button.dataset.signal);
    count.textContent = `${collected.length} / 8`;
    status.textContent = collected.join(' · ');
    if (collected.length === 8) {
      finalOpen.disabled = false; document.querySelector('.signals').classList.add('is-complete');
      status.textContent = '최종 커버가 열렸습니다.';
      document.getElementById('collected-words').textContent = collected.join(' · ');
    }
  }));
  const finalCover = document.getElementById('final-cover');
  finalOpen.addEventListener('click', () => { finalCover.classList.add('is-open'); finalCover.setAttribute('aria-hidden','false'); body.classList.add('is-locked'); });
  document.getElementById('final-close').addEventListener('click', () => { finalCover.classList.remove('is-open'); finalCover.setAttribute('aria-hidden','true'); body.classList.remove('is-locked'); });

  const pairButtons = [...document.querySelectorAll('[data-member]')];
  const pairOutput = document.getElementById('pair-output');
  let pair = [];
  const pairDirections = [
    ['GESTURE RELAY','첫 멤버가 시작한 손동작을 다음 컷에서 두 번째 멤버가 같은 높이로 완성한다.'],
    ['EYE-LINE CUT','서로 다른 세트에서 촬영하되 두 사람의 시선이 편집점에서 정확히 만나게 한다.'],
    ['SHARED OBJECT','큐카드가 첫 프레임 밖으로 나가 같은 위치에서 두 번째 프레임으로 들어온다.'],
    ['MIRROR DISTANCE','같은 포즈를 35mm 전신과 85mm 클로즈업으로 나눠 한 동작처럼 연결한다.']
  ];
  pairButtons.forEach((button, index) => button.addEventListener('click', () => {
    const name = button.dataset.member;
    if (pair.includes(name)) pair = pair.filter(x => x !== name);
    else { if (pair.length === 2) pair.shift(); pair.push(name); }
    pairButtons.forEach(b => b.classList.toggle('is-selected', pair.includes(b.dataset.member)));
    if (pair.length < 2) { pairOutput.innerHTML = `<span>SELECT 02</span><b>${pair[0] || 'PAIR DIRECTION'}</b><p>한 명을 더 선택하세요.</p>`; return; }
    const other = pairButtons.findIndex(b => b.dataset.member === pair[0]);
    const [title,copy] = pairDirections[(index + other) % pairDirections.length];
    pairOutput.innerHTML = `<span>${pair.join(' × ')}</span><b>${title}</b><p>${copy}</p>`;
  }));

  const cover = document.getElementById('cover');
  const coverState = {crop:'wide', tone:'blue', mark:'line'};
  document.querySelectorAll('[data-cover-group]').forEach(group => group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    group.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === button));
    coverState[group.dataset.coverGroup] = button.dataset.value;
    cover.dataset.crop = coverState.crop; cover.dataset.tone = coverState.tone; cover.dataset.mark = coverState.mark;
  })));
  cover.dataset.crop='wide'; cover.dataset.tone='blue'; cover.dataset.mark='line';

  const desk = {formation:'GROUP 8',lens:'50MM',light:'FLASH'};
  const briefCopy = {
    'GROUP 8':'여덟 명을 하나의 비대칭 포메이션으로 두고 카메라 장비까지 와이드 프레임에 포함한다.',
    '4+4 UNIT':'두 유닛이 같은 제스처를 다른 타이밍으로 반복하고 프레임 중앙의 빈 공간으로 연결한다.',
    'PAIR RELAY':'네 쌍이 주기·받기·비추기·완성하기 동작을 이어 하나의 편집 리듬을 만든다.',
    '1×8 PORTRAIT':'카메라 위치를 고정하고 앞 멤버의 마지막 동작을 다음 멤버의 첫 동작으로 이어 촬영한다.'
  };
  const lightCopy = {SOFT:'부드러운 방향광으로 피부와 천의 질감을 살린다.',FLASH:'하드 플래시로 인물과 세트 표면을 동시에 선명하게 잡는다.',EDGE:'측면 엣지 라이트로 실루엣과 멤버 간 간격을 분리한다.'};
  const renderBrief = () => {
    document.getElementById('brief-head').textContent = `${desk.formation} · ${desk.lens} · ${desk.light}`;
    document.getElementById('brief-copy').textContent = `${briefCopy[desk.formation]} ${desk.lens} 렌즈를 기준으로 ${lightCopy[desk.light]}`;
  };
  document.querySelectorAll('[data-desk]').forEach(group => group.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    group.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === button)); desk[group.dataset.desk] = button.dataset.value; renderBrief();
  })));

  const wordButtons = [...document.querySelectorAll('[data-word]')];
  const sentence = document.getElementById('sentence');
  let nextWord = 0;
  wordButtons.forEach(button => button.addEventListener('click', () => {
    if (Number(button.dataset.order) !== nextWord) { button.animate([{transform:'translateX(-3px)'},{transform:'translateX(3px)'},{transform:'none'}],{duration:180}); return; }
    button.classList.add('done'); button.disabled = true; nextWord++;
    sentence.textContent = wordButtons.map((b,i) => i < nextWord ? b.dataset.word : '_').join(' ');
    if (nextWord === 8) sentence.textContent += '.';
  }));
})();
