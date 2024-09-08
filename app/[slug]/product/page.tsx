'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import GlobalError from '@/app/global-error';
import ProductTable from '@/components/ProductTable';
import Loading from '@/components/ui/Loading';
import { GET_CATEGORIES, GET_PRODUCTS } from '@/graphql/queries';
import { Category, Product } from '@/lib/types/types';

const ProductPage = () => {
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    categories: Category[];
  }>(GET_CATEGORIES);

  if (productsLoading || categoriesLoading) return <Loading />;

  if (productsError) {
    console.error('Error fetching product data:', productsError);
    return <GlobalError />;
  }

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Buy Price', accessor: 'buyPrice' },
    { Header: 'Sell Price', accessor: 'sellPrice' },
    { Header: 'Category', accessor: 'category.name' },
    { Header: 'Stock', accessor: 'stock' },
  ];

  return (
    <div className="overflow-x-auto">
      <ProductTable
        columns={columns}
        data={productsData?.products || []}
        categories={categoriesData?.categories || []}
      />
    </div>
  );
};

export default ProductPage;
