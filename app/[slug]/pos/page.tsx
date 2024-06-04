'use client'
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Category, Product } from '@/lib/types/types';
import { RECORD_ITEMS_SOLD, RECORD_REVENUE } from '@/graphql/mutations';
import { GET_CATEGORIES, GET_PRODUCTS } from '@/graphql/queries';
import ProductCard from '@/components/ProductCard';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const POSPage = () => {
    const { data: productsData, loading: productsLoading, error: productsError, refetch: productRefetch } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
    const { data: categoriesData, loading: categoriesLoading, error: categoriesError, refetch: categoriesRefetch } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);
    const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});


    useEffect(() => {
        if (productsError) {
            console.error('Error fetching product data:', productsError);
        }
    }, [productsError]);

    const [recordItemsSold] = useMutation(RECORD_ITEMS_SOLD);
    const [recordRevenue] = useMutation(RECORD_REVENUE);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>('All'); // Default to "All"

    // Function to handle product selection and record item sold
    const handleSelectProduct = async (product: Product) => {
        setSelectedProduct(product);

        const itemsSold = Object.entries(selectedItems).map(([productId, quantity]) => ({
            productId,
            quantity,
        }));

        await recordItemsSold({ variables: { itemsSold } });

        const newSelectedItems = { ...selectedItems };
        newSelectedItems[product.id] = (newSelectedItems[product.id] || 0) + 1;
        setSelectedItems(newSelectedItems);

        // Optionally, update revenue
        const currentDate = new Date().toISOString();
        const newRevenue = { amount: product.sellPrice * quantity, date: currentDate };
        await recordRevenue({ variables: { revenue: [newRevenue] } });
    };


    // Function to handle category selection
    const handleSelectCategory = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    if (productsLoading || categoriesLoading) return <p>Loading...</p>;

    // Filter products based on selected category
    const filteredProducts = selectedCategory && selectedCategory !== 'All'
        ? productsData?.products.filter(product => product.category?.name === selectedCategory)
        : productsData?.products;

    return (
        <div>
            <section className='pb-5'>
                <div className="flex flex-wrap gap-2">
                    <Badge
                        key="all"
                        variant={selectedCategory === 'All' ? "default" : "secondary"}
                        onClick={() => handleSelectCategory('All')}
                    >
                        All
                    </Badge>
                    {categoriesData?.categories.map(category => (
                        <Badge
                            key={category.id}
                            variant={selectedCategory === category.name ? "default" : "secondary"}
                            onClick={() => handleSelectCategory(category.name)}
                        >
                            {category.name}
                        </Badge>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 pt-4">
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts?.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={handleSelectProduct} />
                    ))}
                </section>

                <div>
                    <section>
                        <h2>Selected Items</h2>
                        {Object.entries(selectedItems).map(([productId]) => (
                            <div key={productId}>
                                <p>{productsData?.products.find(p => p.id === productId)?.name}</p>
                                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                            </div>
                        ))}
                    </section>

                    <section>
                        <Button onClick={() => handleSelectProduct(selectedProduct!)}>Record Items Sold</Button>
                    </section>

                    <section>
                        <h2>Record Revenue</h2>
                        <input type="number" placeholder="Amount" value={selectedProduct ? selectedProduct.sellPrice * quantity : 0} readOnly />
                        <input type="datetime-local" placeholder="Date" value={new Date().toISOString().substring(0, 16)} readOnly />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default POSPage;
