/**
 * MyFlix - Curated Movie & Series Catalog
 * Netflix-style dataset with rich metadata, posters, backdrops, and video sources
 */

const CATALOG_DATA = [
  // --- HERO & TRENDING ---
  {
    id: "stranger-echoes",
    title: "Stranger Echoes",
    type: "series",
    isOriginal: true,
    trendingRank: 1,
    matchScore: 98,
    releaseYear: 2024,
    maturityRating: "16+",
    seasons: "3 Seasons",
    duration: "45m per ep",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    description: "When a young boy vanishes from a tranquil coastal town, his friends uncover a web of clandestine government experiments, supernatural forces, and a mysterious girl with telekinetic powers.",
    cast: ["Millie Clarke", "David Harbour", "Winona Ryder", "Finn Wolf"],
    director: "The Brothers",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    badge: "Top 10 Today",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    episodes: [
      { ep: 1, title: "Chapter One: The Vanishing", duration: "48m", desc: "A late-night bike ride turns sinister when Will encounters an eerie presence in the woods." },
      { ep: 2, title: "Chapter Two: The Weirdo", duration: "52m", desc: "Mike hides Eleven in his basement as the search party scours the quarry." },
      { ep: 3, title: "Chapter Three: Holly, Jolly", duration: "51m", desc: "Joyce constructs a glowing communication wall, convinced her son is trying to speak." },
      { ep: 4, title: "Chapter Four: The Body", duration: "50m", desc: "Refusing to accept official reports, Hopper infiltrates the secluded lab." }
    ]
  },
  {
    id: "cyber-odyssey",
    title: "Cyber Odyssey: 2099",
    type: "movie",
    isOriginal: true,
    trendingRank: 2,
    matchScore: 96,
    releaseYear: 2024,
    maturityRating: "18+",
    seasons: null,
    duration: "2h 24m",
    genres: ["Sci-Fi", "Action", "Cyberpunk"],
    description: "In a neon-drenched megacity controlled by synthetic conglomerates, a rogue blade runner discovers a hidden truth that could collapse human civilization forever.",
    cast: ["Ryan Gosling", "Ana de Armas", "Harrison Ford"],
    director: "Denis Villeneuve",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80",
    badge: "Trending #2",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "the-crown-of-iron",
    title: "Crown of Iron & Blood",
    type: "series",
    isOriginal: true,
    trendingRank: 3,
    matchScore: 97,
    releaseYear: 2023,
    maturityRating: "18+",
    seasons: "4 Seasons",
    duration: "58m per ep",
    genres: ["Fantasy", "Drama", "Action"],
    description: "Nine noble dynasties fight for dominion over the mythical realm of Westergard, unaware of an ancient frozen terror awakening beyond the northern fortress wall.",
    cast: ["Kit Harington", "Emilia Clarke", "Peter Dinklage"],
    director: "David Benioff",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1600&q=80",
    badge: "Top 10 Today",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    episodes: [
      { ep: 1, title: "Winter Falls", duration: "61m", desc: "King Robert arrives at Winterfell with a grave request for his oldest ally." },
      { ep: 2, title: "The Kingsroad", duration: "55m", desc: "Bran struggles with his fate while Jon Snow departs to take the black." },
      { ep: 3, title: "Lord Snow", duration: "58m", desc: "At King's Landing, Ned joins the council and discovers royal debts." }
    ]
  },
  {
    id: "shadow-heist",
    title: "The Grand Shadow Heist",
    type: "movie",
    isOriginal: true,
    trendingRank: 4,
    matchScore: 94,
    releaseYear: 2024,
    maturityRating: "16+",
    seasons: null,
    duration: "2h 11m",
    genres: ["Crime", "Thriller", "Action"],
    description: "An enigmatic mastermind known as 'The Architect' recruits eight elite outlaws with code names for an audacious 11-day siege on the Royal Mint.",
    cast: ["Álvaro Morte", "Úrsula Corberó", "Pedro Alonso"],
    director: "Álex Pina",
    poster: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    badge: "Trending #4",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "interstellar-abyss",
    title: "Interstellar Abyss",
    type: "movie",
    isOriginal: false,
    trendingRank: 5,
    matchScore: 99,
    releaseYear: 2023,
    maturityRating: "13+",
    seasons: null,
    duration: "2h 49m",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    description: "As Earth becomes uninhabitable, a team of pioneering astronauts embarks on humanity's greatest voyage through a newly opened wormhole near Saturn.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    director: "Christopher Nolan",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80",
    badge: "Most Watched",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },

  // --- ACTION & THRILLERS ---
  {
    id: "neon-vendetta",
    title: "Neon Vendetta",
    type: "movie",
    isOriginal: true,
    matchScore: 92,
    releaseYear: 2024,
    maturityRating: "18+",
    seasons: null,
    duration: "1h 58m",
    genres: ["Action", "Thriller"],
    description: "A legendary retired assassin is drawn back into an underworld bounty tournament across Tokyo after an old ally turns up murdered.",
    cast: ["Keanu Reeves", "Hiroyuki Sanada", "Donnie Yen"],
    director: "Chad Stahelski",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "dark-protocol",
    title: "Dark Protocol",
    type: "series",
    isOriginal: false,
    matchScore: 91,
    releaseYear: 2023,
    maturityRating: "16+",
    seasons: "2 Seasons",
    duration: "45m per ep",
    genres: ["Action", "Crime", "Mystery"],
    description: "An elite cyber-tactical unit races against an elusive hacker syndicate attempting to shut down global energy grids.",
    cast: ["Rami Malek", "Christian Slater", "Carly Chaikin"],
    director: "Sam Esmail",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    episodes: [
      { ep: 1, title: "Hello Friend", duration: "44m", desc: "A solitary security analyst is recruited into an underground revolutionary ring." },
      { ep: 2, title: "Ones and Zeroes", duration: "47m", desc: "Elliot wrestles with the consequences of an encrypted server compromise." }
    ]
  },
  {
    id: "arctic-reckoning",
    title: "Arctic Reckoning",
    type: "movie",
    isOriginal: true,
    matchScore: 89,
    releaseYear: 2024,
    maturityRating: "16+",
    seasons: null,
    duration: "2h 05m",
    genres: ["Action", "Adventure", "Drama"],
    description: "Deep inside Greenland, a survival specialist must protect a climate whistleblower from elite mercenary squads trapped in a blizzard.",
    cast: ["Mads Mikkelsen", "Noomi Rapace"],
    director: "Joe Penna",
    poster: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },
  {
    id: "speed-syndicate",
    title: "Speed Syndicate: Tokyo Drift",
    type: "movie",
    isOriginal: false,
    matchScore: 88,
    releaseYear: 2023,
    maturityRating: "13+",
    seasons: null,
    duration: "1h 50m",
    genres: ["Action", "Crime"],
    description: "Illegal midnight street racers team up with customs detectives to dismantle an international supercar smuggling cartel.",
    cast: ["Paul Walker", "Vin Diesel", "Sung Kang"],
    director: "Justin Lin",
    poster: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },

  // --- SCI-FI & FANTASY ---
  {
    id: "solaris-chronicles",
    title: "The Solaris Chronicles",
    type: "series",
    isOriginal: true,
    matchScore: 95,
    releaseYear: 2024,
    maturityRating: "16+",
    seasons: "1 Season",
    duration: "52m per ep",
    genres: ["Sci-Fi", "Drama"],
    description: "A psychologist arrives at a research outpost orbiting a sentient oceanic planet, only to find the scientists terrorized by physical manifestations of their darkest guilt.",
    cast: ["George Clooney", "Natascha McElhone"],
    director: "Steven Soderbergh",
    poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    episodes: [
      { ep: 1, title: "The Station", duration: "54m", desc: "Kelvin arrives at Solaris to find a terrified crew and unexplained phantoms." },
      { ep: 2, title: "Visitors", duration: "50m", desc: "An impossible presence wakes Kelvin in his quarters, defying all physical laws." }
    ]
  },
  {
    id: "chronos-loop",
    title: "Chronos Paradox",
    type: "movie",
    isOriginal: true,
    matchScore: 93,
    releaseYear: 2024,
    maturityRating: "16+",
    seasons: null,
    duration: "1h 54m",
    genres: ["Sci-Fi", "Mystery"],
    description: "A quantum physicist becomes trapped inside a 12-hour temporal loop where every restart shifts the physics and allegiances of her teammates.",
    cast: ["Emily Blunt", "Tom Cruise"],
    director: "Doug Liman",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "realm-of-dragons",
    title: "Realm of Dragons: Dawn",
    type: "series",
    isOriginal: false,
    matchScore: 97,
    releaseYear: 2024,
    maturityRating: "18+",
    seasons: "2 Seasons",
    duration: "60m per ep",
    genres: ["Fantasy", "Action", "Drama"],
    description: "The dragonriders of Valyria fight an internal civil succession war that threatens to consume the empire in dragonfire.",
    cast: ["Matt Smith", "Emma D'Arcy", "Olivia Cooke"],
    director: "Miguel Sapochnik",
    poster: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    episodes: [
      { ep: 1, title: "The Heirs of the Dragon", duration: "64m", desc: "King Viserys hosts a tournament to celebrate the impending birth of his child." },
      { ep: 2, title: "The Rogue Prince", duration: "54m", desc: "Daemon occupies Dragonstone while whispers brew in the small council." }
    ]
  },

  // --- COMEDY & DRAMA ---
  {
    id: "silicon-dreams",
    title: "Silicon Dreams",
    type: "series",
    isOriginal: true,
    matchScore: 94,
    releaseYear: 2024,
    maturityRating: "16+",
    seasons: "3 Seasons",
    duration: "30m per ep",
    genres: ["Comedy", "Drama"],
    description: "Four socially awkward tech misfits build a revolutionary decentralized data compression platform while surviving cutthroat Silicon Valley venture capitalists.",
    cast: ["Thomas Middleditch", "Martin Starr", "Kumail Nanjiani"],
    director: "Mike Judge",
    poster: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    episodes: [
      { ep: 1, title: "Minimum Viable Product", duration: "29m", desc: "Richard Hendricks creates a lossless compression engine that sparks a tech bidding war." },
      { ep: 2, title: "The Cap Table", duration: "31m", desc: "The Pied Piper team seeks legal counsel to navigate corporate shark waters." }
    ]
  },
  {
    id: "the-gourmet-secret",
    title: "The Gourmet Secret",
    type: "movie",
    isOriginal: false,
    matchScore: 90,
    releaseYear: 2023,
    maturityRating: "13+",
    seasons: null,
    duration: "1h 45m",
    genres: ["Comedy", "Drama"],
    description: "A Michelin-starred chef loses his restaurant after a feud with a critic, embarking on a cross-country food truck road trip with his estranged teenage son.",
    cast: ["Jon Favreau", "Sofía Vergara", "John Leguizamo"],
    director: "Jon Favreau",
    poster: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "midnight-in-paris-tales",
    title: "Midnight Echoes",
    type: "movie",
    isOriginal: true,
    matchScore: 89,
    releaseYear: 2024,
    maturityRating: "13+",
    seasons: null,
    duration: "1h 52m",
    genres: ["Romance", "Drama", "Fantasy"],
    description: "Every midnight on the bridges of Paris, an aspiring nostalgic novelist slips into the 1920s jazz era, befriending Hemingway, Fitzgerald, and a mesmerizing muse.",
    cast: ["Owen Wilson", "Marion Cotillard", "Rachel McAdams"],
    director: "Woody Allen",
    poster: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },

  // --- HORROR & MYSTERY ---
  {
    id: "the-haunting-manor",
    title: "The Whispering Manor",
    type: "series",
    isOriginal: true,
    matchScore: 93,
    releaseYear: 2024,
    maturityRating: "18+",
    seasons: "1 Season",
    duration: "55m per ep",
    genres: ["Horror", "Mystery", "Drama"],
    description: "Decades after fleeing their haunted childhood estate, five siblings are drawn back together by an unforeseen tragedy, confronting the supernatural trauma that fractured them.",
    cast: ["Victoria Pedretti", "Oliver Jackson-Cohen", "Carla Gugino"],
    director: "Mike Flanagan",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    episodes: [
      { ep: 1, title: "Ghost Stories", duration: "59m", desc: "Steven writes bestselling books about the supernatural while remaining deeply skeptical." },
      { ep: 2, title: "Open Casket", duration: "53m", desc: "Shirley prepares for a solemn gathering while remembering her mother's final days." }
    ]
  },
  {
    id: "black-mirror-horizons",
    title: "Black Horizons",
    type: "series",
    isOriginal: true,
    matchScore: 96,
    releaseYear: 2024,
    maturityRating: "18+",
    seasons: "6 Seasons",
    duration: "60m per ep",
    genres: ["Sci-Fi", "Thriller", "Horror"],
    description: "An anthology series probing contemporary techno-paranoia, exploring twisted high-tech near-futures where mankind's greatest innovations collide with its darkest instincts.",
    cast: ["Various Ensembles"],
    director: "Charlie Brooker",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    episodes: [
      { ep: 1, title: "Joan is Awful", duration: "58m", desc: "An average woman discovers an AI global streaming platform has launched a prestige drama depicting her real life." },
      { ep: 2, title: "Loch Henry", duration: "56m", desc: "A young couple film a nature documentary in Scotland and stumble upon an unsettling local mystery." }
    ]
  },

  // --- DOCUMENTARIES & NATURE ---
  {
    id: "our-living-planet",
    title: "Our Living Planet",
    type: "series",
    isOriginal: true,
    matchScore: 99,
    releaseYear: 2024,
    maturityRating: "All",
    seasons: "2 Seasons",
    duration: "50m per ep",
    genres: ["Documentary", "Nature"],
    description: "Experience our planet's natural beauty and examine how climate change impacts all living creatures in this ambitious documentary of spectacular scope.",
    cast: ["David Attenborough"],
    director: "Alastair Fothergill",
    poster: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    episodes: [
      { ep: 1, title: "One Planet", duration: "49m", desc: "Witness the planet's breathtaking diversity from mysterious deep ocean trenches to the Serengeti." },
      { ep: 2, title: "Frozen Worlds", duration: "53m", desc: "On the icy front lines of climate change, polar bears and walruses navigate shrinking sea ice." }
    ]
  },
  {
    id: "f1-drive-to-glory",
    title: "Apex: Drive to Glory",
    type: "series",
    isOriginal: true,
    matchScore: 95,
    releaseYear: 2024,
    maturityRating: "16+",
    seasons: "5 Seasons",
    duration: "42m per ep",
    genres: ["Documentary", "Action", "Sport"],
    description: "Drivers, managers and team owners live life in the fast lane — both on and off the racetrack during each cutthroat season of Formula 1 racing.",
    cast: ["Lewis Hamilton", "Max Verstappen", "Toto Wolff"],
    director: "James Gay-Rees",
    poster: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
    backdrop: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    episodes: [
      { ep: 1, title: "All to Play For", duration: "40m", desc: "As pre-season testing kicks off in Bahrain, drivers prepare for high-stakes rivalries." },
      { ep: 2, title: "Bounce Back", duration: "44m", desc: "A struggling constructor attempts aerodynamic overhauls before the Monaco Grand Prix." }
    ]
  }
];

// Helper to retrieve by ID
function getItemById(id) {
  return CATALOG_DATA.find(item => item.id === id);
}

// Predefined rows for the Netflix layout
const ROW_CATEGORIES = [
  {
    id: "trending-now",
    title: "Trending Now",
    filter: item => item.trendingRank && item.trendingRank <= 5
  },
  {
    id: "top-10",
    title: "Top 10 in Your Country Today",
    isTop10: true,
    filter: item => !!item.trendingRank
  },
  {
    id: "myflix-originals",
    title: "Only on MyFlix (Originals)",
    filter: item => item.isOriginal === true
  },
  {
    id: "popular-series",
    title: "Binge-Worthy TV Series",
    filter: item => item.type === "series"
  },
  {
    id: "blockbuster-movies",
    title: "Blockbuster Movies",
    filter: item => item.type === "movie"
  },
  {
    id: "scifi-fantasy",
    title: "Sci-Fi & Fantasy Universes",
    filter: item => item.genres.includes("Sci-Fi") || item.genres.includes("Fantasy")
  },
  {
    id: "action-thrillers",
    title: "Action & High-Octane Thrillers",
    filter: item => item.genres.includes("Action") || item.genres.includes("Thriller")
  },
  {
    id: "award-winning",
    title: "Critically Acclaimed & Award Winning",
    filter: item => item.matchScore >= 94
  }
];
