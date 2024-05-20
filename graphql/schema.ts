export const typeDefs = `#graphql

type Order {
  id: ID!
  totalAmount: Float!
  orderItems: [OrderItem!]!
  createdAt: String!
  updatedAt: String!
}

type OrderItem {
  id: ID!
  quantity: Int!
  price: Float!
  order: Order!
  product: Product!
  createdAt: String!
  updatedAt: String!
}

type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  stock: Int!
  category: Category!
  orderItems: [OrderItem!]!
  createdAt: String!
  updatedAt: String!
}

type Category {
  id: ID!
  name: String!
  products: [Product!]!
  createdAt: String!
  updatedAt: String!
}

type Query {
  orders: [Order!]!
  products: [Product!]!
  categories: [Category!]!
  order(id: ID!): Order
  product(id: ID!): Product
  category(id: ID!): Category
}

type Mutation {
  createOrder(totalAmount: Float!, orderItems: [OrderItemInput!]!): Order!
  updateOrder(id: ID!, totalAmount: Float, orderItems: [OrderItemInput!]): Order!
  deleteOrder(id: ID!): Order!

  createOrderItem(quantity: Int!, price: Float!, orderId: ID!, productId: ID!): OrderItem!
  updateOrderItem(id: ID!, quantity: Int, price: Float): OrderItem!
  deleteOrderItem(id: ID!): OrderItem!

  createProduct(name: String!, description: String, price: Float!, stock: Int!, categoryId: ID!): Product!
  updateProduct(id: ID!, name: String, description: String, price: Float, stock: Int, categoryId: ID): Product!
  deleteProduct(id: ID!): Product!

  createCategory(name: String!): Category!
  updateCategory(id: ID!, name: String): Category!
  deleteCategory(id: ID!): Category!
}

input OrderItemInput {
  quantity: Int!
  price: Float!
  productId: ID!
}
`;
