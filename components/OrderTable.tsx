import { useMutation } from '@apollo/client';
import { Protect } from '@clerk/nextjs';
import React, { useState, FC, ChangeEvent, ReactNode } from 'react';
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
import {
  CREATE_ORDERS,
  DELETE_ORDERS,
  MARK_ORDER_AS_RECEIVED,
} from '@/graphql/mutations';
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
  startDate: string | undefined;
  endDate: string | undefined;
};

const OrderTable: FC<OrderTableProps> = ({
  columns,
  data,
  categories,
  products,
  startDate,
  endDate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number | string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteAction, setDeleteAction] = useState<() => void>(() => {});
  const [deleteOrders] = useMutation(DELETE_ORDERS, {
    refetchQueries: [
      {
        query: GET_ORDERS,
        variables: { startDate, endDate },
      },
    ],
    onCompleted: () => showSuccessDialog('Order(s) deleted successfully!'),
  });
  const [createOrders] = useMutation(CREATE_ORDERS, {
    refetchQueries: [
      {
        query: GET_ORDERS,
        variables: { startDate, endDate },
      },
    ],
    onCompleted: () => showSuccessDialog('Order added successfully!'),
  });
  const [markOrderAsReceived] = useMutation(MARK_ORDER_AS_RECEIVED, {
    refetchQueries: [
      {
        query: GET_ORDERS,
        variables: { startDate, endDate },
      },
    ],
    onCompleted: () => showSuccessDialog('Order marked as received!'),
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const confirmDeleteOrder = async (orderId: number) => {
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
              totalAmount,
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

  const handleDeleteOrder = async (orderId: number) => {
    setOrderToDelete(orderId);
    setDeleteAction(() => () => confirmDeleteOrder(orderId));
    setIsConfirmationDialogOpen(true);
  };

  const handleMarkOrderAsReceived = async (orderId: number) => {
    try {
      await markOrderAsReceived({
        variables: { orderId },
      });
    } catch (error) {
      console.error('Error marking order as received:', error);
    }
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setOrderQuantity(value < 0 ? 0 : value);
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const getCellValue = (order: Order, accessor: string): ReactNode => {
    if (accessor === 'orderItems.product.name') {
      return order.orderItems.map((item) => item.product.name).join(', ');
    }
    if (accessor === 'orderItems.quantity') {
      return order.orderItems.map((item) => item.quantity).join(', ');
    }
    if (accessor === 'status') {
      return (
        <span
          className={`badge ${order.status === 'RECEIVED' ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {order.status}
        </span>
      );
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

    return value as ReactNode;
  };

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search orders by item name"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="w-full sm:w-56 p-2 border border-gray-300 mb-4 sm:mb-0"
        />
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
          <div className="flex flex-col gap-2 mb-4">
            <p className="pb-2 text-base">
              Fill in the details of the new order below.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <div className="w-full sm:w-56">
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
              <div className="w-full sm:w-56">
                <label className="block text-sm font-sm text-gray-700">
                  Product
                </label>
                <Select
                  onValueChange={(value) => setSelectedProduct(value)}
                  value={selectedProduct || ''}
                >
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
                          product.category.name === selectedCategory,
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
            </div>
            <div>
              <label className="block text-sm font-sm text-gray-700">
                Quantity
              </label>
              <Input
                type="number"
                value={orderQuantity}
                onChange={handleQuantityChange}
                placeholder="Enter quantity"
                className="w-full sm:w-56 p-2 border border-gray-300"
              />
            </div>
          </div>
        }
        onClick={handleAddOrder}
        disableButton={!selectedProduct || !orderQuantity}
        button="Create"
      />

      <PosDialog
        open={isSuccessDialogOpen}
        onOpenChange={() => setIsSuccessDialogOpen(false)}
        title="Success"
        desc={<p>{successMessage}</p>}
        onClick={() => setIsSuccessDialogOpen(false)}
        button={'Close'}
      />

      <PosDialog
        open={isConfirmationDialogOpen}
        onOpenChange={() => setIsConfirmationDialogOpen(false)}
        title="Are you sure you want to delete this order?"
        desc="This action cannot be undone."
        onClick={deleteAction}
        button="Delete"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              {columns.map((column) => (
                <th
                  key={column.Header}
                  className="p-2 border-b border-gray-300"
                >
                  {column.Header}
                </th>
              ))}
              <th className="p-2 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-2 text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  {columns.map((column) => (
                    <td
                      key={column.accessor}
                      className="px-4 border-b border-gray-200"
                    >
                      {getCellValue(order, column.accessor)}
                    </td>
                  ))}
                  <td className="p-3 border-b border-gray-200 flex gap-2 justify-between">
                    <Protect condition={(has) => has({ role: 'org:admin' })}>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1"
                      >
                        <FaTrashCan />
                      </Button>
                    </Protect>
                    <Button
                      onClick={() => handleMarkOrderAsReceived(order.id)}
                      variant="outline-primary"
                      className="border border-transparent hover:bg-gray-200 hover:text-gray-800 w-[170px]"
                      disabled={order.status === 'RECEIVED'}
                    >
                      {order.status === 'RECEIVED'
                        ? 'Received'
                        : 'Mark as Received'}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
