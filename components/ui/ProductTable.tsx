import React, { useState, ReactNode, FC, ChangeEvent } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Product, Category } from "@/lib/types/types";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DELETE_PRODUCTS, UPDATE_PRODUCTS } from "@/graphql/mutations";

interface Column {
  Header: string;
  accessor: keyof Product | string;
}

interface ProductTableProps {
  columns: Column[];
  data: Product[];
  categories: Category[];
}

const ProductTable: FC<ProductTableProps> = ({ columns, data, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, boolean>
  >({});
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState<string>("");

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
  };

  const handleSaveProduct = async () => {
    try {
      await updateProducts({
        variables: {
          products: [{ id: editProductId, name: editProductName }],
        },
      });
      setEditProductId(null);
    } catch (error) {
      console.error("Error updating product:", error);
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

  const getCellValue = (product: Product, accessor: string): ReactNode => {
    const keys = accessor.split(".");
    let value: any = product;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return "";
      }
    }
    return typeof value === "object" ? JSON.stringify(value) : value;
  };

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
                  ) : (
                    getCellValue(product, column.accessor)
                  )}
                </td>
              ))}
              <td className="py-2 px-4 border-b border-gray-200">
                {editProductId === product.id ? (
                  <Button onClick={handleSaveProduct} className="bg-primary">
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEditProduct(product)}
                    className="bg-secondary"
                  >
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={handleDeleteSelectedProducts} className="bg-danger mt-4">
        Delete Selected
      </Button>
    </div>
  );
};

export default ProductTable;
