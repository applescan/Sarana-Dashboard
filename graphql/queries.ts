import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
query GetDashboardData($startDate: String, $endDate: String) {
  categories {
      name
  }
  itemsSold(startDate: $startDate, endDate: $endDate) {
      quantity
      product {
          category {
              name
          }
      }
  }
  itemsRestocked(startDate: $startDate, endDate: $endDate) {
      quantity
  }
  revenues(startDate: $startDate, endDate: $endDate) {
      amount
      date
  }
}
`;

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
  query GetOrderById($id: Int!) {
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
      name
      id
      description
      sellPrice
      stock
      category {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    product(id: $id) {
      id
      name
      description
      buyPrice
      sellPrice
      stock
      createdAt
      updatedAt
      category {
        id
        name
      }
      itemsSold {
        id
        quantity
      }
      itemsRestocked {
        id
        quantity
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
    }
  }
`;

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($id: Int!) {
    category(id: $id) {
      id
      name
      createdAt
      updatedAt
      products {
        id
        name
        buyPrice
        sellPrice
        itemsSold {
          id
          quantity
        }
      }
      itemsSold {
        id
        product {
          id
          name
        }
        quantity
      }
    }
  }
`;

export const GET_REVENUES = gql`
  query Revenues {
    revenues {
      id
      amount
      date
      createdAt
      updatedAt
    }
  }
`;

export const GET_ITEMS_SOLD = gql`
  query ItemsSold {
    itemsSold {
      id
      quantity
      createdAt
      updatedAt
      product {
        id
        name
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_ITEMS_RESTOCKED = gql`
  query ItemsRestocked {
    itemsRestocked {
      id
      quantity
      createdAt
      updatedAt
      product {
        id
        name
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_REVENUE_BY_ID = gql`
  query GetRevenueById($id: Int!) {
    revenue(id: $id) {
      id
      amount
      date
      createdAt
      updatedAt
    }
  }
`;

export const GET_ITEM_SOLD_BY_ID = gql`
  query GetItemSoldById($id: Int!) {
    itemSold(id: $id) {
      id
      quantity
      createdAt
      updatedAt
      product {
        id
        name
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_ITEM_RESTOCKED_BY_ID = gql`
  query GetItemRestockedById($id: Int!) {
    itemRestocked(id: $id) {
      id
      quantity
      createdAt
      updatedAt
      product {
        id
        name
        category {
          id
          name
        }
      }
    }
  }
`;
