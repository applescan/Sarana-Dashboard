export interface Order {
  id: string;
  totalAmount: number;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
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
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Query {
  orders: Order[];
  products: Product[];
  categories: Category[];
}

export interface Mutation {
  createOrder: (totalAmount: number, orderItems: { quantity: number; price: number; productId: string }[]) => Order;
  updateOrder: (id: string, totalAmount?: number, orderItems?: { quantity: number; price: number; productId: string }[]) => Order;
  deleteOrder: (id: string) => Order;

  createOrderItem: (quantity: number, price: number, orderId: string, productId: string) => OrderItem;
  updateOrderItem: (id: string, quantity?: number, price?: number) => OrderItem;
  deleteOrderItem: (id: string) => OrderItem;

  createProduct: (name: string, description: string, price: number, stock: number, categoryId: string) => Product;
  updateProduct: (id: string, name?: string, description?: string, price?: number, stock?: number, categoryId?: string) => Product;
  deleteProduct: (id: string) => Product;

  createCategory: (name: string) => Category;
  updateCategory: (id: string, name?: string) => Category;
  deleteCategory: (id: string) => Category;
}
