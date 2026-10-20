/**
 * MyFlix - Main Application Logic with Live TMDB API & Offline Fallback
 */

document.addEventListener("DOMContentLoaded", () => {
  // ================= STATE =================
  const STATE = {
    myList: JSON.parse(localStorage.getItem("myflix_list") || "[]"),
    savedItems: JSON.parse(localStorage.getItem("myflix_saved_items") || "{}"),
    likedList: JSON.parse(localStorage.getItem("myflix_likes") || "[]"),
    catalogItems: new Map(), // id -> item object
    rowsData: [],
    currentBillboard: null,
    activeTab: "home",
    selectedGenre: "all",
    searchQuery: "",
    searchDebounce: null,
    activeModalItem: null,
    isPlaying: false,
    hudTimeout: null,
    audioMuted: true
  };

  // Seed local CATALOG_DATA into cache
  CATALOG_DATA.forEach(item => STATE.catalogItems.set(item.id, item));

  // ================= DOM ELEMENTS =================
  const el = {
    navbar: document.getElementById("navbar"),
    navLinks: document.querySelectorAll(".nav-link"),
    mobileLinks: document.querySelectorAll(".mobile-link"),
    navListCount: document.getElementById("nav-list-count"),
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    closeDrawerBtn: document.getElementById("close-drawer-btn"),
    mobileDrawer: document.getElementById("mobile-drawer"),

    // Search
    searchBox: document.getElementById("search-box"),
    searchTrigger: document.getElementById("search-trigger"),
    searchInput: document.getElementById("search-input"),
    clearSearchBtn: document.getElementById("clear-search"),
    searchResultsSection: document.getElementById("search-results-section"),
    searchQueryText: document.getElementById("search-query-text"),
    resultsCount: document.getElementById("results-count"),
    searchGrid: document.getElementById("search-grid"),

    // Notifications & Profile
    notifBtn: document.getElementById("notif-btn"),
    notifDropdown: document.getElementById("notif-dropdown"),
    profileBtn: document.getElementById("profile-btn"),
    profileDropdown: document.getElementById("profile-dropdown"),
    logoutBtn: document.getElementById("logout-btn"),

    // Billboard
    billboard: document.getElementById("billboard"),
    billboardBackdrop: document.getElementById("billboard-backdrop"),
    billboardTitle: document.getElementById("billboard-title"),
    billboardDesc: document.getElementById("billboard-desc"),
    billboardMatch: document.getElementById("billboard-match"),
    billboardRating: document.getElementById("billboard-rating"),
    billboardDuration: document.getElementById("billboard-duration"),
    billboardRibbonRating: document.getElementById("billboard-ribbon-rating"),
    billboardPlayBtn: document.getElementById("billboard-play-btn"),
    billboardInfoBtn: document.getElementById("billboard-info-btn"),
    billboardMyListBtn: document.getElementById("billboard-mylist-btn"),
    audioToggleBtn: document.getElementById("audio-toggle-btn"),
    audioToggleIcon: document.getElementById("audio-toggle-icon"),

    // Genre Bar
    genreFilterBar: document.getElementById("genre-filter-bar"),
    categoryHeading: document.getElementById("category-heading"),
    genreSelect: document.getElementById("genre-select"),

    // Rows
    catalogRows: document.getElementById("catalog-rows"),
    dynamicMyListRow: document.getElementById("dynamic-mylist-row"),
    categoryRowsContainer: document.getElementById("category-rows-container"),

    // Modal
    modalOverlay: document.getElementById("detail-modal-overlay"),
    modalCloseBtn: document.getElementById("modal-close-btn"),
    modalHeroBg: document.getElementById("modal-hero-bg"),
    modalTitle: document.getElementById("modal-title"),
    modalPlayBtn: document.getElementById("modal-play-btn"),
    modalMyListBtn: document.getElementById("modal-mylist-btn"),
    modalLikeBtn: document.getElementById("modal-like-btn"),
    modalShareBtn: document.getElementById("modal-share-btn"),
    modalMatch: document.getElementById("modal-match"),
    modalYear: document.getElementById("modal-year"),
    modalRating: document.getElementById("modal-rating"),
    modalDuration: document.getElementById("modal-duration"),
    modalSynopsis: document.getElementById("modal-synopsis"),
    modalCast: document.getElementById("modal-cast"),
    modalGenres: document.getElementById("modal-genres"),
    modalDirector: document.getElementById("modal-director"),
    modalEpisodesSection: document.getElementById("modal-episodes-section"),
    modalEpisodesList: document.getElementById("modal-episodes-list"),
    modalSimilarGrid: document.getElementById("modal-similar-grid"),

    // Video Player
    playerOverlay: document.getElementById("video-player-overlay"),
    video: document.getElementById("html5-video"),
    youtubeVideo: document.getElementById("youtube-video"),
    playerHud: document.getElementById("player-hud"),
    playerBottomBar: document.querySelector(".player-bottom-bar"),
    playerBackBtn: document.getElementById("player-back-btn"),
    playerTitle: document.getElementById("player-title"),
    playerSubtitle: document.getElementById("player-subtitle"),
    playerPlayPause: document.getElementById("player-play-pause"),
    playPauseIcon: document.getElementById("play-pause-icon"),
    playerRewind: document.getElementById("player-rewind"),
    playerForward: document.getElementById("player-forward"),
    playerVolumeBtn: document.getElementById("player-volume-btn"),
    volumeIcon: document.getElementById("volume-icon"),
    volumeSlider: document.getElementById("volume-slider"),
    timeCurrent: document.getElementById("time-current"),
    timeTotal: document.getElementById("time-total"),
    scrubberContainer: document.getElementById("scrubber-container"),
    scrubberProgress: document.getElementById("scrubber-progress"),
    scrubberBuffer: document.getElementById("scrubber-buffer"),
    scrubberHandle: document.getElementById("scrubber-handle"),
    scrubberTimePreview: document.getElementById("scrubber-time-preview"),
    playerSpeed: document.getElementById("player-speed"),
    speedLabel: document.getElementById("speed-label"),
    playerFullscreen: document.getElementById("player-fullscreen"),
    fullscreenIcon: document.getElementById("fullscreen-icon"),

    // Toast
    toastContainer: document.getElementById("toast-container")
  };

  // Helper to fetch item by ID
  function getItem(id) {
    if (STATE.catalogItems.has(id)) return STATE.catalogItems.get(id);
    if (STATE.savedItems[id]) return STATE.savedItems[id];
    return getItemById(id);
  }

  // ================= TOAST NOTIFICATION =================
  function showToast(message, icon = "fa-check") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  // ================= STORAGE HELPERS =================
  function saveMyList() {
    localStorage.setItem("myflix_list", JSON.stringify(STATE.myList));
    localStorage.setItem("myflix_saved_items", JSON.stringify(STATE.savedItems));
    updateMyListCount();
    renderMyListRow();
  }

  function toggleMyList(item) {
    if (!item) return;
    const id = item.id;
    const idx = STATE.myList.indexOf(id);

    if (idx > -1) {
      STATE.myList.splice(idx, 1);
      delete STATE.savedItems[id];
      showToast(`Removed "${item.title}" from My List`, "fa-trash-can");
    } else {
      STATE.myList.push(id);
      STATE.savedItems[id] = item;
      showToast(`Added "${item.title}" to My List`, "fa-bookmark");
    }
    saveMyList();
    updateButtonStates();
  }

  function toggleLike(id) {
    const idx = STATE.likedList.indexOf(id);
    if (idx > -1) {
      STATE.likedList.splice(idx, 1);
      showToast("Rating removed", "fa-thumbs-down");
    } else {
      STATE.likedList.push(id);
      showToast("Marked as liked!", "fa-thumbs-up");
    }
    localStorage.setItem("myflix_likes", JSON.stringify(STATE.likedList));
    updateButtonStates();
  }

  function updateMyListCount() {
    const count = STATE.myList.length;
    if (count > 0) {
      el.navListCount.style.display = "inline-block";
      el.navListCount.textContent = count;
    } else {
      el.navListCount.style.display = "none";
    }
  }

  function updateButtonStates() {
    if (STATE.activeModalItem) {
      const isSaved = STATE.myList.includes(STATE.activeModalItem.id);
      const isLiked = STATE.likedList.includes(STATE.activeModalItem.id);

      el.modalMyListBtn.classList.toggle("active", isSaved);
      el.modalMyListBtn.innerHTML = isSaved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-plus"></i>';

      el.modalLikeBtn.classList.toggle("active", isLiked);
      el.modalLikeBtn.innerHTML = isLiked ? '<i class="fa-solid fa-thumbs-up"></i>' : '<i class="fa-regular fa-thumbs-up"></i>';
    }

    if (STATE.currentBillboard) {
      const isSaved = STATE.myList.includes(STATE.currentBillboard.id);
      el.billboardMyListBtn.classList.toggle("active", isSaved);
      el.billboardMyListBtn.innerHTML = isSaved ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-plus"></i>';
    }
  }

  // ================= BILLBOARD HERO =================
  function renderBillboard(item) {
    if (!item) return;
    STATE.currentBillboard = item;
    el.billboardBackdrop.style.backgroundImage = `url('${item.backdrop}')`;
    el.billboardTitle.textContent = item.title;
    el.billboardDesc.textContent = item.description;
    el.billboardMatch.textContent = `${item.matchScore}% Match`;
    el.billboardRating.textContent = item.maturityRating;
    el.billboardRibbonRating.textContent = item.maturityRating;
    el.billboardDuration.textContent = item.type === "tv" || item.type === "series" ? (item.seasons || "TV Series") : item.duration;

    updateButtonStates();
  }

  // ================= MOVIE CARD FACTORIES =================
  function createMovieCard(item) {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.setAttribute("data-id", item.id);

    const isInList = STATE.myList.includes(item.id);

    card.innerHTML = `
      <div class="card-poster-wrapper">
        <img class="card-poster" src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'">
        ${item.badge ? `<span class="card-top-badge">${item.badge}</span>` : ""}
      </div>
      <div class="card-hover-info">
        <div class="card-actions-row">
          <div class="actions-left">
            <button class="card-btn-mini play-mini" title="Play"><i class="fa-solid fa-play"></i></button>
            <button class="card-btn-mini list-mini ${isInList ? 'active' : ''}" title="My List">
              <i class="fa-solid ${isInList ? 'fa-check' : 'fa-plus'}"></i>
            </button>
            <button class="card-btn-mini like-mini" title="Like"><i class="fa-regular fa-thumbs-up"></i></button>
          </div>
          <button class="card-btn-mini info-mini" title="More Info"><i class="fa-solid fa-chevron-down"></i></button>
        </div>
        <div class="card-title-text">${item.title}</div>
        <div class="card-meta-line">
          <span class="match-score">${item.matchScore}%</span>
          <span class="meta-tag">${item.maturityRating}</span>
          <span>${item.releaseYear}</span>
        </div>
        <div class="card-genres-line">${item.genres.join(" • ")}</div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      const playBtn = e.target.closest(".play-mini");
      const listBtn = e.target.closest(".list-mini");
      const likeBtn = e.target.closest(".like-mini");

      if (playBtn) {
        e.stopPropagation();
        openVideoPlayer(item);
      } else if (listBtn) {
        e.stopPropagation();
        toggleMyList(item);
        const active = STATE.myList.includes(item.id);
        listBtn.classList.toggle("active", active);
        listBtn.innerHTML = `<i class="fa-solid ${active ? 'fa-check' : 'fa-plus'}"></i>`;
      } else if (likeBtn) {
        e.stopPropagation();
        toggleLike(item.id);
      } else {
        openDetailModal(item);
      }
    });

    return card;
  }

  function createTop10Card(item, rank) {
    const card = document.createElement("div");
    card.className = "top10-card";
    card.setAttribute("data-id", item.id);

    const rankSvg = `
      <svg class="top10-rank-svg" viewBox="0 0 100 150">
        <text x="50%" y="80%" text-anchor="middle" dominant-baseline="middle">${rank}</text>
      </svg>
    `;

    card.innerHTML = `
      ${rankSvg}
      <div class="top10-poster-wrapper">
        <img class="top10-poster" src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'">
      </div>
    `;

    card.addEventListener("click", () => openDetailModal(item));
    return card;
  }

  // ================= ROW RENDERING =================
  function renderRow(rowCategory) {
    let items = rowCategory.items || [];

    if (STATE.selectedGenre !== "all") {
      items = items.filter(it => it.genres.includes(STATE.selectedGenre));
    }

    if (items.length === 0) return null;

    const rowWrapper = document.createElement("div");
    rowWrapper.className = "row-wrapper";

    rowWrapper.innerHTML = `
      <div class="row-header">
        <h3 class="row-title">${rowCategory.title}</h3>
        <a href="#" class="see-all-link">Explore all <i class="fa-solid fa-chevron-right"></i></a>
      </div>
      <div class="carousel-container">
        <button class="slider-arrow left" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
        <div class="cards-slider"></div>
        <button class="slider-arrow right" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    `;

    const slider = rowWrapper.querySelector(".cards-slider");

    if (rowCategory.isTop10) {
      items.slice(0, 10).forEach((item, index) => {
        slider.appendChild(createTop10Card(item, index + 1));
      });
    } else {
      items.forEach(item => {
        slider.appendChild(createMovieCard(item));
      });
    }

    const leftArrow = rowWrapper.querySelector(".slider-arrow.left");
    const rightArrow = rowWrapper.querySelector(".slider-arrow.right");

    leftArrow.addEventListener("click", () => {
      slider.scrollBy({ left: -slider.clientWidth * 0.75, behavior: "smooth" });
    });
    rightArrow.addEventListener("click", () => {
      slider.scrollBy({ left: slider.clientWidth * 0.75, behavior: "smooth" });
    });

    return rowWrapper;
  }

  function renderMyListRow() {
    el.dynamicMyListRow.innerHTML = "";
    if (STATE.myList.length === 0) return;

    const listItems = STATE.myList
      .map(id => getItem(id))
      .filter(Boolean);

    if (listItems.length === 0) return;

    const rowWrapper = document.createElement("div");
    rowWrapper.className = "row-wrapper";
    rowWrapper.innerHTML = `
      <div class="row-header">
        <h3 class="row-title">My List</h3>
      </div>
      <div class="carousel-container">
        <button class="slider-arrow left" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
        <div class="cards-slider"></div>
        <button class="slider-arrow right" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    `;

    const slider = rowWrapper.querySelector(".cards-slider");
    listItems.forEach(item => slider.appendChild(createMovieCard(item)));

    const leftArrow = rowWrapper.querySelector(".slider-arrow.left");
    const rightArrow = rowWrapper.querySelector(".slider-arrow.right");
    leftArrow.addEventListener("click", () => slider.scrollBy({ left: -slider.clientWidth * 0.75, behavior: "smooth" }));
    rightArrow.addEventListener("click", () => slider.scrollBy({ left: slider.clientWidth * 0.75, behavior: "smooth" }));

    el.dynamicMyListRow.appendChild(rowWrapper);
  }

  function renderAllRows() {
    el.categoryRowsContainer.innerHTML = "";
    renderMyListRow();

    STATE.rowsData.forEach(category => {
      if (STATE.activeTab === "series" && category.type === "movie") return;
      if (STATE.activeTab === "movies" && category.type === "tv") return;

      const rowEl = renderRow(category);
      if (rowEl) {
        el.categoryRowsContainer.appendChild(rowEl);
      }
    });
  }

  // ================= TMDB ASYNC DATA LOADING =================
  async function loadTmdbCatalog() {
    try {
      // First, render local fallback so the page isn't empty
      STATE.rowsData = ROW_CATEGORIES.map(rc => ({
        id: rc.id,
        title: rc.title,
        isTop10: rc.isTop10,
        type: rc.id.includes("series") ? "tv" : (rc.id.includes("movie") ? "movie" : "all"),
        items: CATALOG_DATA.filter(rc.filter)
      }));
      renderBillboard(CATALOG_DATA[0]);
      renderAllRows();

      // Fetch live data from TMDB in parallel
      const [trending, top10, originals, popularTv, popularMovies, topRated, action, scifi, comedy] = await Promise.all([
        TMDB.getTrending(),
        TMDB.getTop10(),
        TMDB.getNetflixOriginals(),
        TMDB.getPopularTV(),
        TMDB.getPopularMovies(),
        TMDB.getTopRated(),
        TMDB.getByGenre(28, "movie"),
        TMDB.getByGenre(878, "movie"),
        TMDB.getByGenre(35, "movie")
      ]);

      if (trending && trending.length > 0) {
        // Cache all items in memory
        const allItems = [...trending, ...(top10 || []), ...(originals || []), ...(popularTv || []), ...(popularMovies || []), ...(topRated || []), ...(action || []), ...(scifi || []), ...(comedy || [])];
        allItems.forEach(item => STATE.catalogItems.set(item.id, item));

        // Update Billboard with top trending item with high-res backdrop
        const billboardHero = trending.find(it => it.backdrop && it.description.length > 50) || trending[0];
        renderBillboard(billboardHero);

        // Populate live rows
        STATE.rowsData = [
          { id: "trending-now", title: "Trending Now", type: "all", items: trending },
          { id: "top-10", title: "Top 10 Today", isTop10: true, type: "all", items: top10 || trending.slice(0, 10) },
          { id: "originals", title: "Only on MyFlix (Originals)", type: "tv", items: originals || popularTv },
          { id: "popular-tv", title: "Binge-Worthy TV Series", type: "tv", items: popularTv },
          { id: "blockbusters", title: "Blockbuster Movies", type: "movie", items: popularMovies },
          { id: "top-rated", title: "Critically Acclaimed", type: "movie", items: topRated },
          { id: "action", title: "Action & High-Octane Thrillers", type: "movie", items: action },
          { id: "scifi", title: "Sci-Fi & Fantasy Universes", type: "movie", items: scifi },
          { id: "comedy", title: "Comedy Hits", type: "movie", items: comedy }
        ];

        renderAllRows();
        console.log("TMDB Live Data Loaded Successfully!");
      }
    } catch (err) {
      console.warn("Using offline catalog fallback:", err);
    }
  }

  // ================= TAB NAVIGATION =================
  function switchTab(tab) {
    STATE.activeTab = tab;
    el.navLinks.forEach(link => link.classList.toggle("active", link.dataset.tab === tab));
    el.mobileLinks.forEach(link => link.classList.toggle("active", link.dataset.tab === tab));

    if (STATE.searchQuery) clearSearch();

    if (tab === "home") {
      el.billboard.style.display = "flex";
      el.genreFilterBar.style.display = "none";
      el.catalogRows.style.display = "flex";
      renderAllRows();
    } else if (tab === "series") {
      el.billboard.style.display = "flex";
      el.genreFilterBar.style.display = "block";
      el.categoryHeading.textContent = "TV Shows";
      el.catalogRows.style.display = "flex";
      const topSeries = Array.from(STATE.catalogItems.values()).find(it => it.type === "tv" || it.type === "series");
      if (topSeries) renderBillboard(topSeries);
      renderAllRows();
    } else if (tab === "movies") {
      el.billboard.style.display = "flex";
      el.genreFilterBar.style.display = "block";
      el.categoryHeading.textContent = "Movies";
      el.catalogRows.style.display = "flex";
      const topMovie = Array.from(STATE.catalogItems.values()).find(it => it.type === "movie");
      if (topMovie) renderBillboard(topMovie);
      renderAllRows();
    } else if (tab === "popular") {
      el.billboard.style.display = "none";
      el.genreFilterBar.style.display = "block";
      el.categoryHeading.textContent = "New & Popular";
      el.catalogRows.style.display = "flex";
      renderAllRows();
    } else if (tab === "mylist") {
      el.billboard.style.display = "none";
      el.genreFilterBar.style.display = "block";
      el.categoryHeading.textContent = "My Watchlist";
      renderMyListOnlyView();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderMyListOnlyView() {
    el.catalogRows.style.display = "none";
    el.searchResultsSection.style.display = "block";
    el.searchQueryText.textContent = `"My List"`;

    const items = STATE.myList.map(id => getItem(id)).filter(Boolean);
    el.resultsCount.textContent = `${items.length} titles saved`;
    el.searchGrid.innerHTML = "";

    if (items.length === 0) {
      el.searchGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #777;">
          <i class="fa-regular fa-bookmark" style="font-size: 3rem; margin-bottom: 14px; display: block;"></i>
          <h3>You haven't added any titles to your list yet.</h3>
          <p style="margin-top: 8px;">Explore movies and TV shows and click the '+' icon to save them here.</p>
        </div>
      `;
      return;
    }

    items.forEach(item => el.searchGrid.appendChild(createGridCard(item)));
  }

  // ================= SEARCH LOGIC =================
  async function handleSearch(query) {
    STATE.searchQuery = query.trim();

    if (!STATE.searchQuery) {
      clearSearch();
      return;
    }

    el.clearSearchBtn.style.display = "block";
    el.billboard.style.display = "none";
    el.genreFilterBar.style.display = "none";
    el.catalogRows.style.display = "none";
    el.searchResultsSection.style.display = "block";
    el.searchQueryText.textContent = `"${STATE.searchQuery}"`;

    if (STATE.searchDebounce) clearTimeout(STATE.searchDebounce);
    STATE.searchDebounce = setTimeout(async () => {
      let results = [];
      try {
        results = await TMDB.search(STATE.searchQuery);
      } catch (e) {
        console.warn("Live search fallback", e);
      }

      // If TMDB returns empty, fallback to local search
      if (!results || results.length === 0) {
        const q = STATE.searchQuery.toLowerCase();
        results = Array.from(STATE.catalogItems.values()).filter(it => 
          it.title.toLowerCase().includes(q) || it.genres.some(g => g.toLowerCase().includes(q))
        );
      }

      results.forEach(it => STATE.catalogItems.set(it.id, it));
      el.resultsCount.textContent = `${results.length} titles found`;
      el.searchGrid.innerHTML = "";

      if (results.length === 0) {
        el.searchGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #777;">
            <i class="fa-solid fa-film" style="font-size: 3rem; margin-bottom: 14px; display: block;"></i>
            <h3>No matches found for "${STATE.searchQuery}"</h3>
            <p style="margin-top: 8px;">Try searching for a different movie, TV series, or genre.</p>
          </div>
        `;
        return;
      }

      results.forEach(item => el.searchGrid.appendChild(createGridCard(item)));
    }, 280);
  }

  function createGridCard(item) {
    const card = document.createElement("div");
    card.className = "grid-card";
    card.innerHTML = `
      <img src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'">
      <div class="grid-card-info">
        <div class="grid-card-title">${item.title}</div>
        <div class="grid-card-meta">
          <span class="match-score">${item.matchScore}% Match</span>
          <span>${item.releaseYear}</span>
          <span class="meta-tag">${item.maturityRating}</span>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openDetailModal(item));
    return card;
  }

  function clearSearch() {
    STATE.searchQuery = "";
    el.searchInput.value = "";
    el.clearSearchBtn.style.display = "none";
    el.searchResultsSection.style.display = "none";
    switchTab(STATE.activeTab);
  }

  // ================= DETAIL MODAL =================
  async function openDetailModal(item) {
    STATE.activeModalItem = item;

    el.modalHeroBg.style.backgroundImage = `url('${item.backdrop}')`;
    el.modalTitle.textContent = item.title;
    el.modalMatch.textContent = `${item.matchScore}% Match`;
    el.modalYear.textContent = item.releaseYear;
    el.modalRating.textContent = item.maturityRating;
    el.modalDuration.textContent = item.type === "tv" || item.type === "series" ? (item.seasons || "TV Series") : item.duration;
    el.modalSynopsis.textContent = item.description;

    el.modalCast.textContent = item.cast ? item.cast.join(", ") : "Loading cast...";
    el.modalGenres.textContent = item.genres.join(", ");
    el.modalDirector.textContent = item.director || "MyFlix Studios";

    updateButtonStates();
    el.modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Asynchronously fetch deep details (YouTube trailer, cast, episodes, similar) from TMDB
    if (item.rawId) {
      try {
        const deep = await TMDB.getDetails(item.rawId, item.type);
        if (deep) {
          item.youtubeKey = deep.youtubeKey;
          item.cast = deep.cast;
          item.director = deep.director;
          if (deep.similar) item.similar = deep.similar;

          el.modalCast.textContent = deep.cast.length > 0 ? deep.cast.join(", ") : "Top Cast";
          el.modalDirector.textContent = deep.director;

          // Render Similar
          if (deep.similar && deep.similar.length > 0) {
            renderSimilarSection(deep.similar);
          }
        }

        // If series, fetch episodes
        if (item.type === "tv" || item.type === "series") {
          const episodes = await TMDB.getSeasonEpisodes(item.rawId, 1);
          if (episodes && episodes.length > 0) {
            item.episodes = episodes;
            renderEpisodesSection(episodes, item);
          } else {
            el.modalEpisodesSection.style.display = "none";
          }
        } else {
          el.modalEpisodesSection.style.display = "none";
        }
      } catch (err) {
        console.warn("Could not fetch deep details", err);
      }
    } else {
      // Local fallback for episodes
      if (item.episodes && item.episodes.length > 0) {
        renderEpisodesSection(item.episodes, item);
      } else {
        el.modalEpisodesSection.style.display = "none";
      }
    }
  }

  function renderEpisodesSection(episodes, parentItem) {
    el.modalEpisodesSection.style.display = "block";
    el.modalEpisodesList.innerHTML = "";
    episodes.forEach(ep => {
      const epEl = document.createElement("div");
      epEl.className = "episode-item";
      epEl.innerHTML = `
        <div class="ep-number">${ep.ep}</div>
        <div class="ep-thumb-wrapper">
          <img class="ep-thumb" src="${ep.still || parentItem.backdrop}" alt="${ep.title}">
          <div class="ep-play-overlay"><i class="fa-solid fa-play"></i></div>
        </div>
        <div class="ep-info">
          <div class="ep-title-row">
            <span class="ep-title">${ep.title}</span>
            <span class="ep-duration">${ep.duration}</span>
          </div>
          <p class="ep-desc">${ep.desc}</p>
        </div>
      `;
      epEl.addEventListener("click", () => {
        closeDetailModal();
        openVideoPlayer(parentItem, `Episode ${ep.ep}: ${ep.title}`);
      });
      el.modalEpisodesList.appendChild(epEl);
    });
  }

  function renderSimilarSection(similarList) {
    el.modalSimilarGrid.innerHTML = "";
    similarList.forEach(simItem => {
      STATE.catalogItems.set(simItem.id, simItem);
      const simCard = document.createElement("div");
      simCard.className = "similar-card";
      simCard.innerHTML = `
        <img class="similar-card-img" src="${simItem.backdrop}" alt="${simItem.title}" loading="lazy">
        <div class="similar-card-body">
          <div class="similar-card-meta">
            <span class="match-score">${simItem.matchScore}%</span>
            <span class="meta-tag">${simItem.maturityRating}</span>
            <span>${simItem.releaseYear}</span>
          </div>
          <p class="similar-card-desc">${simItem.description}</p>
        </div>
      `;
      simCard.addEventListener("click", () => openDetailModal(simItem));
      el.modalSimilarGrid.appendChild(simCard);
    });
  }

  function closeDetailModal() {
    el.modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    STATE.activeModalItem = null;
  }

  // ================= FULLSCREEN VIDEO PLAYER =================
  function openVideoPlayer(item, customSubtitle = null) {
    if (!item) return;
    STATE.currentVideoItem = item;
    el.playerTitle.textContent = item.title;
    el.playerSubtitle.textContent = customSubtitle || (item.type === "tv" || item.type === "series" ? "Official Trailer • TV Series" : "Official Trailer • Feature Film");

    el.playerOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // If official YouTube trailer is available, play in YouTube player
    if (item.youtubeKey) {
      el.html5Video = el.video;
      el.html5Video.pause();
      el.html5Video.style.display = "none";
      el.playerBottomBar.style.display = "none"; // YouTube handles playback bar

      el.youtubeVideo.style.display = "block";
      el.youtubeVideo.src = `https://www.youtube.com/embed/${item.youtubeKey}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`;
      STATE.isPlaying = true;
    } else {
      // Fallback HTML5 sample video player
      el.youtubeVideo.style.display = "none";
      el.youtubeVideo.src = "";
      el.video.style.display = "block";
      el.playerBottomBar.style.display = "flex";

      el.video.src = item.trailer || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
      el.video.play().then(() => {
        STATE.isPlaying = true;
        el.playPauseIcon.className = "fa-solid fa-pause";
      }).catch(e => console.warn("Autoplay notice:", e));
    }

    resetHudTimer();
  }

  function closeVideoPlayer() {
    el.youtubeVideo.src = "";
    el.youtubeVideo.style.display = "none";
    el.video.pause();
    el.video.currentTime = 0;
    el.playerOverlay.classList.remove("active");
    document.body.style.overflow = "";
    STATE.isPlaying = false;
    if (STATE.hudTimeout) clearTimeout(STATE.hudTimeout);
  }

  function togglePlayPause() {
    if (el.video.style.display === "none") return;
    if (el.video.paused) {
      el.video.play();
      STATE.isPlaying = true;
      el.playPauseIcon.className = "fa-solid fa-pause";
    } else {
      el.video.pause();
      STATE.isPlaying = false;
      el.playPauseIcon.className = "fa-solid fa-play";
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function resetHudTimer() {
    el.playerHud.classList.remove("idle");
    if (STATE.hudTimeout) clearTimeout(STATE.hudTimeout);
    STATE.hudTimeout = setTimeout(() => {
      if (STATE.isPlaying) el.playerHud.classList.add("idle");
    }, 3000);
  }

  // ================= EVENT LISTENERS =================
  function bindEvents() {
    // Navbar scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) el.navbar.classList.add("scrolled");
      else el.navbar.classList.remove("scrolled");
    });

    // Nav link tabs
    el.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab(link.dataset.tab);
      });
    });

    el.mobileLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        el.mobileDrawer.classList.remove("open");
        switchTab(link.dataset.tab);
      });
    });

    // Drawer
    el.mobileMenuBtn.addEventListener("click", () => el.mobileDrawer.classList.add("open"));
    el.closeDrawerBtn.addEventListener("click", () => el.mobileDrawer.classList.remove("open"));

    // Brand logo
    document.getElementById("brand-logo").addEventListener("click", (e) => {
      e.preventDefault();
      switchTab("home");
    });

    // Search
    el.searchTrigger.addEventListener("click", () => {
      el.searchBox.classList.toggle("active");
      if (el.searchBox.classList.contains("active")) {
        el.searchInput.focus();
      } else {
        clearSearch();
      }
    });

    el.searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
    el.clearSearchBtn.addEventListener("click", clearSearch);

    // Dropdowns
    el.notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      el.notifDropdown.classList.toggle("show");
      el.profileDropdown.classList.remove("show");
    });

    el.profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      el.profileDropdown.classList.toggle("show");
      el.notifDropdown.classList.remove("show");
    });

    document.addEventListener("click", () => {
      el.notifDropdown.classList.remove("show");
      el.profileDropdown.classList.remove("show");
    });

    el.logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Signed out. See you soon!", "fa-right-from-bracket");
    });

    // Genre selection
    el.genreSelect.addEventListener("change", (e) => {
      STATE.selectedGenre = e.target.value;
      renderAllRows();
    });

    // Billboard Actions
    el.billboardPlayBtn.addEventListener("click", () => openVideoPlayer(STATE.currentBillboard));
    el.billboardInfoBtn.addEventListener("click", () => openDetailModal(STATE.currentBillboard));
    el.billboardMyListBtn.addEventListener("click", () => toggleMyList(STATE.currentBillboard));

    el.audioToggleBtn.addEventListener("click", () => {
      STATE.audioMuted = !STATE.audioMuted;
      el.audioToggleIcon.className = STATE.audioMuted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
      showToast(STATE.audioMuted ? "Audio muted" : "Audio unmuted", "fa-volume-high");
    });

    // Modal Actions
    el.modalCloseBtn.addEventListener("click", closeDetailModal);
    el.modalOverlay.addEventListener("click", (e) => {
      if (e.target === el.modalOverlay) closeDetailModal();
    });
    el.modalPlayBtn.addEventListener("click", () => {
      const item = STATE.activeModalItem;
      closeDetailModal();
      openVideoPlayer(item);
    });
    el.modalMyListBtn.addEventListener("click", () => {
      if (STATE.activeModalItem) toggleMyList(STATE.activeModalItem);
    });
    el.modalLikeBtn.addEventListener("click", () => {
      if (STATE.activeModalItem) toggleLike(STATE.activeModalItem.id);
    });
    el.modalShareBtn.addEventListener("click", () => {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Share link copied to clipboard!", "fa-copy");
    });

    // Video Player Events
    el.playerBackBtn.addEventListener("click", closeVideoPlayer);
    el.playerPlayPause.addEventListener("click", togglePlayPause);
    el.playerOverlay.addEventListener("mousemove", resetHudTimer);

    el.playerRewind.addEventListener("click", () => {
      el.video.currentTime = Math.max(0, el.video.currentTime - 10);
      showToast("Rewound 10 seconds", "fa-rotate-left");
    });

    el.playerForward.addEventListener("click", () => {
      el.video.currentTime = Math.min(el.video.duration, el.video.currentTime + 10);
      showToast("Forward 10 seconds", "fa-rotate-right");
    });

    el.video.addEventListener("timeupdate", () => {
      const cur = el.video.currentTime;
      const dur = el.video.duration || 1;
      const pct = (cur / dur) * 100;
      el.scrubberProgress.style.width = `${pct}%`;
      el.scrubberHandle.style.left = `${pct}%`;
      el.timeCurrent.textContent = formatTime(cur);
      el.timeTotal.textContent = formatTime(dur);
    });

    el.video.addEventListener("progress", () => {
      if (el.video.buffered.length > 0) {
        const bufferedEnd = el.video.buffered.end(el.video.buffered.length - 1);
        const dur = el.video.duration || 1;
        el.scrubberBuffer.style.width = `${(bufferedEnd / dur) * 100}%`;
      }
    });

    el.video.addEventListener("ended", () => {
      STATE.isPlaying = false;
      el.playPauseIcon.className = "fa-solid fa-rotate-right";
    });

    el.scrubberContainer.addEventListener("click", (e) => {
      const rect = el.scrubberContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      el.video.currentTime = pos * el.video.duration;
    });

    el.volumeSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      el.video.volume = val;
      el.video.muted = val === 0;
      if (val === 0) el.volumeIcon.className = "fa-solid fa-volume-xmark";
      else if (val < 0.5) el.volumeIcon.className = "fa-solid fa-volume-low";
      else el.volumeIcon.className = "fa-solid fa-volume-high";
    });

    el.playerVolumeBtn.addEventListener("click", () => {
      el.video.muted = !el.video.muted;
      if (el.video.muted) {
        el.volumeIcon.className = "fa-solid fa-volume-xmark";
        el.volumeSlider.value = 0;
      } else {
        el.video.volume = 1;
        el.volumeSlider.value = 1;
        el.volumeIcon.className = "fa-solid fa-volume-high";
      }
    });

    const speeds = [1, 1.25, 1.5, 2, 0.75];
    let speedIdx = 0;
    el.playerSpeed.addEventListener("click", () => {
      speedIdx = (speedIdx + 1) % speeds.length;
      el.video.playbackRate = speeds[speedIdx];
      el.speedLabel.textContent = `${speeds[speedIdx]}x`;
      showToast(`Playback speed: ${speeds[speedIdx]}x`, "fa-gauge");
    });

    el.playerFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        el.playerOverlay.requestFullscreen().catch(err => console.log(err));
        el.fullscreenIcon.className = "fa-solid fa-compress";
      } else {
        document.exitFullscreen().catch(err => console.log(err));
        el.fullscreenIcon.className = "fa-solid fa-expand";
      }
    });

    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
      if (document.activeElement === el.searchInput) {
        if (e.key === "Escape") clearSearch();
        return;
      }

      if (el.playerOverlay.classList.contains("active")) {
        if (e.key === "Escape") {
          closeVideoPlayer();
        } else if (e.code === "Space" || e.key === "k") {
          e.preventDefault();
          togglePlayPause();
        } else if (e.key === "m" || e.key === "M") {
          el.playerVolumeBtn.click();
        }
      } else if (el.modalOverlay.classList.contains("active")) {
        if (e.key === "Escape") closeDetailModal();
      }
    });
  }

  // ================= START APP =================
  updateMyListCount();
  bindEvents();
  loadTmdbCatalog();
});
