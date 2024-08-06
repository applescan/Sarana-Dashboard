import React from 'react';
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

const SelectedItemsList: React.FC<SelectedItemsListProps> = ({
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

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ''); // Remove existing commas
    if (!isNaN(parseFloat(value)) || value === '') {
      onAmountPaidChange(value);
    }
  };

  return (
    <Card className="sticky top-4 h-[90vh] flex flex-col bg-white border border-gray-300 text-gray-900 text-left cursor-pointer">
      <CardHeader>
        <CardTitle className="text-gray-900 text-left text-2xl mb-4">
          Selected Items
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto items-center">
        {Object.keys(selectedItems).length === 0 ? (
          <div className="my-auto flex h-full">
            <p className="text-left text-gray-400 text-sm font-light pt-10">
              No items selected
            </p>
          </div>
        ) : (
          Object.entries(selectedItems).map(([productId, quantity]) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return null;
            return (
              <div
                key={productId}
                className="mb-4 text-gray-900 text-left text-xl flex items-center justify-between"
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <p className="text-base">{product.name}</p>
                    <button
                      onClick={() => onRemoveItem(productId)}
                      className="ml-4 text-gray-400"
                    >
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                  <div className="flex gap-2 justify-between items-center">
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(productId, e.target.value)
                      }
                      max={product.stock}
                      min={1}
                      className="border w-1/2 h-8"
                    />
                    <p className="text-gray-900 text-base">
                      IDR {(product.sellPrice * quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="sticky bottom-0 bg-white p-4 border-t">
        <div className="flex flex-col w-full">
          <div className="mt-4 text-left">
            <p className="font-bold text-left text-gray-900 text-lg">
              Subtotal:
            </p>
            <p className="text-xl text-left text-gray-900">
              IDR {subtotal.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 text-left">
            <p className="font-bold text-left text-gray-900 text-lg">
              Amount Paid:
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
              className="border w-full h-8 text-gray-900 text-lg"
            />
          </div>
          <div className="mt-4 text-left">
            <p className="font-bold text-left text-gray-900 text-lg">
              Return Money:
            </p>
            <p className="text-xl text-left text-gray-900">
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
          >
            Proceed
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SelectedItemsList;
