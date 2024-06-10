export interface Order {
  id: number;
  totalAmount: number;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderInput {
  totalAmount: number;
  orderItems: OrderItemInput[];
}

export interface OrderItemInput {
  quantity: number;
  price: number;
  orderId?: number;
  productId: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  orderId: number;
  order: Order;
  productId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  buyPrice: number;
  sellPrice: number;
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
  productId: string;
  product: Product;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsRestocked {
  id: number;
  productId: string;
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
  orders(startDate?: string, endDate?: string): Order[];
  order(id: number): Order;
  products: Product[];
  product(id: string): Product;
  categories: Category[];
  category(id: number): Category;
  itemsSold(startDate?: string, endDate?: string): ItemsSold[];
  itemsRestocked(startDate?: string, endDate?: string): ItemsRestocked[];
  revenues(startDate?: string, endDate?: string): Revenue[];
  revenue(id: number): Revenue;
  itemSold(id: number): ItemsSold;
  itemRestocked(id: number): ItemsRestocked;
}

export interface Mutation {
  createOrders(orders: OrderInput[]): BatchPayload;
  updateOrders(orders: { id: number; totalAmount?: number }[]): Order[];
  deleteOrders(ids: number[]): BatchPayload;

  createOrderItems(orderItems: OrderItemInput[]): BatchPayload;
  updateOrderItems(orderItems: { id: number; quantity?: number; price?: number }[]): OrderItem[];
  deleteOrderItems(ids: number[]): BatchPayload;

  createProducts(products: { id?: string; name: string; description?: string; buyPrice: number; sellPrice: number; stock: number; categoryId?: number }[]): BatchPayload;
  updateProducts(products: { id: string; name?: string; description?: string; buyPrice?: number; sellPrice?: number; stock?: number; categoryId?: number }[]): Product[];
  deleteProducts(ids: string[]): BatchPayload;

  createCategories(categories: { name: string }[]): BatchPayload;
  updateCategories(categories: { id: number; name?: string }[]): Category[];
  deleteCategories(ids: number[]): BatchPayload;

  recordItemsSold(itemsSold: { productId: string; quantity: number }[]): BatchPayload;
  recordRevenue(revenue: { amount: number; date: string }[]): BatchPayload;
  recordItemsRestocked(itemsRestocked: { productId: string; quantity: number }[]): BatchPayload;
}
