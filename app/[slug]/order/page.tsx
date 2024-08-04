'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import OrderTable, { Column } from '@/components/OrderTable';
import Loading from '@/components/ui/Loading';
import { GET_ORDERS, GET_PRODUCTS, GET_CATEGORIES } from '@/graphql/queries';

const ParentComponent: React.FC = () => {
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
  } = useQuery(GET_ORDERS);
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery(GET_PRODUCTS);
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery(GET_CATEGORIES);

  if (ordersLoading || productsLoading || categoriesLoading) return <Loading />;
  if (ordersError) return <p>Error loading orders: {ordersError.message}</p>;
  if (productsError)
    return <p>Error loading products: {productsError.message}</p>;
  if (categoriesError)
    return <p>Error loading categories: {categoriesError.message}</p>;

  const columns: Column[] = [
    { Header: 'Order ID', accessor: 'id' },
    { Header: 'Product Name', accessor: 'orderItems.product.name' },
    { Header: 'Order Quantity', accessor: 'orderItems.quantity' },
    { Header: 'Total Amount', accessor: 'totalAmount' },
    { Header: 'Created At', accessor: 'createdAt' },
  ];

  return (
    <div>
      <OrderTable
        columns={columns}
        data={ordersData.orders}
        categories={categoriesData.categories}
        products={productsData.products}
      />
    </div>
  );
};

export default ParentComponent;
