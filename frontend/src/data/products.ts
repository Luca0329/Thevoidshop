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
    id: 'scepter-drunken-messiah',
    title: 'SCEPTER "DRUNKEN MESSIAH"',
    handle: 'scepter-drunken-messiah',
    description: 'Mystical scepter for the void walkers',
    price: 45.0,
    image: '/images/scepter.jpg',
    available: true,
    category: 'accessories',
    stripeBuyButtonId: 'buy_btn_1RSabyPDdyqJyXlCXekxL2Uv',
    tags: ['mystical', 'accessories', 'scepter']
  },
  {
    id: 'cph-raw-dogs-cardiel',
    title: 'CPH RAW DOGS "CARDIEL" ORIGINAL',
    handle: 'cph-raw-dogs-cardiel-original',
    description: 'Original Cardiel design from CPH Raw Dogs collection',
    price: 35.0,
    image: '/images/cardiel.jpg',
    available: true,
    category: 'apparel',
    stripeBuyButtonId: 'PUT_ACTUAL_BUY_BUTTON_ID_HERE', // Replace with real ID
    tags: ['apparel', 'original', 'cardiel']
  },
  // Add your third product here
];