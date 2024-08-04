import { useMutation } from '@apollo/client';
import { Protect } from '@clerk/nextjs';
import React, { useState, FC, ChangeEvent } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';
import PosDialog from './PosDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from './ui/Select';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CREATE_ORDERS, DELETE_ORDERS } from '@/graphql/mutations';
import { GET_ORDERS } from '@/graphql/queries';
import { Order, Category, Product } from '@/lib/types/types';

export type Column = {
  Header: string;
  accessor: keyof Order | string;
};

export type OrderTableProps = {
  columns: Column[];
  data: Order[];
  categories: Category[];
  products: Product[];
};

const OrderTable: FC<OrderTableProps> = ({
  columns,
  data,
  categories,
  products,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number | string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => {});
  const [deleteOrders] = useMutation(DELETE_ORDERS, {
    refetchQueries: [{ query: GET_ORDERS }],
    onCompleted: () => showSuccessDialog('Order(s) deleted successfully!'),
  });
  const [createOrders] = useMutation(CREATE_ORDERS, {
    refetchQueries: [{ query: GET_ORDERS }],
    onCompleted: () => showSuccessDialog('Order added successfully!'),
  });

  const showSuccessDialog = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessDialogOpen(true);
  };

  const filteredOrders = data.filter((order) => {
    const matchesSearchTerm = order.orderItems.some((item) =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return matchesSearchTerm;
  });

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setOrderQuantity(value < 0 ? 0 : value);
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteAction(() => () => confirmDeleteOrder(orderId));
    setIsConfirmationDialogOpen(true);
  };

  const confirmDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrders({
        variables: { ids: [orderId] },
      });
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      setIsConfirmationDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleAddOrder = async () => {
    if (!selectedProduct || !orderQuantity) {
      console.error('Product and quantity are required');
      return;
    }

    const selectedProductDetails = products.find(
      (product) => product.id === selectedProduct,
    );
    const productPrice = selectedProductDetails?.buyPrice || 0;
    const totalAmount = productPrice * Number(orderQuantity);

    try {
      await createOrders({
        variables: {
          orders: [
            {
              totalAmount: totalAmount,
              orderItems: [
                {
                  productId: selectedProduct,
                  quantity: Number(orderQuantity),
                  price: productPrice,
                },
              ],
            },
          ],
        },
      });
      setSelectedProduct(null);
      setOrderQuantity('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const getCellValue = (order: Order, accessor: string): React.ReactNode => {
    if (accessor === 'orderItems.product.name') {
      return order.orderItems.map((item) => item.product.name).join(', ');
    }
    if (accessor === 'orderItems.quantity') {
      return order.orderItems.map((item) => item.quantity).join(', ');
    }
    const keys = accessor.split('.');
    let value: unknown = order;
    for (const key of keys) {
      if (typeof value === 'object' && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return '';
      }
    }

    if (typeof value === 'number' && accessor === 'totalAmount') {
      return `IDR ${value.toLocaleString()}`;
    }

    if (typeof value === 'string' && accessor === 'createdAt') {
      return new Date(parseInt(value)).toLocaleString();
    }

    return value as React.ReactNode;
  };

  return (
    <div>
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search orders by item name"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-56 p-2 border border-gray-300 mb-4"
          />
        </div>
        <Protect condition={(has) => has({ role: 'org:admin' })}>
          <Button
            variant="brand"
            onClick={() => setIsDialogOpen(true)}
            className="h-10 flex items-center gap-2"
          >
            <IoMdAdd />
            Add Order
          </Button>
        </Protect>
      </div>

      <PosDialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(false)}
        title="Add New Order"
        desc={
          <div className="flex flex-wrap gap-2 mb-4">
            <p className="pb-2 text-base">
              Fill in the details of the new order below.
            </p>
            <div className="w-56">
              <label className="block text-sm font-sm text-gray-700">
                Category
              </label>
              <Select onValueChange={(value) => handleSelectCategory(value)}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={selectedCategory || 'Select Category'}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton />
                  <SelectItem value="All">All</SelectItem>
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
                Product
              </label>
              <Select onValueChange={(value) => setSelectedProduct(value)}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={selectedProduct || 'Select Product'}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton />
                  {products
                    .filter(
                      (product) =>
                        selectedCategory === 'All' ||
                        product.category?.name === selectedCategory,
                    )
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  <SelectScrollDownButton />
                </SelectContent>
              </Select>
            </div>
            <div className="w-56">
              <label className="block text-sm font-sm text-gray-700">
                Quantity
              </label>
              <Input
                type="number"
                placeholder="Quantity"
                value={orderQuantity}
                onChange={handleQuantityChange}
                className="p-2 border border-gray-300"
              />
            </div>
          </div>
        }
        onClick={handleAddOrder}
        disableButton={!selectedProduct || !orderQuantity}
        button="Create"
      />

      <PosDialog
        open={isConfirmationDialogOpen}
        onOpenChange={() => setIsConfirmationDialogOpen(false)}
        title="Are you sure you want to delete this order?"
        desc="This action cannot be undone."
        onClick={deleteAction}
        button="Delete"
      />

      <PosDialog
        open={isSuccessDialogOpen}
        onOpenChange={() => setIsSuccessDialogOpen(false)}
        title="Success"
        desc={
          <div className="flex justify-center gap-y-2">
            <div>
              <img src="/done.svg" alt="Success Logo" className="h-40 w-40" />
              {successMessage}
            </div>
          </div>
        }
        onClick={() => setIsSuccessDialogOpen(false)}
        button={'Close'}
      />

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                {column.Header}
              </th>
            ))}
            <Protect condition={(has) => has({ role: 'org:admin' })}>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Actions
              </th>
            </Protect>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="py-2 px-4 border-b border-gray-200"
                >
                  {getCellValue(order, column.accessor)}
                </td>
              ))}
              <Protect condition={(has) => has({ role: 'org:admin' })}>
                <td className="py-2 px-4 border-b border-gray-200">
                  <div>
                    <Button
                      onClick={() => handleDeleteOrder(order.id.toString())}
                      variant="outline-primary"
                      className="border border-transparent hover:bg-gray-200 hover:text-gray-800"
                    >
                      <FaTrashCan className="h-5 w-5" />
                    </Button>
                  </div>
                </td>
              </Protect>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
