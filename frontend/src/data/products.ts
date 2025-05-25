export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category: 'apparel' | 'music' | 'accessories';
  stripeBuyButtonId: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 'scepters-drunken-messiah-cassette',
    title: 'SCEPTER\'S "DRUNKEN MESSIAH" CASSETTE',
    handle: 'scepters-drunken-messiah-cassette',
    description: 'Raw underground cassette from Scepter\'s acclaimed "Drunken Messiah" release. Limited edition physical format.',
    price: 70.00,
    image: 'https://via.placeholder.com/400x400/1a1a1a/8b5cf6?text=SCEPTER+CASSETTE',
    available: true,
    category: 'music',
    stripeBuyButtonId: 'buy_btn_1RSeJJA5a5swpvmvVmZ4UP9M',
    tags: ['cassette', 'scepter', 'underground', 'music']
  },
  {
    id: 'cph-raw-dogs-cardiel-tshirt',
    title: 'CPH RAW DOGS "CARDIEL" T-SHIRT',
    handle: 'cph-raw-dogs-cardiel-tshirt',
    description: 'Original Cardiel design t-shirt from CPH Raw Dogs collection. Premium quality streetwear with underground aesthetic.',
    price: 350.00,
    image: 'https://via.placeholder.com/400x400/1a1a1a/8b5cf6?text=CARDIEL+TSHIRT',
    available: true,
    category: 'apparel',
    stripeBuyButtonId: 'buy_btn_1RSeKvA5a5swpvmvdzZuI1ww',
    tags: ['t-shirt', 'cardiel', 'streetwear', 'apparel']
  },
  {
    id: 'vaabnet-det-hellige-mod',
    title: 'VAABNET "DET HELLIGE MOD"',
    handle: 'vaabnet-det-hellige-mod',
    description: 'Vaabnet\'s "Det Hellige Mod" - a powerful underground release channeling raw Danish energy and mystical themes.',
    price: 200.00,
    image: 'https://via.placeholder.com/400x400/1a1a1a/8b5cf6?text=VAABNET+ALBUM',
    available: true,
    category: 'music',
    stripeBuyButtonId: 'buy_btn_1RSeLjA5a5swpvmvTFzszDaV',
    tags: ['album', 'danish', 'underground', 'vaabnet']
  }
];

export const formatPrice = (price: number): string => {
  return `${price.toFixed(0)} kr`;
};