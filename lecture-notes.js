(() => {
  const tocList = document.querySelector('[data-lecture-notes="toc"]');
  const sectionsContainer = document.querySelector('[data-lecture-notes="sections"]');
  const statusEl = document.querySelector('[data-lecture-notes="status"]');
  const tocShell = document.querySelector('[data-toc-shell]');
  const tocToggle = document.querySelector('[data-toc-toggle]');
  const currentSubjectEl = document.querySelector('[data-lecture-notes="current-subject"]');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopTocModeQuery = window.matchMedia('(min-width: 981px)');

  const sectionIdRegistry = new Set();
  let sectionTrackingEntries = [];
  let sectionObserver = null;
  let tocCompactThreshold = Number.POSITIVE_INFINITY;
  let tocPlaceholder = null;

  if (!tocList || !sectionsContainer || !tocShell) {
    return;
  }

  const getUniqueSectionId = (value, index) => {
    const baseSlug = String(value || `section-${index + 1}`)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const normalizedBase = baseSlug || `section-${index + 1}`;
    let uniqueSlug = normalizedBase;
    let suffix = 2;

    while (sectionIdRegistry.has(uniqueSlug)) {
      uniqueSlug = `${normalizedBase}-${suffix}`;
      suffix += 1;
    }

    sectionIdRegistry.add(uniqueSlug);
    return uniqueSlug;
  };

  const setStatus = (message, isError) => {
    if (!statusEl) {
      return;
    }

    statusEl.textContent = message;
    statusEl.classList.toggle('error', Boolean(isError));
    statusEl.hidden = !message;
  };

  const setTocMenuOpen = (isOpen) => {
    tocShell.setAttribute('data-menu-open', String(isOpen));

    if (!tocToggle) {
      return;
    }

    tocToggle.setAttribute('aria-expanded', String(isOpen));
    tocToggle.setAttribute('aria-label', isOpen ? 'Close subjects list' : 'Open subjects list');

    const icon = tocToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-xmark', isOpen);
    }
  };

  const closeTocMenu = () => {
    setTocMenuOpen(false);
  };

  const ensureTocPlaceholder = (height) => {
    if (tocPlaceholder) {
      tocPlaceholder.style.height = `${height}px`;
      return;
    }

    tocPlaceholder = document.createElement('div');
    tocPlaceholder.className = 'toc-compact-placeholder';
    tocPlaceholder.style.height = `${height}px`;
    tocShell.parentNode.insertBefore(tocPlaceholder, tocShell);
  };

  const removeTocPlaceholder = () => {
    if (!tocPlaceholder) {
      return;
    }

    tocPlaceholder.remove();
    tocPlaceholder = null;
  };

  const setCompactMode = (isCompact) => {
    const currentlyCompact = tocShell.classList.contains('is-compact');
    if (currentlyCompact === isCompact) {
      return;
    }

    if (isCompact) {
      ensureTocPlaceholder(tocShell.getBoundingClientRect().height);
      tocShell.classList.add('is-compact');
      closeTocMenu();
      return;
    }

    tocShell.classList.remove('is-compact');
    removeTocPlaceholder();
    closeTocMenu();
  };

  const recalcTocCompactThreshold = () => {
    if (!desktopTocModeQuery.matches) {
      tocCompactThreshold = Number.POSITIVE_INFINITY;
      return;
    }

    const thresholdTarget = tocPlaceholder || tocShell;
    const rect = thresholdTarget.getBoundingClientRect();
    tocCompactThreshold = window.scrollY + rect.bottom;
  };

  const syncTocDisplayMode = () => {
    if (!desktopTocModeQuery.matches) {
      setCompactMode(false);
      return;
    }

    const shouldUseCompact = window.scrollY >= tocCompactThreshold;
    setCompactMode(shouldUseCompact);
  };

  const setActiveTocButton = (targetButton) => {
    const tocButtons = tocList.querySelectorAll('button');
    tocButtons.forEach((button) => {
      const isActive = button === targetButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    if (currentSubjectEl) {
      currentSubjectEl.textContent = targetButton ? targetButton.textContent : 'Subjects';
    }
  };

  const updateActiveTocFromScroll = () => {
    if (!sectionTrackingEntries.length) {
      return;
    }

    const markerY = window.scrollY + window.innerHeight * 0.34;
    let activeEntry = sectionTrackingEntries[0];

    sectionTrackingEntries.forEach((entry) => {
      const sectionTop = entry.sectionEl.getBoundingClientRect().top + window.scrollY;
      if (sectionTop <= markerY) {
        activeEntry = entry;
      }
    });

    setActiveTocButton(activeEntry.button);
  };

  const setupSectionTracking = (entries) => {
    sectionTrackingEntries = entries;

    if (sectionObserver) {
      sectionObserver.disconnect();
      sectionObserver = null;
    }

    if (!sectionTrackingEntries.length) {
      return;
    }

    if ('IntersectionObserver' in window) {
      sectionObserver = new IntersectionObserver(
        () => {
          updateActiveTocFromScroll();
        },
        {
          root: null,
          threshold: [0, 0.2, 0.4, 0.8],
          rootMargin: '-20% 0px -55% 0px',
        }
      );

      sectionTrackingEntries.forEach((entry) => {
        sectionObserver.observe(entry.sectionEl);
      });
    }

    updateActiveTocFromScroll();
  };

  const createNoteCard = (note) => {
    const card = document.createElement('div');
    card.className = 'note-card';

    const content = document.createElement('div');
    content.className = 'note-content';

    const title = document.createElement('h4');
    title.textContent = note.name || 'Untitled';

    const meta = document.createElement('p');
    meta.className = 'note-meta';

    if (note.url) {
      try {
        const hostname = new URL(note.url).hostname.replace(/^www\./, '');
        meta.textContent = hostname;
      } catch (error) {
        meta.textContent = 'External source';
      }
    } else {
      meta.textContent = 'No source URL';
    }

    const link = document.createElement('a');
    link.className = 'note-link';

    if (note.url) {
      link.href = note.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open Notes';
    } else {
      link.href = '#';
      link.textContent = 'Link unavailable';
      link.setAttribute('aria-disabled', 'true');
      link.tabIndex = -1;
    }

    content.append(title, meta, link);
    card.append(content);
    return card;
  };

  const createSubsection = (subsection) => {
    const container = document.createElement('div');
    container.className = 'subsection';

    const subsectionHeader = document.createElement('div');
    subsectionHeader.className = 'subsection-header';

    const title = document.createElement('h3');
    title.className = 'subsection-title';
    title.textContent = subsection.title || '';

    const notes = subsection.notes || [];
    const noteCount = document.createElement('span');
    noteCount.className = 'subsection-count';
    noteCount.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`;

    subsectionHeader.append(title, noteCount);

    const grid = document.createElement('div');
    grid.className = 'notes-grid';

    notes.forEach((note) => {
      grid.append(createNoteCard(note));
    });

    container.append(subsectionHeader, grid);
    return container;
  };

  const createSection = (section, index, sectionId) => {
    const container = document.createElement('div');
    container.className = 'section';
    container.id = sectionId;

    const kicker = document.createElement('p');
    kicker.className = 'section-kicker';
    kicker.textContent = `Section ${index + 1}`;

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = section.title || '';

    container.append(kicker, title);

    (section.subsections || []).forEach((subsection) => {
      container.append(createSubsection(subsection));
    });

    return container;
  };

  const createTocEntry = (label, sectionEl) => {
    const item = document.createElement('li');
    const button = document.createElement('button');

    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-current', 'false');
    button.addEventListener('click', () => {
      sectionEl.scrollIntoView({
        behavior: reduceMotionQuery.matches ? 'auto' : 'smooth',
        block: 'start',
      });
      setActiveTocButton(button);
      closeTocMenu();
    });

    item.append(button);
    return { item, button };
  };

  const render = (data) => {
    tocList.textContent = '';
    sectionsContainer.textContent = '';
    sectionIdRegistry.clear();

    const tocFragment = document.createDocumentFragment();
    const sectionsFragment = document.createDocumentFragment();
    const trackingEntries = [];
    let firstButton = null;

    data.forEach((section, index) => {
      const sectionId = getUniqueSectionId(section.title, index);
      const sectionEl = createSection(section, index, sectionId);
      sectionsFragment.append(sectionEl);

      const { item, button } = createTocEntry(section.title || `Section ${index + 1}`, sectionEl);
      if (!firstButton) {
        firstButton = button;
      }

      tocFragment.append(item);
      trackingEntries.push({ sectionEl, button });
    });

    tocList.append(tocFragment);
    sectionsContainer.append(sectionsFragment);

    if (firstButton) {
      setActiveTocButton(firstButton);
    } else {
      setActiveTocButton(null);
    }

    setupSectionTracking(trackingEntries);
    recalcTocCompactThreshold();
    syncTocDisplayMode();

    if (!data.length) {
      setStatus('No lecture notes published yet.', false);
    }
  };

  const fetchData = async () => {
    setStatus('Loading lecture notes...', false);

    try {
      const response = await fetch('https://korotenky.com/lecture-notes');
      if (!response.ok) {
        throw new Error('Failed to fetch lecture notes');
      }

      const json = await response.json();
      render(Array.isArray(json.sections) ? json.sections : []);
      setStatus('', false);
    } catch (error) {
        render([{"id":11,"title":"Additional Resources","position":0,"subsections":[{"id":21,"title":"Main","position":0,"section_id":11,"notes":[{"id":68,"name":"Collection of Resources","url":"https://math.dobbikov.com","position":0,"section_id":null,"subsection_id":21},{"id":78,"name":"My TDs (L2 + L3) and Past Lecture Notes (L2)","url":"https://dobbikov.github.io/yehor-tds-licence/","position":1,"section_id":null,"subsection_id":21},{"id":70,"name":"Reina's Lecture Notes","url":"https://dobbikov.github.io/reina-lecture-notes/","position":2,"section_id":null,"subsection_id":21}]}],"notes":[]},{"id":13,"title":"Numerical Linear Algebra","position":1,"subsections":[{"id":23,"title":"Explanations","position":0,"section_id":13,"notes":[{"id":73,"name":"Orthogonal Matrices","url":"https://dobbikov.github.io/semester6-lecture-notes/orthogonal-matrices.pdf","position":0,"section_id":null,"subsection_id":23},{"id":74,"name":"Adjoint Visually","url":"https://dobbikov.github.io/semester6-lecture-notes/adjoint-visually.html","position":1,"section_id":null,"subsection_id":23},{"id":75,"name":"Cos-Approx via Least Squares Problem","url":"https://dobbikov.github.io/semester6-lecture-notes/cos-approxim.html","position":2,"section_id":null,"subsection_id":23},{"id":76,"name":"Normal Matrices","url":"https://dobbikov.github.io/semester6-lecture-notes/normal-matrices.html","position":3,"section_id":null,"subsection_id":23},{"id":77,"name":"LU decomposition visually","url":"https://dobbikov.github.io/semester6-lecture-notes/gaussian-lu.html","position":4,"section_id":null,"subsection_id":23},{"id":79,"name":"Cholesky decomposition with Schur's Complement","url":"https://dobbikov.github.io/semester6-lecture-notes/cholesky-schur.html","position":5,"section_id":null,"subsection_id":23},{"id":82,"name":"Interclassing Theorem Proof","url":"https://dobbikov.github.io/semester6-lecture-notes/interclassing-theorem.html","position":6,"section_id":null,"subsection_id":23}]}],"notes":[]},{"id":10,"title":"Statistical Inference","position":2,"subsections":[{"id":20,"title":"Main","position":0,"section_id":10,"notes":[{"id":67,"name":"Amphis","url":"https://dobbikov.github.io/semester6-lecture-notes/stats.pdf","position":0,"section_id":null,"subsection_id":20},{"id":80,"name":"Lectures (English)","url":"https://dobbikov.github.io/semester6-lecture-notes/stats_en.pdf","position":1,"section_id":null,"subsection_id":20},{"id":81,"name":"Конспект (Українською)","url":"https://dobbikov.github.io/semester6-lecture-notes/stats_ua.pdf","position":2,"section_id":null,"subsection_id":20},{"id":69,"name":"CheatSheet","url":"https://dobbikov.github.io/semester6-lecture-notes/stats-cheatsheet.pdf","position":3,"section_id":null,"subsection_id":20}]}],"notes":[]},{"id":12,"title":"Distributed Algorithms","position":3,"subsections":[{"id":22,"title":"Main","position":0,"section_id":12,"notes":[{"id":71,"name":"Algo theory","url":"https://dobbikov.github.io/semester6-lecture-notes/algo.html","position":0,"section_id":null,"subsection_id":22},{"id":72,"name":"CheatSheet","url":"https://dobbikov.github.io/semester6-lecture-notes/algo-cheatsheet.pdf","position":1,"section_id":null,"subsection_id":22}]}],"notes":[]},{"id":1,"title":"Integration and Measure Theory","position":4,"subsections":[{"id":1,"title":"Notes","position":0,"section_id":1,"notes":[{"id":50,"name":"Carathéodory Criterion Explanation (English)","url":"https://dobbikov.github.io/semester5-lecture-notes/measure-theory-caratheodory-criterion-en.pdf","position":0,"section_id":null,"subsection_id":1},{"id":51,"name":"Explication du Crithère de Carathéodory (Français)","url":"https://dobbikov.github.io/semester5-lecture-notes/measure-theory-caratheodory-criterion-fr.pdf","position":1,"section_id":null,"subsection_id":1}]},{"id":2,"title":"CheatSheet","position":1,"section_id":1,"notes":[{"id":52,"name":"CheatSheet (English)","url":"https://dobbikov.github.io/semester5-lecture-notes/measure-theory-cheatsheet-en.pdf","position":0,"section_id":null,"subsection_id":2},{"id":53,"name":"CheatSheet (Français)","url":"https://dobbikov.github.io/semester5-lecture-notes/measure-theory-cheatsheet-fr.pdf","position":1,"section_id":null,"subsection_id":2}]}],"notes":[]},{"id":2,"title":"Optimisation (Calcul Différentiel)","position":5,"subsections":[{"id":3,"title":"Notes","position":0,"section_id":2,"notes":[{"id":54,"name":"CheatSheet","url":"https://dobbikov.github.io/semester5-lecture-notes/optimisation_cheatsheet.pdf","position":0,"section_id":null,"subsection_id":3},{"id":55,"name":"Full CheatSheet","url":"https://dobbikov.github.io/semester5-lecture-notes/optimisation_cheatsheet_full.pdf","position":1,"section_id":null,"subsection_id":3}]}],"notes":[]},{"id":3,"title":"Probabilité Continue","position":6,"subsections":[{"id":4,"title":"Notes","position":0,"section_id":3,"notes":[{"id":7,"name":"CheatSheet 2 (long)","url":"https://dobbikov.github.io/semester5-lecture-notes/probas_full_cheatsheet.pdf","position":0,"section_id":null,"subsection_id":4},{"id":8,"name":"CheatSheet (long)","url":"https://dobbikov.github.io/semester5-lecture-notes/probas_cheatsheet.pdf","position":1,"section_id":null,"subsection_id":4}]}],"notes":[]},{"id":4,"title":"Algèbre Linéaire 2","position":7,"subsections":[{"id":5,"title":"Notes","position":0,"section_id":4,"notes":[{"id":56,"name":"Main Notes (en Français)","url":"https://dobbikov.github.io/semester4-lecture-notes/linalg.pdf","position":0,"section_id":null,"subsection_id":5},{"id":57,"name":"Main Notes (in English)","url":"https://dobbikov.github.io/semester4-lecture-notes/linalg_en.pdf","position":1,"section_id":null,"subsection_id":5},{"id":58,"name":"Main Notes (українською)","url":"https://dobbikov.github.io/semester4-lecture-notes/linalg_ua.pdf","position":2,"section_id":null,"subsection_id":5},{"id":59,"name":"CheatSheet","url":"https://dobbikov.github.io/semester4-lecture-notes/linalg_cheatsheet.pdf","position":3,"section_id":null,"subsection_id":5}]}],"notes":[]},{"id":5,"title":"Analyse et Géometrie","position":8,"subsections":[{"id":6,"title":"Notes","position":0,"section_id":5,"notes":[{"id":63,"name":"Main Notes (en français)","url":"https://dobbikov.github.io/semester4-lecture-notes/analyse.pdf","position":1,"section_id":null,"subsection_id":6},{"id":64,"name":"Main Notes (in English)","url":"https://dobbikov.github.io/semester4-lecture-notes/analyse_en.pdf","position":2,"section_id":null,"subsection_id":6},{"id":65,"name":"Main Notes (українською)","url":"https://dobbikov.github.io/semester4-lecture-notes/analyse_ua.pdf","position":3,"section_id":null,"subsection_id":6},{"id":66,"name":"CheatSheet","url":"https://dobbikov.github.io/semester4-lecture-notes/analyse_cheatsheet.pdf","position":4,"section_id":null,"subsection_id":6}]}],"notes":[]},{"id":6,"title":"Analyse numérique avec python","position":9,"subsections":[{"id":7,"title":"Notes","position":0,"section_id":6,"notes":[{"id":60,"name":"Main Notes","url":"https://dobbikov.github.io/semester4-lecture-notes/anal-avec-python.pdf","position":0,"section_id":null,"subsection_id":7},{"id":61,"name":"CheatSheet","url":"https://dobbikov.github.io/semester4-lecture-notes/anp-cheatsheet.pdf","position":1,"section_id":null,"subsection_id":7}]}],"notes":[]},{"id":7,"title":"Probabilités et Statistique","position":10,"subsections":[{"id":8,"title":"Notes","position":0,"section_id":7,"notes":[{"id":19,"name":"CheatSheet","url":"https://drive.google.com/file/d/11t-5UA9UeiMGsyvyqo-4vrUK4Q1v1rS2/view?usp=sharing","position":0,"section_id":null,"subsection_id":8},{"id":20,"name":"Long CheatSheet (+stats)","url":"https://drive.google.com/file/d/11vh_yhZQLm2OBFj_3HfNPr5P8NHM-Q6o/view?usp=sharing","position":1,"section_id":null,"subsection_id":8}]},{"id":9,"title":"Lectures","position":1,"section_id":7,"notes":[{"id":21,"name":"Lecture 9: Variance","url":"https://drive.google.com/file/d/1pVdunJ_5tkNMFhtnOqI9CKG_lgXCHgU7/view?usp=sharing","position":0,"section_id":null,"subsection_id":9},{"id":22,"name":"Lecture 10: Inégalité de Markov","url":"https://drive.google.com/file/d/1x7W6AjryWnULXfOgaMk1K0V096Tctz6t/view?usp=sharing","position":1,"section_id":null,"subsection_id":9},{"id":23,"name":"Lecture 11: Stats","url":"https://drive.google.com/file/d/1woc7LzjEBeqJhxqI9ATu0ucbmEeTERl1/view?usp=sharing","position":2,"section_id":null,"subsection_id":9},{"id":24,"name":"Lecture 12: Exemples de stats","url":"https://drive.google.com/file/d/1_LCuuLqp6X077WdHAC0adsGLKBPz6S7c/view?usp=sharing","position":3,"section_id":null,"subsection_id":9}]},{"id":10,"title":"TD Feuille 1","position":2,"section_id":7,"notes":[{"id":25,"name":"Énoncé de la feuille 1","url":"https://drive.google.com/file/d/12weN532cy4_5hHlKXAENMSEDoJDpF6h0/view?usp=sharing","position":0,"section_id":null,"subsection_id":10},{"id":26,"name":"La plupart des exos (corrigé)","url":"https://drive.google.com/file/d/1kHzrRftewlTLnRKpQBZS2Kedr7yXgs18/view?usp=sharing","position":1,"section_id":null,"subsection_id":10}]},{"id":11,"title":"TD Feuille 2","position":3,"section_id":7,"notes":[{"id":27,"name":"Énoncé de la feuille 2","url":"https://drive.google.com/file/d/1eYAk_OVf_g9qNS-GAxcNNcuhKlbaFPMi/view?usp=sharing","position":0,"section_id":null,"subsection_id":11},{"id":28,"name":"Corrigé des exos: 2, 7, 5, 12, 15","url":"https://drive.google.com/file/d/18yJPQ9lNk1yCVOjGnriQHxLJf_ZlIjU-/view?usp=sharing","position":1,"section_id":null,"subsection_id":11}]},{"id":12,"title":"TD Feuille 3","position":4,"section_id":7,"notes":[{"id":29,"name":"Énoncé de la feuille 3","url":"https://drive.google.com/file/d/1tsnJRBbWEyp30dr4SXEFt2NOFFKozzNU/view?usp=sharing","position":0,"section_id":null,"subsection_id":12},{"id":30,"name":"TD 5","url":"https://drive.google.com/file/d/13imL7havz9GKQHkhKjZLgnymLoGie1Dm/view?usp=sharing","position":1,"section_id":null,"subsection_id":12},{"id":31,"name":"TD 6","url":"https://drive.google.com/file/d/1HsOE5t5d1pKpBW47eUg6m38mLWVix7Xi/view?usp=sharing","position":2,"section_id":null,"subsection_id":12},{"id":32,"name":"TD 7","url":"https://drive.google.com/file/d/1Ghb7m8K0KqAFwNXShQjCZsh09NRB8TH3/view?usp=sharing","position":3,"section_id":null,"subsection_id":12},{"id":33,"name":"TD 8","url":"https://drive.google.com/file/d/1hCJVu2ueU3bqguyKgmyTVam-WyEUKNvB/view?usp=sharing","position":4,"section_id":null,"subsection_id":12},{"id":34,"name":"TD 9","url":"https://drive.google.com/file/d/1QvDyG9vn8snOmWhjcKC1B7TIrlp3wJvV/view?usp=sharing","position":5,"section_id":null,"subsection_id":12}]},{"id":13,"title":"TD Feuille 4","position":5,"section_id":7,"notes":[{"id":35,"name":"Énoncé de la feuille 4","url":"https://drive.google.com/file/d/1mw3RwGSnIEuYERd2bEs3PkfgDNCddWeb/view?usp=sharing","position":0,"section_id":null,"subsection_id":13},{"id":36,"name":"TD 10","url":"https://drive.google.com/file/d/1cbM9yNmqzcp9_CFwbqyuHQT0Zw3dPFbA/view?usp=sharing","position":1,"section_id":null,"subsection_id":13},{"id":37,"name":"TD 11","url":"https://drive.google.com/file/d/1Vy9w7jzvMtdIsw515Ch-Dv10UlK6r7ir/view?usp=sharing","position":2,"section_id":null,"subsection_id":13},{"id":38,"name":"TD 12","url":"https://drive.google.com/file/d/1-A0OkAKux00HsdMus9lqFXh5b_5ftnWY/view?usp=sharing","position":3,"section_id":null,"subsection_id":13}]}],"notes":[]},{"id":9,"title":"Structure Algebrique","position":11,"subsections":[{"id":16,"title":"Ressources utiles","position":0,"section_id":9,"notes":[{"id":44,"name":"CheatSheet","url":"https://drive.google.com/file/d/1VHpo11NGR3C8wvPGgpxFLdI5kw3ukSgJ/view?usp=sharing","position":0,"section_id":null,"subsection_id":16},{"id":45,"name":"Fractions de polynômes","url":"https://drive.google.com/file/d/1-37E1hT6IRQinj6MF9xgB3OZOfYU-wRe/view?usp=sharing","position":1,"section_id":null,"subsection_id":16},{"id":46,"name":"DM 2 par Joël Merker","url":"https://drive.google.com/drive/folders/1-G59WwGsC1br_Z828bUeA1qzz2ndhujC?usp=sharing","position":2,"section_id":null,"subsection_id":16}]},{"id":17,"title":"Nombres Complexes","position":1,"section_id":9,"notes":[{"id":47,"name":"CheatSheet","url":"https://drive.google.com/file/d/1fqTRJaABhSIw-vXjtfor1HZXB6Ziuzpm/view?usp=sharing","position":0,"section_id":null,"subsection_id":17},{"id":48,"name":"TD","url":"https://drive.google.com/file/d/1MQPJjuMo7m_tKozIy22ErcghJ6_X14mW/view?usp=sharing","position":1,"section_id":null,"subsection_id":17},{"id":49,"name":"Solution de TD","url":"https://drive.google.com/file/d/1n8Np5OCYuk_blS_GDlwNadgkGDEYKSzU/view?usp=sharing","position":2,"section_id":null,"subsection_id":17}]},{"id":18,"title":"CMs","position":2,"section_id":9,"notes":[]},{"id":19,"title":"TDs","position":3,"section_id":9,"notes":[]}],"notes":[]},{"id":8,"title":"Analyse et Convergence","position":12,"subsections":[{"id":14,"title":"Ressources Utiles","position":0,"section_id":8,"notes":[{"id":39,"name":"Intégrales CheatSheet","url":"https://drive.google.com/file/d/1Ne14dOmvbHC0WEPSbMriod0t-7PztptM/view?usp=sharing","position":0,"section_id":null,"subsection_id":14},{"id":40,"name":"Développements Limités CheatSheet","url":"https://drive.google.com/file/d/1LFiR_cDE6edQTbklOmTw2UpFh_z1izMi/view?usp=sharing","position":1,"section_id":null,"subsection_id":14}]},{"id":15,"title":"Notes","position":1,"section_id":8,"notes":[{"id":41,"name":"Fonctions à plusieures variables (mes notes)","url":"https://drive.google.com/file/d/11OXP7jSdEYrhwNdeCLlcjCh2slyYbGLI/view?usp=sharing","position":0,"section_id":null,"subsection_id":15},{"id":42,"name":"Intégrales à paramètre (mes notes)","url":"https://drive.google.com/file/d/11KzT-eDPMXNfjdDx-V192vrTb8tgsqqb/view?usp=sharing","position":1,"section_id":null,"subsection_id":15},{"id":43,"name":"Intégrales doubles par University of Durham","url":"https://drive.google.com/file/d/1-IUDLfW844NB9yGFQ6aBmcqk9HAz34ZH/view","position":2,"section_id":null,"subsection_id":15}]}],"notes":[]}])
      setStatus('Unable to load lecture notes right now.', true);
    }
  };

  if (tocToggle) {
    tocToggle.addEventListener('click', () => {
      const isOpen = tocShell.getAttribute('data-menu-open') === 'true';
      setTocMenuOpen(!isOpen);
    });
  }

  setTocMenuOpen(false);

  document.addEventListener('click', (event) => {
    if (!tocShell.contains(event.target)) {
      closeTocMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeTocMenu();
    }
  });

  window.addEventListener(
    'scroll',
    () => {
      syncTocDisplayMode();
      updateActiveTocFromScroll();
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    recalcTocCompactThreshold();
    syncTocDisplayMode();
    updateActiveTocFromScroll();
  });

  desktopTocModeQuery.addEventListener('change', () => {
    recalcTocCompactThreshold();
    syncTocDisplayMode();
  });

  fetchData();
})();
