(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const drawer = document.getElementById('project-index');
  const backdrop = document.getElementById('index-backdrop');
  const drawerOpen = document.getElementById('menu-open');
  const drawerClose = document.getElementById('menu-close');
  let returnFocus = null;

  const setDrawer = (open) => {
    drawer.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    backdrop.setAttribute('aria-hidden', String(!open));
    drawerOpen.setAttribute('aria-expanded', String(open));
    body.classList.toggle('is-locked', open);
    if (open) {
      returnFocus = document.activeElement;
      drawerClose.focus();
    } else if (returnFocus) {
      returnFocus.focus();
    }
  };

  drawerOpen.addEventListener('click', () => setDrawer(true));
  drawerClose.addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));
  drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setDrawer(false)));

  const progress = document.getElementById('read-progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, percent / 100))})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const currentSection = document.getElementById('current-section');
  const observed = [...document.querySelectorAll('.observed')];
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });

    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (current) currentSection.textContent = current.target.dataset.section;
  }, { rootMargin: '-12% 0px -48% 0px', threshold: [0, .08, .25, .5] });
  observed.forEach((section) => revealObserver.observe(section));

  const songParts = {
    intro: {
      time: '00:00 — 00:13',
      title: '여덟 개의 알람이 03:17에 동시에 멈춘다.',
      copy: '뮤직 박스의 유리 질감 위로 YE-ON의 낮은 독백과 STELLA의 숨 섞인 화음을 겹친다. 드럼은 아직 등장하지 않는다.'
    },
    verse: {
      time: '00:14 — 00:40',
      title: '각자의 방이 하나의 복도로 이어진다.',
      copy: 'CARMEN과 YUHA의 맑은 음색을 하프타임 브레이크비트 위에 둔다. 문을 여는 동작을 매치 컷으로 연결해 공간만 바뀌게 한다.'
    },
    pre: {
      time: '00:41 — 00:56',
      title: '벽이 숨 쉬고, 꿈의 속도가 두 배가 된다.',
      copy: 'JIWOO의 중심 동작과 A-NA의 표정 전환을 축으로 트랜스 아르페지오를 상승시킨다. 파란 실이 여덟 방을 처음 잇는다.'
    },
    chorus: {
      time: '00:57 — 01:22',
      title: '“꿈에서 만나” — 여덟 방이 하나의 원이 된다.',
      copy: '160 BPM 리퀴드 D&B가 완전히 열린다. 짧은 한국어 훅을 전원 유니즌으로 반복하고, 카메라는 원형 군무를 한 바퀴 돈다.'
    },
    bridge: {
      time: '02:06 — 02:28',
      title: '기억은 정확하지 않고, 동작만 뒤늦게 남는다.',
      copy: 'JUUN과 IAN의 동작을 1/8초 장노출로 기록한다. 여덟 명이 한 명씩 한 박자 늦게 같은 동작을 이어 받아 라운드를 만든다.'
    },
    final: {
      time: '02:29 — 02:54',
      title: '깨어난 뒤에도 같은 파란 실이 손에 남는다.',
      copy: '코러스 패드와 8인 군무를 끝까지 밀어 올린 뒤, 마지막 박자에서 모든 소리를 끊는다. 설명 대신 손의 흔적만 남긴다.'
    }
  };

  const songVisual = document.getElementById('song-visual');
  document.querySelectorAll('.song-part').forEach((button) => {
    button.addEventListener('click', () => {
      const part = songParts[button.dataset.part];
      document.querySelectorAll('.song-part').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      songVisual.classList.remove('is-changing');
      void songVisual.offsetWidth;
      songVisual.innerHTML = `<span>${part.time}</span><strong>${part.title}</strong><p>${part.copy}</p>`;
      songVisual.classList.add('is-changing');
    });
  });

  const mvScenes = [
    {
      image: 'assets/ref-blue-room.jpg',
      alt: '파란 침실 세트 연출 참고 이미지',
      number: 'SCENE 01 / 06',
      time: '00:00 — 00:13',
      title: '각자의 방, 같은 시각',
      copy: '여덟 개의 파란 방. 크기가 다른 침대와 문으로 강제 원근을 만들고, 알람이 모두 03:17에 멈춘다.',
      specs: [['렌즈', '24mm 틸트 시프트'], ['빛', '5600K 달빛 + 4300K 스탠드'], ['편집', '알람 소리에 맞춘 8컷']]
    },
    {
      image: 'assets/h2h-dream-mood-02.jpg',
      alt: '파란 조명과 유리 장식을 사용한 인물 연출 이미지',
      number: 'SCENE 02 / 06',
      time: '00:14 — 00:40',
      title: '첫 번째 꿈의 문',
      copy: 'YE-ON이 물속처럼 흔들리는 파란 커튼을 통과한다. 같은 동작을 CARMEN과 YUHA가 서로 다른 방에서 이어 받는다.',
      specs: [['렌즈', '50mm 핸드헬드'], ['장치', '실크 커튼 + 저속 팬'], ['편집', '문 동작 매치 컷']]
    },
    {
      image: 'assets/ref-syncope-greenhouse.jpg',
      alt: '푸른 안개 속 밤의 유리 온실',
      number: 'SCENE 03 / 06',
      time: '00:41 — 00:56',
      title: '밤의 온실',
      copy: '각자의 방에서 사라진 물건이 같은 온실 바닥에 떨어진다. 현실 식물 사이에 파란 잎 한 장만 추가해 오류를 만든다.',
      specs: [['렌즈', '35mm 저상 돌리'], ['빛', '새벽 실광 + 로우 포그'], ['편집', '낙하물 그래픽 매치']]
    },
    {
      image: 'assets/ref-ultramarine-motion.jpg',
      alt: '울트라마린 의상과 장노출 잔상 이미지',
      number: 'SCENE 04 / 06',
      time: '02:06 — 02:28',
      title: '기억 오류',
      copy: 'JUUN과 IAN의 동작이 한 박자 늦은 잔상으로 남는다. 표정은 고정하고 팔과 의상 끝만 흔들어 인물을 읽히게 한다.',
      specs: [['렌즈', '85mm · 셔터 1/8초'], ['빛', '코발트 반사광'], ['편집', '프레임 잔상 3회 반복']]
    },
    {
      image: 'assets/h2h-afterimage-ballet-key-visual.png',
      alt: 'Hearts2Hearts 여덟 멤버 단체 화보',
      number: 'SCENE 05 / 06',
      time: '00:57 — 02:05',
      title: '여덟 방이 하나의 원으로',
      copy: '4+4로 갈라진 벽이 후렴 첫 박자에 접힌다. 카메라는 천장과 눈높이를 오가며 여덟 명의 원형 군무를 한 공간으로 증명한다.',
      specs: [['렌즈', '28mm 크레인 + 오비트'], ['구도', '방사형 오버헤드'], ['안무', '4+4 분리 → 8인 원']]
    },
    {
      image: 'assets/ref-h2h-style-01.jpg',
      alt: 'Hearts2Hearts 단체 커버 화보',
      number: 'SCENE 06 / 06',
      time: '02:29 — 02:54',
      title: '깨어난 증거',
      copy: '아침의 같은 방에서 여덟 명이 눈을 뜬다. 모두의 손에 같은 파란 실이 남고, 마지막 무음과 동시에 설명 없이 끝난다.',
      specs: [['렌즈', '50mm 고정'], ['빛', '5200K 새벽 역광'], ['편집', '무음 하드 컷']]
    }
  ];

  const sceneImage = document.getElementById('mv-scene-image');
  const sceneNumber = document.getElementById('mv-scene-number');
  const sceneTime = document.getElementById('mv-scene-time');
  const sceneTitle = document.getElementById('mv-scene-title');
  const sceneCopy = document.getElementById('mv-scene-copy');
  const sceneSpec = document.getElementById('mv-scene-spec');
  const sceneButtons = [...document.querySelectorAll('[data-scene]')];

  const showScene = (index) => {
    const scene = mvScenes[index];
    sceneImage.classList.add('is-changing');
    window.setTimeout(() => {
      sceneImage.src = scene.image;
      sceneImage.alt = scene.alt;
      sceneImage.classList.remove('is-changing');
    }, reducedMotion ? 0 : 140);
    sceneNumber.textContent = scene.number;
    sceneTime.textContent = scene.time;
    sceneTitle.textContent = scene.title;
    sceneCopy.textContent = scene.copy;
    sceneSpec.innerHTML = scene.specs.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');
    sceneButtons.forEach((button) => {
      const active = Number(button.dataset.scene) === index;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  sceneButtons.forEach((button) => button.addEventListener('click', () => showScene(Number(button.dataset.scene))));
  document.querySelectorAll('[data-scene-jump]').forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    const jump = () => {
      showScene(Number(card.dataset.sceneJump));
      document.getElementById('mv').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    };
    card.addEventListener('click', jump);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        jump();
      }
    });
  });

  const boardState = { space: 'room', light: 'moon', motion: 'still' };
  const boardOptions = {
    space: {
      room: { label: '파란 방', image: 'assets/ref-blue-room.jpg', base: '24mm 고정 카메라. 침대와 문 크기를 달리해 깊이가 틀어진 방을 만든다.' },
      greenhouse: { label: '밤의 온실', image: 'assets/ref-syncope-greenhouse.jpg', base: '35mm 저상 돌리. 실제 식물 사이에 파란 잎 하나만 두어 현실의 오류를 만든다.' },
      studio: { label: '잔상 방', image: 'assets/ref-ultramarine-motion.jpg', base: '85mm 인물 프레임. 촬영 장비가 보이지 않는 빈 공간에서 얼굴과 움직이는 의상 끝만 분리한다.' }
    },
    light: {
      moon: { label: '달빛', copy: '5600K 상부광과 4300K 생활광을 3:1로 둔다.' },
      dawn: { label: '새벽빛', copy: '5200K 역광을 창 방향 한 곳에서만 넣는다.' },
      flash: { label: '반사광', copy: '코발트 젤 반사광을 인물 뒤 45도에서 짧게 터뜨린다.' }
    },
    motion: {
      still: { label: '정지', copy: '카메라와 표정을 고정해 공간의 이상만 보이게 한다.' },
      trace: { label: '잔상', copy: '셔터 1/8초로 팔과 의상 끝에 잔상 세 겹을 남긴다.' },
      fold: { label: '벽 접기', copy: '후렴 첫 박자에 세트 벽을 안쪽으로 접어 4+4를 8인 원으로 전환한다.' }
    }
  };
  const boardPreview = document.getElementById('board-preview');
  const boardImage = document.getElementById('board-image');
  const boardLabel = document.getElementById('board-label');
  const boardDirection = document.getElementById('board-direction');

  const updateBoard = () => {
    const space = boardOptions.space[boardState.space];
    const light = boardOptions.light[boardState.light];
    const motion = boardOptions.motion[boardState.motion];
    boardPreview.dataset.space = boardState.space;
    boardPreview.dataset.light = boardState.light;
    boardPreview.dataset.motion = boardState.motion;
    boardImage.src = space.image;
    boardImage.alt = `${space.label}, ${light.label}, ${motion.label} 연출 참고 화면`;
    boardLabel.textContent = `${space.label} / ${light.label} / ${motion.label}`;
    boardDirection.textContent = `${space.base} ${light.copy} ${motion.copy}`;
  };

  document.querySelectorAll('[data-board-group]').forEach((group) => {
    const key = group.dataset.boardGroup;
    group.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        boardState[key] = button.dataset.value;
        group.querySelectorAll('button').forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        updateBoard();
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxButton = lightbox.querySelector('button');
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCopy = lightbox.querySelector('p');
  let lightboxReturn = null;

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-locked');
    lightboxReturn?.focus();
  };

  document.querySelectorAll('[data-zoomable]').forEach((figure) => {
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', '참고 이미지 크게 보기');
    const openLightbox = () => {
      const image = figure.querySelector('img');
      const caption = figure.querySelector('figcaption');
      lightboxReturn = figure;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCopy.textContent = caption?.innerText.replace(/\s+/g, ' ').trim() || image.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      body.classList.add('is-locked');
      lightboxButton.focus();
    };
    figure.addEventListener('click', openLightbox);
    figure.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox();
      }
    });
  });
  lightboxButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (lightbox.classList.contains('is-open')) closeLightbox();
    else if (drawer.classList.contains('is-open')) setDrawer(false);
  });

  const aura = document.querySelector('.cursor-aura');
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    let x = -100;
    let y = -100;
    let targetX = x;
    let targetY = y;
    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });
    const followPointer = () => {
      x += (targetX - x) * .12;
      y += (targetY - y) * .12;
      aura.style.transform = `translate3d(${x - 80}px, ${y - 80}px, 0)`;
      requestAnimationFrame(followPointer);
    };
    followPointer();
  }
})();
