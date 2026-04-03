export const CITIES = [
  { id: "c1", name: "Sarajevo", distance: "0.3 km", latitude: 43.8563, longitude: 18.4131 },
  { id: "c2", name: "Grbavica", distance: "1.4 km", latitude: 43.8486, longitude: 18.3895 },
  { id: "c3", name: "Sebilj", distance: "2.1 km", latitude: 43.8597, longitude: 18.4334 },
  { id: "c4", name: "Dobrinja", distance: "4.8 km", latitude: 43.8241, longitude: 18.3477 }
];

export const CHANNELS = [
  { id: "ch1", name: "glavna", slug: "glavna", description: "Glavni lokalni tok za sve oko tebe", color: "#7c3aed", premium: false },
  { id: "ch2", name: "desavase", slug: "desavase", description: "Desavanja uzivo u tvom kraju", color: "#4f46e5", premium: false },
  { id: "ch3", name: "ljubimci", slug: "ljubimci", description: "Ljubimci, parkovi, setnje i komsijske sapice", color: "#059669", premium: false },
  { id: "ch4", name: "politika", slug: "politika", description: "Vruce teme, lokalni pritisak i gradske price", color: "#dc2626", premium: true }
];

export const INITIAL_USER = {
  firstName: "Ensar",
  lastName: "Ensic",
  username: "ensar_ensic",
  email: "ensar@mahala.app",
  isPremium: false
};

export const INITIAL_CREDITS = {
  boosts: 3,
  colors: 1
};

export const INITIAL_POSTS = [
  {
    id: "1",
    author: "glavna",
    channel: "glavna",
    content: "Ima li ko za kasnu kafu kod Bascarsije veceras?",
    location: "Sarajevo",
    timeAgo: "2m",
    score: 12,
    commentCount: 3,
    color: "#7c3aed",
    isImage: false,
    imageUri: null,
    isAnonymous: true,
    myVote: 0,
    masked: { bearingDeg: 18, ringKm: 1 },
    replies: [
      { id: "r1", author: "ghost", content: "Mogu biti tamo za deset minuta.", timeAgo: "1m", votes: 3, isAnonymous: true },
      { id: "r2", author: "local", content: "Iza Sebilja je trenutno bas puno ljudi.", timeAgo: "30s", votes: 1, isAnonymous: true }
    ]
  },
  {
    id: "2",
    author: "ljubimci",
    channel: "ljubimci",
    content: "Nadjen bas prijateljski zlatni retriver blizu tramvajske stanice.",
    location: "Grbavica",
    timeAgo: "11m",
    score: 89,
    commentCount: 5,
    color: "#059669",
    isImage: true,
    imageUri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    isAnonymous: true,
    myVote: 0,
    masked: { bearingDeg: 126, ringKm: 2.5 },
    replies: []
  },
  {
    id: "3",
    author: "desavase",
    channel: "desavase",
    content: "Policija i hitna su upravo stigli kod starog kina. Zna li iko sta se desilo?",
    location: "Sebilj",
    timeAgo: "24m",
    score: 37,
    commentCount: 12,
    color: "#4f46e5",
    isImage: false,
    imageUri: null,
    isAnonymous: true,
    myVote: 0,
    masked: { bearingDeg: 250, ringKm: 5 },
    replies: []
  }
];

export const NOTIFICATIONS = [
  { id: "n1", title: "Stigao odgovor", body: "Neko je odgovorio na tvoju Mahala objavu.", accent: "#8b5cf6" },
  { id: "n2", title: "Boost spreman", body: "Jos uvijek imas 3 boost kredita na raspolaganju.", accent: "#10b981" },
  { id: "n3", title: "Mahala Plus", body: "Otkljucaj premium kanale i objave sa slikama.", accent: "#ef4444" }
];
