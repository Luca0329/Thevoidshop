export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  featured?: boolean;
  new?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverArt: string;
  duration: number;
}

export interface AppState {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  isAdmin: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  image: string;
  ticketLink: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
}