'use client';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';

import GlobalError from '@/app/global-error';
import PosDialog from '@/components/PosDialog';
import ProductCard from '@/components/ProductCard';
import SelectedItemsList from '@/components/SelectedItemsList';
import TransactionSuccessDialog from '@/components/TransactionSuccessDialog';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import { RECORD_ITEMS_SOLD, RECORD_REVENUE } from '@/graphql/mutations';
import { GET_CATEGORIES, GET_PRODUCTS } from '@/graphql/queries';
import { Category, Product } from '@/lib/types/types';

const POSPage = () => {
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [isOutOfStockModalOpen, setIsOutOfStockModalOpen] =
    useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [outOfStockProduct, setOutOfStockProduct] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'All',
  );
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(
    {},
  );

  const {
    data: categoriesData,
    error: categoriesError,
    loading: categoriesLoading,
  } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  const {
    data: productsData,
    error: productsError,
    loading: productsLoading,
  } = useQuery<{ products: Product[] }>(GET_PRODUCTS);

  const [recordItemsSold] = useMutation(RECORD_ITEMS_SOLD);
  const [recordRevenue] = useMutation(RECORD_REVENUE);

  if (categoriesLoading || productsLoading) return <Loading />;
  if (categoriesError || productsError) return <GlobalError />;

  const filteredProducts = productsData?.products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category?.name === selectedCategory;
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  const handleAmountPaidChange = (value: string) => {
    setAmountPaid(value);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedItems((prevItems) => ({
      ...prevItems,
      [productId]: quantity,
    }));
  };

  const handleRecordItemsSold = async () => {
    const itemsSold = Object.entries(selectedItems).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      }),
    );
    await recordItemsSold({ variables: { itemsSold } });

    const currentDate = new Date().toISOString();
    const newRevenue = itemsSold.map((item) => ({
      amount:
        (productsData?.products.find((p) => p.id === item.productId)
          ?.sellPrice || 0) * item.quantity,
      date: currentDate,
    }));
    await recordRevenue({ variables: { revenue: newRevenue } });

    setSelectedItems({});
    setAmountPaid('');
    setIsSuccessModalOpen(true);
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prevItems) => {
      const newItems = { ...prevItems };
      delete newItems[productId];
      return newItems;
    });
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSelectProduct = (product: Product) => {
    if (product.stock > 0) {
      setSelectedItems((prevItems) => ({
        ...prevItems,
        [product.id]: (prevItems[product.id] || 0) + 1,
      }));
    } else {
      setOutOfStockProduct(product.name);
      setIsOutOfStockModalOpen(true);
    }
  };

  const subtotal = Object.entries(selectedItems).reduce(
    (total, [productId, quantity]) => {
      const product = productsData?.products.find((p) => p.id === productId);
      return total + (product ? product.sellPrice * quantity : 0);
    },
    0,
  );

  const returnMoney =
    parseFloat(amountPaid) > subtotal ? parseFloat(amountPaid) - subtotal : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-card/70 p-4 shadow-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-sm">
            <Input
              type="text"
              placeholder="Search products by name"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              key="all"
              variant={selectedCategory === 'All' ? 'default' : 'secondary'}
              onClick={() => handleSelectCategory('All')}
            >
              All
            </Badge>
            {categoriesData?.categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.name ? 'default' : 'secondary'
                }
                onClick={() => handleSelectCategory(category.name)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[2fr_1fr] xl:grid-cols-[3fr_1fr]">
        <section className="flex max-h-none flex-col overflow-visible rounded-3xl border border-white/10 bg-card/60 p-4 shadow-glow lg:max-h-[100vh] lg:overflow-hidden">
          <div className="flex-1 overflow-visible pr-0 lg:overflow-auto lg:pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          </div>
        </section>
        <div className="h-auto max-h-none lg:h-full lg:max-h-[100vh]">
          <SelectedItemsList
            selectedItems={selectedItems}
            products={productsData?.products || []}
            onQuantityChange={handleQuantityChange}
            onRecordItemsSold={handleRecordItemsSold}
            onRemoveItem={handleRemoveItem}
            amountPaid={amountPaid}
            onAmountPaidChange={handleAmountPaidChange}
            returnMoney={returnMoney}
            subtotal={subtotal}
          />
        </div>
      </div>

      <PosDialog
        open={isOutOfStockModalOpen}
        onOpenChange={() => setIsOutOfStockModalOpen(false)}
        title="Out of Stock"
        desc={`${outOfStockProduct} is out of stock and cannot be added to the cart.`}
        button="Close"
        onClick={() => setIsOutOfStockModalOpen(false)}
      />

      <TransactionSuccessDialog
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default POSPage;
