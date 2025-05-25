interface StripeProduct {
  id: string;
  name: string;
  description: string;
  images: string[];
  default_price: {
    id: string;
    unit_amount: number;
    currency: string;
  };
  metadata: {
    category?: string;
    handle?: string;
    available?: string;
    tags?: string;
  };
}

export interface AutoProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category: 'apparel' | 'music' | 'accessories';
  stripePriceId: string;
  tags: string[];
}

export const fetchStripeProducts = async (): Promise<AutoProduct[]> => {
  try {
    // Use your backend to fetch from Stripe (keeps secret key secure)
    const apiUrl = import.meta.env.VITE_API_URL || 'https://thevoidshop-production.up.railway.app';
    
    const response = await fetch(`${apiUrl}/stripe-products`);
    if (!response.ok) {
      throw new Error('Failed to fetch Stripe products');
    }
    
    const stripeProducts: StripeProduct[] = await response.json();
    
    return stripeProducts.map(product => ({
      id: product.id,
      title: product.name,
      handle: product.metadata.handle || product.name.toLowerCase().replace(/\s+/g, '-'),
      description: product.description || '',
      price: product.default_price.unit_amount / 100, // Convert from cents
      image: product.images[0] || '/images/placeholder.jpg',
      available: product.metadata.available !== 'false',
      category: (product.metadata.category as any) || 'accessories',
      stripePriceId: product.default_price.id,
      tags: product.metadata.tags ? product.metadata.tags.split(',') : []
    }));
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return [];
  }
};
