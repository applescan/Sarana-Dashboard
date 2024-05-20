import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query Orders {
    orders {
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

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
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

export const GET_PRODUCTS = gql`
  query Products {
    products {
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

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
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

export const GET_CATEGORIES = gql`
  query Categories {
    categories {
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

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($id: ID!) {
    category(id: $id) {
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
