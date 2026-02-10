import React, { ChangeEvent, FC } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import Button from './ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/Card';
import { Input } from './ui/Input';
import { Product } from '@/lib/types/types';
import { formatNumberWithCommas } from '@/lib/utils';

type SelectedItemsListProps = {
  selectedItems: Record<string, number>;
  products: Product[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRecordItemsSold: () => void;
  onRemoveItem: (productId: string) => void;
  amountPaid: string;
  onAmountPaidChange: (value: string) => void;
  returnMoney: number;
  subtotal: number;
};

const SelectedItemsList: FC<SelectedItemsListProps> = ({
  selectedItems,
  products,
  onQuantityChange,
  onRecordItemsSold,
  onRemoveItem,
  amountPaid,
  onAmountPaidChange,
  returnMoney,
  subtotal,
}) => {
  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value);
    const product = products.find((p) => p.id === productId);
    if (product && quantity <= product.stock) {
      onQuantityChange(productId, quantity);
    }
  };

  const handleAmountPaidChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(parseFloat(value)) || value === '') {
      onAmountPaidChange(value);
    }
  };

  return (
    <Card className="flex min-h-[60vh] flex-col border-white/10 bg-card/90 text-secondary-foreground sm:min-h-[70vh] lg:sticky lg:top-24 lg:min-h-[92vh] lg:max-h-[100vh]">
      <CardHeader>
        <CardTitle className="mb-4 text-left text-2xl text-primary-foreground">
          Selected Items
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {Object.keys(selectedItems).length === 0 ? (
          <div className="my-auto flex h-full items-center justify-center">
            <p className="text-center text-sm text-muted">No items selected</p>
          </div>
        ) : (
          Object.entries(selectedItems).map(([productId, quantity]) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return null;
            return (
              <div
                key={productId}
                className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-base"
              >
                <div className="flex w-full flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary-foreground">
                      {product.name}
                    </p>
                    <button
                      onClick={() => onRemoveItem(productId)}
                      className="ml-4 text-muted transition hover:text-red-400"
                    >
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(productId, e.target.value)
                      }
                      max={product.stock}
                      min={1}
                      className="w-1/2 border-white/20 bg-transparent"
                    />
                    <p className="text-base text-secondary-foreground">
                      IDR {(product.sellPrice * quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="border-t border-white/10 bg-card/80 lg:sticky lg:bottom-0">
        <div className="flex w-full flex-col gap-4">
          <div className="text-left py-4">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">
              Subtotal
            </p>
            <p className="text-3xl font-semibold text-primary-foreground">
              IDR {subtotal.toLocaleString()}
            </p>
          </div>
          <div className="text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-muted pb-2">
              Amount Paid
            </p>
            <Input
              type="text"
              value={formatNumberWithCommas(amountPaid)}
              onFocus={(e) => {
                if (e.target.value === '0') {
                  e.target.value = '';
                }
              }}
              onChange={handleAmountPaidChange}
              className="h-12 w-full text-lg"
            />
          </div>
          <div className="text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-muted">
              Return Money
            </p>
            <p className="text-2xl text-secondary-foreground">
              IDR {returnMoney.toLocaleString()}
            </p>
          </div>
          <Button
            onClick={onRecordItemsSold}
            variant="brand"
            disabled={
              !Object.keys(selectedItems).length ||
              parseFloat(amountPaid.replace(/,/g, '')) < subtotal
            }
            className="mt-2"
          >
            Proceed
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SelectedItemsList;
