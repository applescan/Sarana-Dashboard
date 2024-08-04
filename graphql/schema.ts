export const typeDefs = `#graphql

type Order {
  id: Int!
  totalAmount: Float!
  orderItems: [OrderItem!]!
  status: String!
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
  id: String!
  name: String!
  description: String
  buyPrice: Float!
  sellPrice: Float!
  stock: Int!
  category: Category!
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
  createdAt: String!
  updatedAt: String!
}

type ItemsSold {
  id: Int!
  product: Product!
  quantity: Int!
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
  orders(startDate: String, endDate: String): [Order]
  itemsSold(startDate: String, endDate: String): [ItemsSold]
  itemsRestocked(startDate: String, endDate: String): [ItemsRestocked]
  revenues(startDate: String, endDate: String): [Revenue]
  order(id: Int!): Order
  products: [Product]
  product(id: String!): Product
  categories: [Category]
  category(id: Int!): Category
  revenue(id: Int!): Revenue
  itemSold(id: Int!): ItemsSold
  itemRestocked(id: Int!): ItemsRestocked
}

type Mutation {
  createOrders(orders: [OrderInput!]!): BatchPayload!
  markOrderAsReceived(orderId: Int!): Order!
  updateOrders(orders: [OrderUpdateInput!]!): [Order]
  deleteOrders(ids: [Int!]!): BatchPayload!

  createOrderItems(orderItems: [OrderItemInput!]!): BatchPayload!
  updateOrderItems(orderItems: [OrderItemUpdateInput!]!): [OrderItem]
  deleteOrderItems(ids: [Int!]!): BatchPayload!

  createProducts(products: [ProductInput!]!): BatchPayload!
  updateProducts(products: [ProductUpdateInput!]!): [Product]!
  deleteProducts(ids: [String!]!): BatchPayload! 

  createCategories(categories: [CategoryInput!]!): BatchPayload!
  updateCategories(categories: [CategoryUpdateInput!]!): [Category]!
  deleteCategories(ids: [Int!]!): BatchPayload!

  recordItemsSold(itemsSold: [ItemsSoldInput!]!): BatchPayload!
  recordRevenue(revenue: [RevenueInput!]!): BatchPayload!
  recordItemsRestocked(itemsRestocked: [ItemsRestockedInput!]!): BatchPayload!
}

input OrderInput {
  totalAmount: Float!
  orderItems: [OrderItemInput!]!
}

input OrderUpdateInput {
  id: Int!
  totalAmount: Float
}

input OrderItemInput {
  quantity: Int!
  price: Float!
  productId: String!
}

input OrderItemUpdateInput {
  id: Int!
  quantity: Int
  price: Float
}

input ProductInput {
  id: String  
  name: String!
  description: String
  buyPrice: Float!  
  sellPrice: Float!  
  stock: Int!
  categoryId: Int!
}

input ProductUpdateInput {
  id: String!  
  name: String
  description: String
  buyPrice: Float 
  sellPrice: Float 
  stock: Int
  categoryId: Int!
}

input CategoryInput {
  name: String!
}

input CategoryUpdateInput {
  id: Int!
  name: String
}

input ItemsSoldInput {
  productId: String!
  quantity: Int!
}

input RevenueInput {
  amount: Float!
  date: String!
}

input ItemsRestockedInput {
  productId: String!
  quantity: Int!
}
`;
