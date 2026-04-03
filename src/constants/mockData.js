export const CITIES = [
  { id: "c1", name: "Sarajevo", distance: "0.3 km", latitude: 43.8563, longitude: 18.4131 },
  { id: "c2", name: "Grbavica", distance: "1.4 km", latitude: 43.8486, longitude: 18.3895 },
  { id: "c3", name: "Sebilj", distance: "2.1 km", latitude: 43.8597, longitude: 18.4334 },
  { id: "c4", name: "Dobrinja", distance: "4.8 km", latitude: 43.8241, longitude: 18.3477 }
];

export const CHANNELS = [
  { id: "ch1", name: "glavna", slug: "glavna", description: "Main local current for everything around you", color: "#7c3aed", premium: false },
  { id: "ch2", name: "desavase", slug: "desavase", description: "Live happenings in your block", color: "#4f46e5", premium: false },
  { id: "ch3", name: "ljubimci", slug: "ljubimci", description: "Pets, parks, walks, and neighborhood furballs", color: "#059669", premium: false },
  { id: "ch4", name: "politika", slug: "politika", description: "Hot takes, local pressure, city talk", color: "#dc2626", premium: true }
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
    content: "Anyone up for late coffee near Bascarsija tonight?",
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
      { id: "r1", author: "ghost", content: "I can be there in ten.", timeAgo: "1m", votes: 3, isAnonymous: true },
      { id: "r2", author: "local", content: "Behind Sebilj is packed right now.", timeAgo: "30s", votes: 1, isAnonymous: true }
    ]
  },
  {
    id: "2",
    author: "ljubimci",
    channel: "ljubimci",
    content: "Found a very friendly golden retriever near the tram stop.",
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
    content: "Police and ambulance just arrived near the old cinema. Anybody know what happened?",
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
  { id: "n1", title: "Reply landed", body: "Someone answered your Mahala post.", accent: "#8b5cf6" },
  { id: "n2", title: "Boost ready", body: "You still have 3 boost credits available.", accent: "#10b981" },
  { id: "n3", title: "Mahala Plus", body: "Unlock premium channels and image posting.", accent: "#ef4444" }
];
