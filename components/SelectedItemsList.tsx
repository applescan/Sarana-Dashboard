import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Product } from '@/lib/types/types';
import { Input } from './ui/Input';
import Button from './ui/Button';
import { IoIosCloseCircleOutline } from "react-icons/io";

type SelectedItemsListProps = {
    selectedItems: Record<string, number>;
    products: Product[];
    onQuantityChange: (productId: string, quantity: number) => void;
    onRecordItemsSold: () => void;
    onRemoveItem: (productId: string) => void;
};

const SelectedItemsList: React.FC<SelectedItemsListProps> = ({ selectedItems, products, onQuantityChange, onRecordItemsSold, onRemoveItem }) => {
    const subtotal = Object.entries(selectedItems).reduce((total, [productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return total + (product ? product.sellPrice * quantity : 0);
    }, 0);

    const handleQuantityChange = (productId: string, value: string) => {
        const quantity = parseInt(value);
        const product = products.find(p => p.id === productId);
        if (product && quantity <= product.stock) {
            onQuantityChange(productId, quantity);
        }
    };

    return (
        <Card className="sticky top-4 h-[82vh] flex flex-col bg-white border border-gray-300 text-gray-900 text-left cursor-pointer">
            <CardHeader>
                <CardTitle className='text-gray-900 text-left text-2xl mb-4'>Selected Items</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto items-center">
                {Object.keys(selectedItems).length === 0 ? (
                    <div className='my-auto flex h-full'>
                        <p className="text-left text-gray-400 text-sm font-light pt-10">No items selected</p>
                    </div>
                ) : (
                    Object.entries(selectedItems).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;
                        return (
                            <div key={productId} className="mb-4 text-gray-900 text-left text-xl flex items-center justify-between">
                                <div className='flex flex-col w-full'>
                                    <div className='flex justify-between'>
                                        <p className='text-base'>{product.name}</p>
                                        <button onClick={() => onRemoveItem(productId)} className="ml-4 text-gray-400">
                                            <IoIosCloseCircleOutline />
                                        </button>
                                    </div>
                                    <div className='flex gap-2 justify-between items-center'>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(productId, e.target.value)}
                                            max={product.stock}
                                            min={1}
                                            className="border w-1/2 h-8"
                                        />
                                        <p className="text-gray-900 text-base">IDR {(product.sellPrice * quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </CardContent>
            <CardFooter className="sticky bottom-0 bg-white p-4 border-t">
                <div className='flex flex-col w-full'>
                    <div className="mt-4 text-left">
                        <p className="font-bold text-left text-gray-900 text-xl">Subtotal:</p>
                        <p className="text-3xl text-left text-gray-900">IDR {subtotal.toLocaleString()}</p>
                    </div>
                    <Button onClick={onRecordItemsSold} className="mt-4 w-full bg-primary" disabled={!Object.keys(selectedItems).length}>Proceed</Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default SelectedItemsList;
