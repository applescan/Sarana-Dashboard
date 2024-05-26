export interface Order {
  id: number;
  totalAmount: number;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  orderId: number;
  order: Order;
  productId: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  category: Category;
  orderItems: OrderItem[];
  itemsSold: ItemsSold[];
  itemsRestocked: ItemsRestocked[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemsSold {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsRestocked {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Revenue {
  id: number;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchPayload {
  count: number;
}

export interface Query {
  orders: Order[];
  order(id: number): Order;
  products: Product[];
  product(id: number): Product;
  categories: Category[];
  category(id: number): Category;
  itemsSold: ItemsSold[];
  itemsRestocked: ItemsRestocked[];
  revenues: Revenue[];
  revenue(id: number): Revenue;
  itemSold(id: number): ItemsSold;
  itemRestocked(id: number): ItemsRestocked;
}

export interface Mutation {
  createOrders: (orders: { totalAmount: number }[]) => BatchPayload;
  updateOrders: (orders: { id: number; totalAmount?: number }[]) => Order[];
  deleteOrders: (ids: number[]) => BatchPayload;

  createOrderItems: (orderItems: { quantity: number; price: number; orderId: number; productId: number }[]) => BatchPayload;
  updateOrderItems: (orderItems: { id: number; quantity?: number; price?: number }[]) => OrderItem[];
  deleteOrderItems: (ids: number[]) => BatchPayload;

  createProducts: (products: { name: string; description?: string; price: number; stock: number; categoryId: number }[]) => BatchPayload;
  updateProducts: (products: { id: number; name?: string; description?: string; price?: number; stock?: number; categoryId?: number }[]) => Product[];
  deleteProducts: (ids: number[]) => BatchPayload;

  createCategories: (categories: { name: string }[]) => BatchPayload;
  updateCategories: (categories: { id: number; name?: string }[]) => Category[];
  deleteCategories: (ids: number[]) => BatchPayload;

  recordItemsSold: (itemsSold: { productId: number; quantity: number }[]) => BatchPayload;
  recordRevenue: (revenue: { amount: number; date: string }[]) => BatchPayload;
  recordItemsRestocked: (itemsRestocked: { productId: number; quantity: number }[]) => BatchPayload;
}
