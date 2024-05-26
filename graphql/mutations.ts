import { gql } from "@apollo/client";

export const CREATE_ORDERS = gql`
  mutation CreateOrders($orders: [OrderInput!]!) {
    createOrders(orders: $orders) {
      count
    }
  }
`;

export const UPDATE_ORDERS = gql`
  mutation UpdateOrders($orders: [OrderUpdateInput!]!) {
    updateOrders(orders: $orders) {
      id
      totalAmount
      createdAt
      updatedAt
      orderItems {
        id
        quantity
        price
        product {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_ORDERS = gql`
  mutation DeleteOrders($ids: [Int!]!) {
    deleteOrders(ids: $ids) {
      count
    }
  }
`;

export const CREATE_ORDER_ITEMS = gql`
  mutation CreateOrderItems($orderItems: [OrderItemInput!]!) {
    createOrderItems(orderItems: $orderItems) {
      count
    }
  }
`;

export const UPDATE_ORDER_ITEMS = gql`
  mutation UpdateOrderItems($orderItems: [OrderItemUpdateInput!]!) {
    updateOrderItems(orderItems: $orderItems) {
      id
      quantity
      price
      order {
        id
        totalAmount
        createdAt
        updatedAt
      }
      product {
        id
        name
        price
      }
    }
  }
`;

export const DELETE_ORDER_ITEMS = gql`
  mutation DeleteOrderItems($ids: [Int!]!) {
    deleteOrderItems(ids: $ids) {
      count
    }
  }
`;

export const CREATE_PRODUCTS = gql`
  mutation CreateProducts($products: [ProductInput!]!) {
    createProducts(products: $products) {
      count
    }
  }
`;

export const UPDATE_PRODUCTS = gql`
  mutation UpdateProducts($products: [ProductUpdateInput!]!) {
    updateProducts(products: $products) {
      id
      name
      description
      price
      stock
      createdAt
      updatedAt
      category {
        id
        name
      }
    }
  }
`;

export const DELETE_PRODUCTS = gql`
  mutation DeleteProducts($ids: [Int!]!) {
    deleteProducts(ids: $ids) {
      count
    }
  }
`;

export const CREATE_CATEGORIES = gql`
  mutation CreateCategories($categories: [CategoryInput!]!) {
    createCategories(categories: $categories) {
      count
    }
  }
`;

export const UPDATE_CATEGORIES = gql`
  mutation UpdateCategories($categories: [CategoryUpdateInput!]!) {
    updateCategories(categories: $categories) {
      id
      name
      createdAt
      updatedAt
      products {
        id
        name
        price
      }
    }
  }
`;

export const DELETE_CATEGORIES = gql`
  mutation DeleteCategories($ids: [Int!]!) {
    deleteCategories(ids: $ids) {
      count
    }
  }
`;

export const RECORD_ITEMS_SOLD = gql`
  mutation RecordItemsSold($itemsSold: [ItemsSoldInput!]!) {
    recordItemsSold(itemsSold: $itemsSold) {
      count
    }
  }
`;

export const RECORD_REVENUE = gql`
  mutation RecordRevenue($revenue: [RevenueInput!]!) {
    recordRevenue(revenue: $revenue) {
      count
    }
  }
`;

export const RECORD_ITEMS_RESTOCKED = gql`
  mutation RecordItemsRestocked($itemsRestocked: [ItemsRestockedInput!]!) {
    recordItemsRestocked(itemsRestocked: $itemsRestocked) {
      count
    }
  }
`;
