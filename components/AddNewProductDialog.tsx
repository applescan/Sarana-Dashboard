import { FC } from 'react';
import PosDialog from './PosDialog';
import { Input } from './ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from './ui/Select';

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  description: string;
  categories: { id: number; name: string }[];
  productName: string;
  productCategory: string;
  productBuyPrice: string;
  productSellPrice: string;
  productDescription: string;
  onProductNameChange: (value: string) => void;
  onProductCategoryChange: (value: string) => void;
  onProductBuyPriceChange: (value: string) => void;
  onProductSellPriceChange: (value: string) => void;
  onProductDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  submitButtonLabel: string;
}

const ProductFormDialog: FC<ProductFormDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  categories,
  productName,
  productCategory,
  productBuyPrice,
  productSellPrice,
  productDescription,
  onProductNameChange,
  onProductCategoryChange,
  onProductBuyPriceChange,
  onProductSellPriceChange,
  onProductDescriptionChange,
  onSubmit,
  isSubmitDisabled,
  submitButtonLabel,
}) => {
  return (
    <PosDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      desc={
        <div className="flex flex-wrap gap-2 mb-4">
          <p className="pb-2 text-base">{description}</p>
          <div className="w-56">
            <label className="block text-sm font-sm text-gray-700">
              Product Name
            </label>
            <Input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => onProductNameChange(e.target.value)}
              className="p-2 border border-gray-300"
            />
          </div>
          <div className="w-56">
            <label className="block text-sm font-sm text-gray-700">
              Category
            </label>
            <Select onValueChange={onProductCategoryChange}>
              <SelectTrigger>
                <SelectValue
                  placeholder={productCategory || 'Select Category'}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectScrollUpButton />
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectScrollDownButton />
              </SelectContent>
            </Select>
          </div>
          <div className="w-56">
            <label className="block text-sm font-sm text-gray-700">
              Buy Price
            </label>
            <Input
              type="number"
              placeholder="Buy Price"
              value={productBuyPrice}
              onChange={(e) => onProductBuyPriceChange(e.target.value)}
              className="p-2 border border-gray-300"
            />
          </div>
          <div className="w-56">
            <label className="block text-sm font-sm text-gray-700">
              Sell Price
            </label>
            <Input
              type="number"
              placeholder="Sell Price"
              value={productSellPrice}
              onChange={(e) => onProductSellPriceChange(e.target.value)}
              className="p-2 border border-gray-300"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-sm text-gray-700">
              Product Description
            </label>
            <Input
              type="text"
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => onProductDescriptionChange(e.target.value)}
              className="p-2 border border-gray-300"
            />
          </div>
        </div>
      }
      onClick={onSubmit}
      disableButton={isSubmitDisabled}
      button={submitButtonLabel}
    />
  );
};

export default ProductFormDialog;
