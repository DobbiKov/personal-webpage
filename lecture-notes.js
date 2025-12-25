(() => {
  const tocList = document.querySelector('[data-lecture-notes="toc"]');
  const sectionsContainer = document.querySelector('[data-lecture-notes="sections"]');
  const statusEl = document.querySelector('[data-lecture-notes="status"]');

  if (!tocList || !sectionsContainer) {
    return;
  }

  const setStatus = (message, isError) => {
    if (!statusEl) {
      return;
    }
    statusEl.textContent = message;
    statusEl.classList.toggle("error", Boolean(isError));
    statusEl.hidden = !message;
  };

  const createNoteCard = (note) => {
    const card = document.createElement("div");
    card.className = "note-card";

    const content = document.createElement("div");
    content.className = "note-content";

    const title = document.createElement("h4");
    title.textContent = note.name || "Untitled";

    const link = document.createElement("a");
    link.className = "note-link";
    link.href = note.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open Notes";

    content.append(title, link);
    card.append(content);

    return card;
  };

  const createSubsection = (subsection) => {
    const container = document.createElement("div");
    container.className = "subsection";

    const title = document.createElement("h3");
    title.className = "subsection-title";
    title.textContent = subsection.subsection || "";

    const grid = document.createElement("div");
    grid.className = "notes-grid";

    (subsection.notes || []).forEach((note) => {
      grid.append(createNoteCard(note));
    });

    container.append(title, grid);
    return container;
  };

  const createSection = (section) => {
    const container = document.createElement("div");
    container.className = "section";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = section.sections || "";

    container.append(title);

    (section.subsections || []).forEach((subsection) => {
      container.append(createSubsection(subsection));
    });

    return container;
  };

  const createTocEntry = (label, onClick) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);
    item.append(button);
    return item;
  };

  const render = (data) => {
    const sectionEls = [];

    data.forEach((section, index) => {
      const sectionEl = createSection(section);
      sectionsContainer.append(sectionEl);
      sectionEls[index] = sectionEl;

      const tocItem = createTocEntry(section.sections || `Section ${index + 1}`, () => {
        sectionEl.scrollIntoView({ behavior: "smooth" });
      });
      tocList.append(tocItem);
    });
  };

  const fetchData = async () => {
    setStatus("Loading lecture notes...", false);
    try {
      const response = await fetch("https://dobbikov.com/lecture-notes");
      if (!response.ok) {
        throw new Error("Failed to fetch lecture notes");
      }
      const json = await response.json();
      render(Array.isArray(json) ? json : []);
      setStatus("", false);
    } catch (error) {
      setStatus("Unable to load lecture notes right now.", true);
    }
  };

  fetchData();
})();
