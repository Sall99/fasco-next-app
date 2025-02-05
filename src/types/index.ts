export type ProductType = {
  id: string;
  name: string;
  brand: string;
  price: number;
  viewersCount: number;
  category: string;
  rating: {
    average: number;
    reviewsCount: number;
  };
  stock: {
    quantity: number;
    lowStockThreshold: number;
  };
  isAlmostSoldOut: boolean;
  tags: string[];
  images: string[];
  description: string;
};

export type SignupFormData = {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
