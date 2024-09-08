import React, { ComponentType, FC } from 'react';
import {
  FaWrench,
  FaLightbulb,
  FaPaintRoller,
  FaToolbox,
  FaRuler,
  FaHome,
  FaHammer,
  FaPlug,
  FaTint,
} from 'react-icons/fa';
import { GiWoodBeam } from 'react-icons/gi';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Product } from '@/lib/types/types';

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
};

// Mapping of category IDs to icons
const categoryIcons: Record<number, ComponentType<{ className?: string }>> = {
  1: GiWoodBeam,
  2: FaTint,
  3: FaPlug,
  4: FaToolbox,
  5: FaWrench,
  6: FaPaintRoller,
  7: FaRuler,
  8: FaLightbulb,
  9: FaHome,
  10: FaHammer,
};

const ProductCard: FC<ProductCardProps> = ({ product, onSelect }) => {
  const Icon = categoryIcons[product.category.id];

  return (
    <Card
      className="flex flex-col max-h-[240px] gap-5 bg-white border border-gray-300 text-gray-900 text-left p-0 cursor-pointer hover:bg-primary/5"
      onClick={() => onSelect(product)}
    >
      <CardHeader className="flex items-center gap-2 text-gray-300">
        {Icon && <Icon className="h-10 w-10"></Icon>}
        <CardTitle className="text-gray-900 text-left text-2xl">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-900">
        <p className="text-gray-900">
          <span className="font-bold">Desc:</span> {product.description}
        </p>
        <p>
          <span className="font-bold">Price:</span> IDR{' '}
          {product.sellPrice.toLocaleString()}
        </p>
        <p>
          <span className="font-bold">Stock:</span> {product.stock}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
