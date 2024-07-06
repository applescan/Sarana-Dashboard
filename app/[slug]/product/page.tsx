"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES, GET_PRODUCTS } from "@/graphql/queries";
import { Category, Product } from "@/lib/types/types";
import Loading from "@/components/ui/Loading";
import ProductTable from "@/components/ui/ProductTable";

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
    console.error("Error fetching product data:", productsError);
    return <p>Error loading products</p>;
  }

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Price", accessor: "price" },
    { Header: "Category", accessor: "category.name" },
    { Header: "Stock", accessor: "stock" },
  ];

  return (
    <div>
      <div>
        <ProductTable
          columns={columns}
          data={productsData?.products || []}
          categories={categoriesData?.categories || []}
        />
      </div>
    </div>
  );
};

export default ProductPage;
