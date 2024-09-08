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
    <Card className="w-full max-w-lg mx-auto sticky top-16 bg-white border border-gray-300 text-gray-900 text-left cursor-pointer">
      <CardHeader>
        <CardTitle className="text-gray-900 text-left text-xl md:text-2xl mb-4">
          Selected Items
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {Object.keys(selectedItems).length === 0 ? (
          <div className="my-auto flex h-full justify-center items-center">
            <p className="text-gray-400 text-sm font-light">
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
                className="mb-4 text-gray-900 text-left text-base md:text-xl flex flex-col md:flex-row items-center justify-between"
              >
                <div className="flex flex-col w-full md:flex-row items-center justify-between">
                  <div className="flex flex-col w-full md:w-3/4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm md:text-base">{product.name}</p>
                      <button
                        onClick={() => onRemoveItem(productId)}
                        className="ml-2 text-gray-400"
                      >
                        <IoIosCloseCircleOutline />
                      </button>
                    </div>
                    <div className="flex gap-2 justify-between items-center mt-2">
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(productId, e.target.value)
                        }
                        max={product.stock}
                        min={1}
                        className="border w-full md:w-1/2 h-8 text-sm md:text-base"
                      />
                      <p className="text-gray-900 text-sm md:text-base">
                        IDR {(product.sellPrice * quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
      <CardFooter className="bg-white p-4 border-t">
        <div className="flex flex-col w-full">
          <div className="mt-4 text-left">
            <p className="font-bold text-gray-900 text-base md:text-lg">
              Subtotal:
            </p>
            <p className="text-lg md:text-xl text-gray-900">
              IDR {subtotal.toLocaleString()}
            </p>
          </div>
          <div className="mt-4 text-left">
            <p className="font-bold text-gray-900 text-base md:text-lg">
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
              className="border w-full h-8 text-gray-900 text-base md:text-lg"
            />
          </div>
          <div className="mt-4 text-left">
            <p className="font-bold text-gray-900 text-base md:text-lg">
              Return Money:
            </p>
            <p className="text-lg md:text-xl text-gray-900">
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
            className="mt-4"
          >
            Proceed
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SelectedItemsList;
