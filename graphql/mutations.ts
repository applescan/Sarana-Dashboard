import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($totalAmount: Float!, $orderItems: [OrderItemInput!]!) {
    createOrder(totalAmount: $totalAmount, orderItems: $orderItems) {
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

export const EDIT_ORDER = gql`
  mutation EditOrder($id: ID!, $totalAmount: Float, $orderItems: [OrderItemInput!]) {
    updateOrder(id: $id, totalAmount: $totalAmount, orderItems: $orderItems) {
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

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`;

export const CREATE_ORDER_ITEM = gql`
  mutation CreateOrderItem($quantity: Int!, $price: Float!, $orderId: ID!, $productId: ID!) {
    createOrderItem(quantity: $quantity, price: $price, orderId: $orderId, productId: $productId) {
      id
      quantity
      price
      createdAt
      updatedAt
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

export const EDIT_ORDER_ITEM = gql`
  mutation EditOrderItem($id: ID!, $quantity: Int, $price: Float) {
    updateOrderItem(id: $id, quantity: $quantity, price: $price) {
      id
      quantity
      price
      createdAt
      updatedAt
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

export const DELETE_ORDER_ITEM = gql`
  mutation DeleteOrderItem($id: ID!) {
    deleteOrderItem(id: $id) {
      id
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $description: String, $price: Float!, $stock: Int!, $categoryId: ID!) {
    createProduct(name: $name, description: $description, price: $price, stock: $stock, categoryId: $categoryId) {
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

export const EDIT_PRODUCT = gql`
  mutation EditProduct($id: ID!, $name: String, $description: String, $price: Float, $stock: Int, $categoryId: ID) {
    updateProduct(id: $id, name: $name, description: $description, price: $price, stock: $stock, categoryId: $categoryId) {
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

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
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

export const EDIT_CATEGORY = gql`
  mutation EditCategory($id: ID!, $name: String) {
    updateCategory(id: $id, name: $name) {
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

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;
