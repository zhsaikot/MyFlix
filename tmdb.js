/**
 * MyFlix - TMDB API Service
 * Connects to The Movie Database (TMDb) for live movies, TV series, trailers, and search.
 */

const TMDB = {
  API_KEY: "f53d8b2564ddaac755854785d5122403",
  ACCESS_TOKEN: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNTNkOGIyNTY0ZGRhYWM3NTU4NTQ3ODVkNTEyMjQwMyIsIm5iZiI6MTc5MjQ5NDI3NC44OTMsInN1YiI6IjZhZDc0YWMyNWQ2M2QxMTIyYmJlZGY5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4of3Muzt3VbVzualivFUlUCX6PEEURoL0DNonViBJOI",
  BASE_URL: "https://api.themoviedb.org/3",
  IMG_BACKDROP: "https://image.tmdb.org/t/p/original",
  IMG_POSTER: "https://image.tmdb.org/t/p/w500",
  IMG_THUMB: "https://image.tmdb.org/t/p/w300",

  // Genre mapping for quick reference
  GENRES: {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
    99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
    27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
    10759: "Action & Adventure", 10762: "Kids", 10765: "Sci-Fi & Fantasy"
  },

  // Helper fetcher with auth header or api_key param
  async request(endpoint, params = {}) {
    const url = new URL(`${this.BASE_URL}${endpoint}`);
    url.searchParams.set("api_key", this.API_KEY);
    url.searchParams.set("language", "en-US");
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== null) {
        url.searchParams.set(key, val);
      }
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json"
        }
      });
      if (!response.ok) throw new Error(`TMDB HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn(`TMDB Request failed for ${endpoint}:`, err);
      return null;
    }
  },

  // Standardize TMDb item to MyFlix format
  formatItem(item, defaultType = "movie") {
    if (!item) return null;
    const type = item.media_type || defaultType;
    const title = item.title || item.name || "Untitled";
    const releaseDate = item.release_date || item.first_air_date || "";
    const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : 2024;
    
    // Resolve genre names
    let genres = [];
    if (item.genres && Array.isArray(item.genres)) {
      genres = item.genres.map(g => g.name);
    } else if (item.genre_ids && Array.isArray(item.genre_ids)) {
      genres = item.genre_ids.map(id => this.GENRES[id]).filter(Boolean);
    }
    if (genres.length === 0) genres = ["Popular"];

    const backdrop = item.backdrop_path 
      ? `${this.IMG_BACKDROP}${item.backdrop_path}` 
      : (item.poster_path ? `${this.IMG_BACKDROP}${item.poster_path}` : "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80");

    const poster = item.poster_path 
      ? `${this.IMG_POSTER}${item.poster_path}` 
      : (item.backdrop_path ? `${this.IMG_POSTER}${item.backdrop_path}` : "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80");

    const matchScore = item.vote_average 
      ? Math.min(99, Math.max(75, Math.round(item.vote_average * 10) + 5))
      : 95;

    return {
      id: `${type}-${item.id}`,
      rawId: item.id,
      title,
      type,
      isOriginal: item.origin_country?.includes("US") || false,
      releaseYear,
      maturityRating: item.adult ? "18+" : (matchScore > 90 ? "16+" : "13+"),
      seasons: type === "tv" || type === "series" ? (item.number_of_seasons ? `${item.number_of_seasons} Season${item.number_of_seasons > 1 ? 's' : ''}` : "TV Series") : null,
      duration: item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m` : (type === "movie" ? "2h 05m" : "45m per ep"),
      genres,
      description: item.overview || "An unforgettable streaming experience featuring award-winning storytelling, breathtaking cinematography, and stellar performances.",
      cast: item.credits?.cast ? item.credits.cast.slice(0, 4).map(c => c.name) : ["Top Cast"],
      director: item.credits?.crew?.find(c => c.job === "Director")?.name || (type === "tv" ? "Executive Producers" : "Director"),
      poster,
      backdrop,
      youtubeKey: this.extractYouTubeTrailer(item.videos?.results),
      trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      episodes: []
    };
  },

  extractYouTubeTrailer(videos) {
    if (!videos || !Array.isArray(videos) || videos.length === 0) return null;
    const officialTrailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official);
    if (officialTrailer) return officialTrailer.key;
    const trailer = videos.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
    if (trailer) return trailer.key;
    const anyVideo = videos.find(v => v.site === "YouTube");
    return anyVideo ? anyVideo.key : null;
  },

  // 1. Fetch Trending
  async getTrending() {
    const data = await this.request("/trending/all/day");
    if (!data?.results) return null;
    return data.results.filter(it => it.backdrop_path && it.poster_path).map(it => this.formatItem(it, it.media_type));
  },

  // 2. Fetch Top 10 Movies
  async getTop10() {
    const data = await this.request("/trending/movie/day");
    if (!data?.results) return null;
    return data.results.slice(0, 10).map((it, idx) => {
      const item = this.formatItem(it, "movie");
      item.trendingRank = idx + 1;
      item.badge = `#${idx + 1} in Movies`;
      return item;
    });
  },

  // 3. Fetch Netflix Originals
  async getNetflixOriginals() {
    const data = await this.request("/discover/tv", { with_networks: "213", sort_by: "popularity.desc" });
    if (!data?.results) return null;
    return data.results.map(it => {
      const item = this.formatItem(it, "tv");
      item.isOriginal = true;
      item.badge = "MYFLIX ORIGINAL";
      return item;
    });
  },

  // 4. Fetch Popular TV Shows
  async getPopularTV() {
    const data = await this.request("/tv/popular");
    if (!data?.results) return null;
    return data.results.map(it => this.formatItem(it, "tv"));
  },

  // 5. Fetch Popular Movies
  async getPopularMovies() {
    const data = await this.request("/movie/popular");
    if (!data?.results) return null;
    return data.results.map(it => this.formatItem(it, "movie"));
  },

  // 6. Fetch Top Rated
  async getTopRated() {
    const data = await this.request("/movie/top_rated");
    if (!data?.results) return null;
    return data.results.map(it => this.formatItem(it, "movie"));
  },

  // 7. Fetch by Genre (e.g. Action=28, Sci-Fi=878, Comedy=35, Horror=27, Documentary=99)
  async getByGenre(genreId, type = "movie") {
    const endpoint = type === "tv" ? "/discover/tv" : "/discover/movie";
    const data = await this.request(endpoint, { with_genres: genreId, sort_by: "popularity.desc" });
    if (!data?.results) return null;
    return data.results.map(it => this.formatItem(it, type));
  },

  // 8. Fetch Full Item Details (Cast, Videos, Similar)
  async getDetails(rawId, type = "movie") {
    const endpoint = `/${type === "series" ? "tv" : type}/${rawId}`;
    const data = await this.request(endpoint, { append_to_response: "videos,credits,similar" });
    if (!data) return null;

    const formatted = this.formatItem(data, type);
    formatted.cast = data.credits?.cast ? data.credits.cast.slice(0, 5).map(c => c.name) : [];
    formatted.director = data.credits?.crew?.find(c => c.job === "Director")?.name || 
                         data.credits?.crew?.find(c => c.job === "Executive Producer")?.name || 
                         "MyFlix Originals";
    formatted.youtubeKey = this.extractYouTubeTrailer(data.videos?.results);
    
    if (data.similar?.results) {
      formatted.similar = data.similar.results
        .filter(s => s.backdrop_path)
        .slice(0, 3)
        .map(s => this.formatItem(s, type));
    }

    return formatted;
  },

  // 9. Fetch TV Season Episodes
  async getSeasonEpisodes(rawTvId, seasonNumber = 1) {
    const data = await this.request(`/tv/${rawTvId}/season/${seasonNumber}`);
    if (!data?.episodes) return [];
    return data.episodes.map(ep => ({
      ep: ep.episode_number,
      title: ep.name,
      duration: ep.runtime ? `${ep.runtime}m` : "48m",
      desc: ep.overview || "A thrilling episode packed with suspense and critical developments.",
      still: ep.still_path ? `${this.IMG_THUMB}${ep.still_path}` : null
    }));
  },

  // 10. Live Multi-Search
  async search(query) {
    if (!query || query.trim().length === 0) return [];
    const data = await this.request("/search/multi", {
      query: encodeURIComponent(query.trim()),
      include_adult: false
    });
    if (!data?.results) return [];
    return data.results
      .filter(it => (it.media_type === "movie" || it.media_type === "tv") && (it.poster_path || it.backdrop_path))
      .map(it => this.formatItem(it, it.media_type));
  }
};
