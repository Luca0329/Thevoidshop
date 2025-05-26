export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  image: string;
  image2?: string;    // new hover image
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
    image: '/images/drunkenmessiah1.jpeg',
    image2: '/images/drunkenmessiah.jpeg',
    available: true,
    category: 'music',
    stripeBuyButtonId: "buy_btn_XXXXXXXXXXXXXXXXX", // Replace with real ID from Stripe
    tags: ['cassette', 'scepter', 'underground', 'music']
  },
  {
    id: 'cph-raw-dogs-cardiel-tshirt',
    title: 'CPH RAW DOGS "CARDIEL" T-SHIRT',
    handle: 'cph-raw-dogs-cardiel-tshirt',
    description: 'Original Cardiel design t-shirt from CPH Raw Dogs collection. Premium quality streetwear with underground aesthetic.',
    price: 350.00,
    image: '/images/cardiel1.jpeg',
    image2: '/images/cardiel2.jpeg',
    available: true,
    category: 'apparel',
    stripeBuyButtonId: "buy_btn_XXXXXXXXXXXXXXXXX", // Replace with real ID from Stripe
    tags: ['t-shirt', 'cardiel', 'streetwear', 'apparel']
  },
  {
    id: 'vaabnet-det-hellige-mod',
    title: 'VAABNET "DET HELLIGE MOD"',
    handle: 'vaabnet-det-hellige-mod',
    description: 'Vaabnet\'s "Det Hellige Mod" - a powerful underground release channeling raw Danish energy and mystical themes.',
    price: 200.00,
    image: '/images/dethelligemod.jpeg',
    available: true,
    category: 'music',
    stripeBuyButtonId: "buy_btn_XXXXXXXXXXXXXXXXX", // Replace with real ID from Stripe
    tags: ['vaabnet', 'danish', 'underground', 'music']
  }
];

export const formatPrice = (price: number): string => {
  return `${price.toFixed(0)} kr`;
};