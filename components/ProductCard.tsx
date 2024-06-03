import React from 'react';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from './ui/Card';
import { Product } from '@/lib/types/types';

type ProductCardProps = {
    product: Product;
    onSelect: (product: Product) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
    return (
        <Card className='flex flex-col gap-5'>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{product.description}</CardDescription>
                <p>Price: ${product.sellPrice}</p>
                <p>Stock: {product.stock}</p>
                <button onClick={() => onSelect(product)}>Select</button>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
