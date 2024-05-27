export const typeDefs = `#graphql

type Order {
  id: Int!
  totalAmount: Float!
  orderItems: [OrderItem]
  createdAt: String!
  updatedAt: String!
}

type OrderItem {
  id: Int!
  quantity: Int!
  price: Float!
  order: Order!
  product: Product!
  createdAt: String!
  updatedAt: String!
}

type Product {
  id: Int!
  name: String!
  description: String
  price: Float!
  stock: Int!
  category: Category
  orderItems: [OrderItem]
  itemsSold: [ItemsSold]
  itemsRestocked: [ItemsRestocked]
  createdAt: String!
  updatedAt: String!
}

type Category {
  id: Int!
  name: String!
  products: [Product]
  itemsSold: [ItemsSold] # Added itemsSold field here
  createdAt: String!
  updatedAt: String!
}

type ItemsSold {
  id: Int!
  product: Product
  quantity: Int
  createdAt: String!
  updatedAt: String!
}

type ItemsRestocked {
  id: Int!
  product: Product!
  quantity: Int!
  createdAt: String!
  updatedAt: String!
}

type Revenue {
  id: Int!
  amount: Float!
  date: String!
  createdAt: String!
  updatedAt: String!
}

type BatchPayload {
  count: Int!
}

type Query {
  orders: [Order]
  order(id: Int!): Order
  products: [Product]
  product(id: Int!): Product
  categories: [Category]
  category(id: Int!): Category
  itemsSold: [ItemsSold]
  itemsRestocked: [ItemsRestocked]
  revenues: [Revenue]
  revenue(id: Int!): Revenue
  itemSold(id: Int!): ItemsSold
  itemRestocked(id: Int!): ItemsRestocked
}

type Mutation {
  createOrders(orders: [OrderInput!]!): BatchPayload!
  updateOrders(orders: [OrderUpdateInput!]!): [Order]
  deleteOrders(ids: [Int!]!): BatchPayload!

  createOrderItems(orderItems: [OrderItemInput!]!): BatchPayload!
  updateOrderItems(orderItems: [OrderItemUpdateInput!]!): [OrderItem]
  deleteOrderItems(ids: [Int!]!): BatchPayload!

  createProducts(products: [ProductInput!]!): BatchPayload!
  updateProducts(products: [ProductUpdateInput!]!): [Product]!
  deleteProducts(ids: [Int!]!): BatchPayload!

  createCategories(categories: [CategoryInput!]!): BatchPayload!
  updateCategories(categories: [CategoryUpdateInput!]!): [Category]!
  deleteCategories(ids: [Int!]!): BatchPayload!

  recordItemsSold(itemsSold: [ItemsSoldInput!]!): BatchPayload!
  recordRevenue(revenue: [RevenueInput!]!): BatchPayload!
  recordItemsRestocked(itemsRestocked: [ItemsRestockedInput!]!): BatchPayload!
}

input OrderInput {
  totalAmount: Float!
}

input OrderUpdateInput {
  id: Int!
  totalAmount: Float
}

input OrderItemInput {
  quantity: Int!
  price: Float!
  orderId: Int!
  productId: Int!
}

input OrderItemUpdateInput {
  id: Int!
  quantity: Int
  price: Float
}

input ProductInput {
  name: String!
  description: String
  price: Float!
  stock: Int!
  categoryId: Int
}

input ProductUpdateInput {
  id: Int!
  name: String
  description: String
  price: Float
  stock: Int
  categoryId: Int
}

input CategoryInput {
  name: String!
}

input CategoryUpdateInput {
  id: Int!
  name: String
}

input ItemsSoldInput {
  productId: Int!
  quantity: Int!
}

input RevenueInput {
  amount: Float!
  date: String!
}

input ItemsRestockedInput {
  productId: Int!
  quantity: Int!
}
`;
