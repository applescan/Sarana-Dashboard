import { useMutation } from '@apollo/client';
import { Protect } from '@clerk/nextjs';
import React, { useState, FC, ChangeEvent, SetStateAction } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import { IoSaveSharp } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
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
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CREATE_PRODUCTS,
  DELETE_PRODUCTS,
  UPDATE_PRODUCTS,
} from '@/graphql/mutations';
import { GET_PRODUCTS } from '@/graphql/queries';
import { Product, Category } from '@/lib/types/types';

export type Column = {
  Header: string;
  accessor: keyof Product | string;
};

export type ProductTableProps = {
  columns: Column[];
  data: Product[];
  categories: Category[];
};

const ProductTable: FC<ProductTableProps> = ({ columns, data, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, boolean>
  >({});
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState<string>('');
  const [editProductDescription, setEditProductDescription] =
    useState<string>('');
  const [editProductBuyPrice, setEditProductBuyPrice] = useState<
    number | string
  >('');
  const [editProductSellPrice, setEditProductSellPrice] = useState<
    number | string
  >('');
  const [editProductCategory, setEditProductCategory] = useState<string>('');

  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductDescription, setNewProductDescription] =
    useState<string>('');
  const [newProductBuyPrice, setNewProductBuyPrice] = useState<number | string>(
    '',
  );
  const [newProductSellPrice, setNewProductSellPrice] = useState<
    number | string
  >('');
  const [newProductCategory, setNewProductCategory] = useState<string>('');

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState<boolean>(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => {});

  const [updateProducts] = useMutation(UPDATE_PRODUCTS, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => showSuccessDialog('Product updated successfully!'),
  });
  const [deleteProducts] = useMutation(DELETE_PRODUCTS, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => showSuccessDialog('Product(s) deleted successfully!'),
  });
  const [createProducts] = useMutation(CREATE_PRODUCTS, {
    refetchQueries: [{ query: GET_PRODUCTS }],
    onCompleted: () => showSuccessDialog('Product added successfully!'),
  });

  const showSuccessDialog = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessDialogOpen(true);
  };

  const filteredProducts = data.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category?.name === selectedCategory;
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedProducts((prevSelectedProducts) => ({
      ...prevSelectedProducts,
      [productId]: !prevSelectedProducts[productId],
    }));
  };

  const handleEditProduct = (product: Product) => {
    setEditProductId(product.id);
    setEditProductName(product.name);
    setEditProductDescription(product.description || '');
    setEditProductBuyPrice(product.buyPrice);
    setEditProductSellPrice(product.sellPrice);
    setEditProductCategory(product.category?.name || '');
  };

  const handleCancelEdit = () => {
    setEditProductId(null);
  };

  const handleSaveProduct = async () => {
    try {
      await updateProducts({
        variables: {
          products: [
            {
              id: editProductId,
              name: editProductName,
              description: editProductDescription,
              buyPrice: Number(editProductBuyPrice),
              sellPrice: Number(editProductSellPrice),
            },
          ],
        },
      });
      setEditProductId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProductToDelete(productId);
    setDeleteAction(() => () => confirmDeleteProduct(productId));
    setIsConfirmationDialogOpen(true);
  };

  const confirmDeleteProduct = async (productId: string) => {
    try {
      await deleteProducts({
        variables: { ids: [productId] },
      });
      setSelectedProducts((prevSelectedProducts) => {
        const updatedSelectedProducts = { ...prevSelectedProducts };
        delete updatedSelectedProducts[productId];
        return updatedSelectedProducts;
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsConfirmationDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    setDeleteAction(() => confirmDeleteSelectedProducts);
    setIsConfirmationDialogOpen(true);
  };

  const confirmDeleteSelectedProducts = async () => {
    const idsToDelete = Object.keys(selectedProducts).filter(
      (id) => selectedProducts[id],
    );
    try {
      await deleteProducts({
        variables: { ids: idsToDelete },
      });
      setSelectedProducts({});
    } catch (error) {
      console.error('Error deleting products:', error);
    } finally {
      setIsConfirmationDialogOpen(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      await createProducts({
        variables: {
          products: [
            {
              name: newProductName,
              description: newProductDescription,
              buyPrice: Number(newProductBuyPrice),
              sellPrice: Number(newProductSellPrice),
              categoryId: categories.find(
                (category) => category.name === newProductCategory,
              )?.id,
              stock: 0,
            },
          ],
        },
      });
      setNewProductName('');
      setNewProductDescription('');
      setNewProductBuyPrice('');
      setNewProductSellPrice('');
      setNewProductCategory('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const getCellValue = (
    product: Product,
    accessor: string,
  ): React.ReactNode => {
    const keys = accessor.split('.');
    let value: unknown = product;
    for (const key of keys) {
      if (typeof value === 'object' && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return '';
      }
    }

    if (
      typeof value === 'number' &&
      (accessor === 'buyPrice' || accessor === 'sellPrice')
    ) {
      return `IDR ${value.toLocaleString()}`;
    }

    return value as React.ReactNode;
  };

  const hasSelectedProducts = Object.values(selectedProducts).some(
    (isSelected) => isSelected,
  );

  return (
    <div>
      <section className="pb-5">
        <div className="flex flex-wrap gap-2">
          <Badge
            key="all"
            variant={selectedCategory === 'All' ? 'default' : 'secondary'}
            onClick={() => handleSelectCategory('All')}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategory === category.name ? 'default' : 'secondary'
              }
              onClick={() => handleSelectCategory(category.name)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </section>

      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search products by name"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-56 p-2 border border-gray-300 mb-4"
          />
          <Protect condition={(has) => has({ role: 'org:admin' })}>
            <Button
              variant="brand"
              onClick={handleDeleteSelectedProducts}
              disabled={!hasSelectedProducts}
              className="h-10"
            >
              Delete Selected
            </Button>
          </Protect>
        </div>
        <Protect condition={(has) => has({ role: 'org:admin' })}>
          <Button
            variant="brand"
            onClick={() => setIsDialogOpen(true)}
            className="h-10 flex items-center gap-2"
          >
            <IoMdAdd />
            Add Product
          </Button>
        </Protect>
      </div>

      <PosDialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen(false)}
        title="Add New Product"
        desc={
          <div className="flex flex-wrap gap-2 mb-4">
            <p className="pb-2 text-base">
              Fill in the details of the new product below.
            </p>
            <div className="w-56">
              <label className="block text-sm font-sm text-gray-700">
                Product Name
              </label>
              <Input
                type="text"
                placeholder="Product Name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="p-2 border border-gray-300"
              />
            </div>
            <div className="w-56">
              <label className="block text-sm font-sm text-gray-700">
                Category
              </label>
              <Select onValueChange={(value) => setNewProductCategory(value)}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={newProductCategory || 'Select Category'}
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
                type="text"
                placeholder="Buy Price"
                value={newProductBuyPrice}
                onChange={(e) => setNewProductBuyPrice(e.target.value)}
                className="p-2 border border-gray-300"
              />
            </div>
            <div className="w-56">
              <label className="block text-sm font-sm text-gray-700">
                Sell Price
              </label>
              <Input
                type="text"
                placeholder="Sell Price"
                value={newProductSellPrice}
                onChange={(e) => setNewProductSellPrice(e.target.value)}
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
                value={newProductDescription}
                onChange={(e) => setNewProductDescription(e.target.value)}
                className="p-2 border border-gray-300"
              />
            </div>
          </div>
        }
        onClick={handleAddProduct}
        disableButton={
          !newProductName ||
          !newProductDescription ||
          !newProductBuyPrice ||
          !newProductSellPrice ||
          !newProductCategory
        }
        button="Create"
      />

      <PosDialog
        open={isConfirmationDialogOpen}
        onOpenChange={() => setIsConfirmationDialogOpen(false)}
        title="Are you sure you want to delete this product?"
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
            <Protect condition={(has) => has({ role: 'org:admin' })}>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Select
              </th>
            </Protect>
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
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <Protect condition={(has) => has({ role: 'org:admin' })}>
                <td className="py-2 px-4 border-b border-gray-200">
                  <input
                    type="checkbox"
                    checked={!!selectedProducts[product.id]}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                </td>
              </Protect>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="py-2 px-4 border-b border-gray-200"
                >
                  {column.accessor === 'name' &&
                  editProductId === product.id ? (
                    <Input
                      type="text"
                      value={editProductName}
                      onChange={(e) => setEditProductName(e.target.value)}
                      className="border w-full"
                    />
                  ) : column.accessor === 'description' &&
                    editProductId === product.id ? (
                    <Input
                      type="text"
                      value={editProductDescription}
                      onChange={(e) =>
                        setEditProductDescription(e.target.value)
                      }
                      className="border w-full"
                    />
                  ) : column.accessor === 'buyPrice' &&
                    editProductId === product.id ? (
                    <Input
                      type="number"
                      value={editProductBuyPrice}
                      onChange={(e) =>
                        setEditProductBuyPrice(Number(e.target.value))
                      }
                      className="border w-full"
                    />
                  ) : column.accessor === 'sellPrice' &&
                    editProductId === product.id ? (
                    <Input
                      type="number"
                      value={editProductSellPrice}
                      onChange={(e) =>
                        setEditProductSellPrice(Number(e.target.value))
                      }
                      className="border w-full"
                    />
                  ) : column.accessor === 'category.name' &&
                    editProductId === product.id ? (
                    <Select
                      onValueChange={(value: SetStateAction<string>) =>
                        setEditProductCategory(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={editProductCategory || 'Select Category'}
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
                  ) : (
                    getCellValue(product, column.accessor)
                  )}
                </td>
              ))}
              <Protect condition={(has) => has({ role: 'org:admin' })}>
                <td className="py-2 px-4 border-b border-gray-200">
                  {editProductId === product.id ? (
                    <div>
                      <Button
                        onClick={handleSaveProduct}
                        variant="outline-primary"
                        className="border border-transparent hover:bg-gray-200 hover:text-gray-800"
                      >
                        <IoSaveSharp className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline-primary"
                        className="border border-transparent hover:bg-gray-200 hover:text-gray-800"
                      >
                        <IoMdClose className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => handleEditProduct(product)}
                        variant="outline-primary"
                        className="border border-transparent hover:bg-gray-200 hover:text-gray-800"
                      >
                        <MdEdit className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product.id)}
                        variant="outline-primary"
                        className="border border-transparent hover:bg-gray-200 hover:text-gray-800"
                      >
                        <FaTrashCan className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </td>
              </Protect>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
