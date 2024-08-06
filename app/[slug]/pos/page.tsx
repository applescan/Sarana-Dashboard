'use client';
import { useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import PosDialog from '@/components/PosDialog';
import ProductCard from '@/components/ProductCard';
import SelectedItemsList from '@/components/SelectedItemsList';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import { RECORD_ITEMS_SOLD, RECORD_REVENUE } from '@/graphql/mutations';
import { GET_CATEGORIES, GET_PRODUCTS } from '@/graphql/queries';
import { Category, Product } from '@/lib/types/types';

const POSPage = () => {
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    categories: Category[];
  }>(GET_CATEGORIES);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>(
    {},
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOutOfStockModalOpen, setIsOutOfStockModalOpen] =
    useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [outOfStockProduct, setOutOfStockProduct] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<string>('0');

  useEffect(() => {
    if (productsError) {
      console.error('Error fetching product data:', productsError);
    }
  }, [productsError]);

  const [recordItemsSold] = useMutation(RECORD_ITEMS_SOLD);
  const [recordRevenue] = useMutation(RECORD_REVENUE);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'All',
  );

  // Function to handle product selection
  const handleSelectProduct = (product: Product) => {
    if (product.stock > 0) {
      const newSelectedItems = { ...selectedItems };
      newSelectedItems[product.id] = (newSelectedItems[product.id] || 0) + 1;
      setSelectedItems(newSelectedItems);
    } else {
      setOutOfStockProduct(product.name);
      setIsOutOfStockModalOpen(true);
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (productId: string, quantity: number) => {
    const newSelectedItems = { ...selectedItems };
    newSelectedItems[productId] = quantity;
    setSelectedItems(newSelectedItems);
  };

  // Function to handle item removal
  const handleRemoveItem = (productId: string) => {
    const newSelectedItems = { ...selectedItems };
    delete newSelectedItems[productId];
    setSelectedItems(newSelectedItems);
  };

  // Calculate the subtotal
  const subtotal = Object.entries(selectedItems).reduce(
    (total, [productId, quantity]) => {
      const product = productsData?.products.find((p) => p.id === productId);
      return total + (product ? product.sellPrice * quantity : 0);
    },
    0,
  );

  // Calculate the return money
  const returnMoney =
    parseFloat(amountPaid) > subtotal ? parseFloat(amountPaid) - subtotal : 0;

  // Function to handle record items sold
  const handleRecordItemsSold = async () => {
    const itemsSold = Object.entries(selectedItems).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      }),
    );
    await recordItemsSold({ variables: { itemsSold } });

    // Update revenue
    const currentDate = new Date().toISOString();
    const newRevenue = itemsSold.map((item) => ({
      amount:
        (productsData?.products?.find((p) => p.id === item.productId)
          ?.sellPrice || 0) * item.quantity,
      date: currentDate,
    }));
    await recordRevenue({ variables: { revenue: newRevenue } });

    // Reset selected items and amount paid
    setSelectedItems({});
    setAmountPaid('0');
    setIsSuccessModalOpen(true);
  };

  // Function to handle category selection
  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  // Function to handle amount paid change
  const handleAmountPaidChange = (value: string) => {
    setAmountPaid(value);
  };

  // Function to handle search term change
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (productsLoading || categoriesLoading) return <Loading />;

  // Filter products based on selected category and search term
  const filteredProducts = productsData?.products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category?.name === selectedCategory;
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <div>
      <section className="pb-5">
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
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Search products by name"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-56 p-2 border border-gray-300"
          />
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelectProduct}
              />
            ))}
          </section>
        </div>
        <div>
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
        onOpenChange={() => setIsOutOfStockModalOpen}
        title={'Out of Stock'}
        desc={`${outOfStockProduct} is out of stock and cannot be added to the cart.`}
        onClick={() => setIsOutOfStockModalOpen(false)}
        button="Close"
      />

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent>
          <DialogHeader className="flex items-center">
            <DialogDescription>
              <img
                src="/buy.gif"
                alt="checkmark"
                className="h-[200px] w-[200px]"
              />
              <DialogTitle className="text-xl text-gray-900 pt-2">
                Transaction Successful
              </DialogTitle>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-0">
            <DialogClose asChild>
              <Button
                onClick={() => setIsSuccessModalOpen(false)}
                variant="brand"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POSPage;
