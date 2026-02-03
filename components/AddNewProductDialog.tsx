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
        <div className="mb-4 flex flex-wrap gap-3">
          <p className="pb-2 text-base text-secondary-foreground/80">
            {description}
          </p>
          <div className="w-52">
            <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-muted">
              Product Name
            </label>
            <Input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => onProductNameChange(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-muted">
              Category
            </label>
            <Select
              onValueChange={onProductCategoryChange}
              value={productCategory}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={productCategory || 'Select Category'}
                />
              </SelectTrigger>
              <SelectContent className="p-2">
                <SelectScrollUpButton />
                <div className="grid max-h-64 grid-cols-1 gap-1 sm:grid-cols-2">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.name}
                      className="justify-center text-center"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </div>
                <SelectScrollDownButton />
              </SelectContent>
            </Select>
          </div>
          <div className="w-52">
            <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-muted">
              Buy Price
            </label>
            <Input
              type="number"
              placeholder="Buy Price"
              value={productBuyPrice}
              onChange={(e) => onProductBuyPriceChange(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-muted">
              Sell Price
            </label>
            <Input
              type="number"
              placeholder="Sell Price"
              value={productSellPrice}
              onChange={(e) => onProductSellPriceChange(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label className="mb-2 block text-xs uppercase tracking-[0.35em] text-muted">
              Product Description
            </label>
            <Input
              type="text"
              placeholder="Product Description"
              value={productDescription}
              onChange={(e) => onProductDescriptionChange(e.target.value)}
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
