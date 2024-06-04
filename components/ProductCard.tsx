import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Product } from '@/lib/types/types';
import { FaWrench, FaLightbulb, FaPaintRoller, FaToolbox, FaRuler, FaHome, FaHammer, FaPlug, FaTint } from 'react-icons/fa';
import { GiWoodBeam } from "react-icons/gi";


type ProductCardProps = {
    product: Product;
    onSelect: (product: Product) => void;
};

// Mapping of category IDs to icons
const categoryIcons: Record<number, React.ComponentType<{ className?: string }>> = {
    1: GiWoodBeam,     // Lumber
    2: FaTint,       // Plumbing Supplies
    3: FaPlug,       // Electrical Supplies
    4: FaToolbox,     // Hand Tools
    5: FaWrench,      // Power Tools
    6: FaPaintRoller,   // Paint
    7: FaRuler,      // Flooring
    8: FaLightbulb,    // Lighting
    9: FaHome,       // Garden Supplies
    10: FaHammer      // Hardware
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
    const Icon = categoryIcons[product.category.id];

    return (
        <Card
            className='flex flex-col gap-5 bg-white border border-gray-300 text-gray-900 text-left p-0 cursor-pointer hover:bg-primary/5'
            onClick={() => onSelect(product)}>
            <CardHeader className='flex items-center gap-2 text-gray-300'>
                {Icon && <Icon className="h-10 w-10"></Icon>}
                <CardTitle className='text-gray-900 text-left text-2xl'>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className='text-gray-900'>
                <p className='text-gray-900'><span className='font-bold'>Desc:</span> {product.description}</p>
                <p><span className='font-bold'>Price:</span> IDR {product.sellPrice.toLocaleString()}</p>
                <p><span className='font-bold'>Stock:</span> {product.stock}</p>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
