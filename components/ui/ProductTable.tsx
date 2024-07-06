import React, { useState, FC, ChangeEvent } from "react";
import { useMutation } from "@apollo/client";
import { Product, Category } from "@/lib/types/types";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DELETE_PRODUCTS, UPDATE_PRODUCTS } from "@/graphql/mutations";
import { MdEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import { IoSaveSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
} from "./Select";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, boolean>
  >({});
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState<string>("");
  const [editProductDescription, setEditProductDescription] =
    useState<string>("");
  const [editProductBuyPrice, setEditProductBuyPrice] = useState<number>(0);
  const [editProductSellPrice, setEditProductSellPrice] = useState<number>(0);
  const [editProductCategory, setEditProductCategory] = useState<string>("");

  const [updateProducts] = useMutation(UPDATE_PRODUCTS);
  const [deleteProducts] = useMutation(DELETE_PRODUCTS);

  const filteredProducts = data.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category?.name === selectedCategory;
    const matchesSearchTerm = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

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
    setEditProductDescription(product.description);
    setEditProductBuyPrice(product.buyPrice);
    setEditProductSellPrice(product.sellPrice);
    setEditProductCategory(product.category?.name || "");
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
              buyPrice: editProductBuyPrice,
              sellPrice: editProductSellPrice,
            },
          ],
        },
      });
      setEditProductId(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
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
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    const idsToDelete = Object.keys(selectedProducts).filter(
      (id) => selectedProducts[id],
    );
    try {
      await deleteProducts({
        variables: { ids: idsToDelete },
      });
      setSelectedProducts({});
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  const getCellValue = (
    product: Product,
    accessor: string,
  ): React.ReactNode => {
    const keys = accessor.split(".");
    let value: any = product;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return "";
      }
    }
    if (
      typeof value === "number" &&
      (accessor === "buyPrice" || accessor === "sellPrice")
    ) {
      return `IDR ${value.toLocaleString()}`;
    }
    return typeof value === "object" ? JSON.stringify(value) : value;
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
            variant={selectedCategory === "All" ? "default" : "secondary"}
            onClick={() => handleSelectCategory("All")}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategory === category.name ? "default" : "secondary"
              }
              onClick={() => handleSelectCategory(category.name)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </section>

      <Input
        type="text"
        placeholder="Search products by name"
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="w-56 p-2 border border-gray-300 mb-4"
      />

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Select
            </th>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="py-2 px-4 border-b border-gray-200 text-left"
              >
                {column.Header}
              </th>
            ))}
            <th className="py-2 px-4 border-b border-gray-200 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={!!selectedProducts[product.id]}
                  onChange={() => handleCheckboxChange(product.id)}
                />
              </td>
              {columns.map((column) => (
                <td
                  key={column.accessor}
                  className="py-2 px-4 border-b border-gray-200"
                >
                  {column.accessor === "name" &&
                  editProductId === product.id ? (
                    <Input
                      type="text"
                      value={editProductName}
                      onChange={(e) => setEditProductName(e.target.value)}
                      className="border w-full"
                    />
                  ) : column.accessor === "description" &&
                    editProductId === product.id ? (
                    <Input
                      type="text"
                      value={editProductDescription}
                      onChange={(e) =>
                        setEditProductDescription(e.target.value)
                      }
                      className="border w-full"
                    />
                  ) : column.accessor === "buyPrice" &&
                    editProductId === product.id ? (
                    <Input
                      type="number"
                      value={editProductBuyPrice}
                      onChange={(e) =>
                        setEditProductBuyPrice(Number(e.target.value))
                      }
                      className="border w-full"
                    />
                  ) : column.accessor === "sellPrice" &&
                    editProductId === product.id ? (
                    <Input
                      type="number"
                      value={editProductSellPrice}
                      onChange={(e) =>
                        setEditProductSellPrice(Number(e.target.value))
                      }
                      className="border w-full"
                    />
                  ) : column.accessor === "category.name" &&
                    editProductId === product.id ? (
                    <Select
                      onValueChange={(value) => setEditProductCategory(value)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={editProductCategory || "Select Category"}
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
              <td className="py-2 px-4 border-b border-gray-200">
                {editProductId === product.id ? (
                  <div>
                    <Button
                      onClick={handleSaveProduct}
                      variant="outline-primary"
                      className="border border-transparent hover:bg-transparent hover:text-gray-400"
                    >
                      <IoSaveSharp className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline-primary"
                      className="border border-transparent hover:bg-transparent hover:text-gray-400"
                    >
                      <IoMdClose className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={() => handleEditProduct(product)}
                      variant="outline-primary"
                      className="border border-transparent hover:bg-transparent hover:text-gray-400"
                    >
                      <MdEdit className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      variant="outline-primary"
                      className="border border-transparent hover:bg-transparent hover:text-gray-400"
                    >
                      <FaTrashCan className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        onClick={handleDeleteSelectedProducts}
        disabled={!hasSelectedProducts}
        variant="primary"
      >
        Delete Selected
      </Button>
    </div>
  );
};

export default ProductTable;
