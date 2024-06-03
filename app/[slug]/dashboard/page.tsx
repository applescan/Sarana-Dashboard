'use client'
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Category, ItemsRestocked, ItemsSold, Order, OrderItem, Product, Revenue } from '@/lib/types/types';
import { CREATE_CATEGORIES, CREATE_ORDERS, CREATE_PRODUCTS, RECORD_ITEMS_RESTOCKED, RECORD_ITEMS_SOLD, RECORD_REVENUE } from '@/graphql/mutations';
import { GET_CATEGORIES, GET_DASHBOARD_DATA, GET_ORDERS, GET_PRODUCTS } from '@/graphql/queries';
import ProductCard from '@/components/ProductCard';

const POS = () => {
    const { data: dashboardData, loading: dashboardLoading } = useQuery<{ revenues: Revenue[], itemsSold: ItemsSold[], itemsRestocked: ItemsRestocked[] }>(GET_DASHBOARD_DATA);
    const { data: ordersData, loading: ordersLoading } = useQuery<{ orders: Order[] }>(GET_ORDERS);
    const { data: productsData, loading: productsLoading } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
    const { data: categoriesData, loading: categoriesLoading } = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

    const [createOrder] = useMutation(CREATE_ORDERS);
    const [createProduct] = useMutation(CREATE_PRODUCTS);
    const [createCategory] = useMutation(CREATE_CATEGORIES);
    const [recordItemsSold] = useMutation(RECORD_ITEMS_SOLD);
    const [recordRevenue] = useMutation(RECORD_REVENUE);
    const [recordItemsRestocked] = useMutation(RECORD_ITEMS_RESTOCKED);

    const [order, setOrder] = useState<OrderItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    // State for new product, category, items sold, items restocked, and revenue
    const [newProduct, setNewProduct] = useState({ name: '', description: '', buyPrice: 0, sellPrice: 0, stock: 0, categoryId: '' });
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [itemsSold, setItemsSold] = useState({ productId: '', quantity: 0 });
    const [itemsRestocked, setItemsRestocked] = useState({ productId: '', quantity: 0 });
    const [newRevenue, setNewRevenue] = useState({ amount: 0, date: '' });

    const handleAddToOrder = (product: Product) => {
        setOrder([...order, { id: 0, quantity, price: product.sellPrice, orderId: 0, order: {} as Order, productId: product.id, product, createdAt: '', updatedAt: '' }]);
        setQuantity(1);
    };

    const handleCreateOrder = async () => {
        const orderItems = order.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));
        await createOrder({ variables: { orders: [{ totalAmount: order.reduce((acc, item) => acc + item.price * item.quantity, 0) }] } });
        setOrder([]);
    };

    const handleCreateProduct = async () => {
        await createProduct({ variables: { products: [{ ...newProduct, categoryId: newProduct.categoryId ? parseInt(newProduct.categoryId) : undefined }] } });
        setNewProduct({ name: '', description: '', buyPrice: 0, sellPrice: 0, stock: 0, categoryId: '' });
    };

    const handleCreateCategory = async () => {
        await createCategory({ variables: { categories: [newCategory] } });
        setNewCategory({ name: '' });
    };

    const handleRecordItemsSold = async () => {
        await recordItemsSold({ variables: { itemsSold: [itemsSold] } });
        setItemsSold({ productId: '', quantity: 0 });
    };

    const handleRecordItemsRestocked = async () => {
        await recordItemsRestocked({ variables: { itemsRestocked: [itemsRestocked] } });
        setItemsRestocked({ productId: '', quantity: 0 });
    };

    const handleRecordRevenue = async () => {
        await recordRevenue({ variables: { revenue: [newRevenue] } });
        setNewRevenue({ amount: 0, date: '' });
    };

    if (dashboardLoading || ordersLoading || productsLoading || categoriesLoading) return <p>Loading...</p>;

    console.log(productsData)

    return (
        <div>
            <h1>Point of Sale System</h1>

            <section>
                <h2>Products</h2>
                <div className="grid grid-cols-3 gap-4">
                    {productsData?.products.map(product => (
                        <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
                    ))}
                </div>
                <div>
                    <h3>Create New Product</h3>
                    <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <input type="number" placeholder="Buy Price" value={newProduct.buyPrice} onChange={(e) => setNewProduct({ ...newProduct, buyPrice: parseFloat(e.target.value) })} />
                    <input type="number" placeholder="Sell Price" value={newProduct.sellPrice} onChange={(e) => setNewProduct({ ...newProduct, sellPrice: parseFloat(e.target.value) })} />
                    <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} />
                    <input type="text" placeholder="Category ID" value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })} />
                    <button onClick={handleCreateProduct}>Create Product</button>
                </div>
            </section>

            <section>
                <h2>Categories</h2>
                <ul>
                    {categoriesData?.categories.map(category => (
                        <li key={category.id}>{category.name}</li>
                    ))}
                </ul>
                <div>
                    <h3>Create New Category</h3>
                    <input type="text" placeholder="Name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
                    <button onClick={handleCreateCategory}>Create Category</button>
                </div>
            </section>

            {selectedProduct && (
                <section>
                    <h2>Add to Order</h2>
                    <p>{selectedProduct.name} - ${selectedProduct.sellPrice}</p>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                    />
                    <button onClick={() => handleAddToOrder(selectedProduct)}>Add to Order</button>
                </section>
            )}

            <section>
                <h2>Current Order</h2>
                <ul>
                    {order.map((item, index) => (
                        <li key={index}>
                            {item.product.name} - ${item.price} x {item.quantity}
                        </li>
                    ))}
                </ul>
                <button onClick={handleCreateOrder}>Create Order</button>
            </section>

            <section>
                <h2>Dashboard</h2>
                <p>Total Revenues: ${dashboardData?.revenues.reduce((acc, revenue) => acc + revenue.amount, 0)}</p>
                <p>Items Sold: {dashboardData?.itemsSold.reduce((acc, item) => acc + item.quantity, 0)}</p>
                <p>Items Restocked: {dashboardData?.itemsRestocked.reduce((acc, item) => acc + item.quantity, 0)}</p>
            </section>

            <section>
                <h2>Orders</h2>
                <ul>
                    {ordersData?.orders.map(order => (
                        <li key={order.id}>
                            Order #{order.id} - ${order.totalAmount}
                            <ul>
                                {order.orderItems.map(item => (
                                    <li key={item.id}>
                                        {item.product.name} - ${item.price} x {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default POS;
