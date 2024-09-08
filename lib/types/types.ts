export interface BatchPayload {
  count: number;
}

export interface Category {
  createdAt: string;
  id: number;
  name: string;
  products: Product[];
  updatedAt: string;
}

export interface ItemsRestocked {
  createdAt: string;
  id: number;
  product: Product;
  productId: string;
  quantity: number;
  updatedAt: string;
}

export interface ItemsSold {
  createdAt: string;
  id: number;
  product: Product;
  productId: string;
  quantity: number;
  updatedAt: string;
}

export interface Mutation {
  createCategories(categories: { name: string }[]): BatchPayload;
  createOrderItems(orderItems: OrderItemInput[]): BatchPayload;
  createOrders(orders: OrderInput[]): BatchPayload;
  createProducts(
    products: {
      buyPrice: number;
      categoryId?: number;
      description?: string;
      id?: string;
      name: string;
      sellPrice: number;
      stock: number;
    }[],
  ): BatchPayload;
  deleteCategories(ids: number[]): BatchPayload;
  deleteOrderItems(ids: number[]): BatchPayload;
  deleteOrders(ids: number[]): BatchPayload;
  deleteProducts(ids: string[]): BatchPayload;
  recordItemsRestocked(
    itemsRestocked: { productId: string; quantity: number }[],
  ): BatchPayload;
  recordItemsSold(
    itemsSold: { productId: string; quantity: number }[],
  ): BatchPayload;
  recordRevenue(revenue: { amount: number; date: string }[]): BatchPayload;
  updateCategories(categories: { id: number; name?: string }[]): Category[];
  updateOrderItems(
    orderItems: { id: number; price?: number; quantity?: number }[],
  ): OrderItem[];
  updateOrders(orders: { id: number; totalAmount?: number }[]): Order[];
  updateProducts(
    products: {
      buyPrice?: number;
      categoryId?: number;
      description?: string;
      id: string;
      name?: string;
      sellPrice?: number;
      stock?: number;
    }[],
  ): Product[];
}

export interface Order {
  createdAt: string;
  id: number;
  orderItems: OrderItem[];
  status: string;
  totalAmount: number;
  updatedAt: string;
}

export interface OrderInput {
  orderItems: OrderItemInput[];
  totalAmount: number;
}

export interface OrderItem {
  createdAt: string;
  id: number;
  order: Order;
  orderId: number;
  price: number;
  product: Product;
  productId: string;
  quantity: number;
  updatedAt: string;
}

export interface OrderItemInput {
  orderId?: number;
  price: number;
  productId: string;
  quantity: number;
}

export interface Product {
  buyPrice: number;
  category: Category;
  categoryId: number;
  createdAt: string;
  description?: string;
  id: string;
  itemsRestocked: ItemsRestocked[];
  itemsSold: ItemsSold[];
  name: string;
  orderItems: OrderItem[];
  sellPrice: number;
  stock: number;
  updatedAt: string;
}

export interface Query {
  categories: Category[];
  category(id: number): Category;
  itemRestocked(id: number): ItemsRestocked;
  itemsRestocked(startDate?: string, endDate?: string): ItemsRestocked[];
  itemSold(id: number): ItemsSold;
  itemsSold(startDate?: string, endDate?: string): ItemsSold[];
  orders(startDate?: string, endDate?: string): Order[];
  order(id: number): Order;
  product(id: string): Product;
  products: Product[];
  revenue(id: number): Revenue;
  revenues(startDate?: string, endDate?: string): Revenue[];
}

export interface Revenue {
  amount: number;
  createdAt: string;
  date: string;
  id: number;
  updatedAt: string;
}
