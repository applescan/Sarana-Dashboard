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
      className="group flex h-full cursor-pointer flex-col justify-between border-white/10 bg-card/80 transition hover:-translate-y-1 hover:border-primary/40"
      onClick={() => onSelect(product)}
    >
      <CardHeader className="flex flex-row items-center gap-3 text-secondary-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-primary-foreground">
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <CardTitle className="text-left text-2xl text-primary-foreground">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-secondary-foreground/80">
        <p className="leading-relaxed">
          <span className="text-secondary-foreground">Description:</span>{' '}
          {product.description}
        </p>
        <p className="font-semibold text-primary-foreground">
          Price: IDR {product.sellPrice.toLocaleString()}
        </p>
        <p className="text-muted">Stock: {product.stock}</p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
