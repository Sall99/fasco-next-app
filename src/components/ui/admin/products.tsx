"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategoryStats } from "@/actions";
import { useDashboardProducts } from "@/actions";
import Typography from "@/components/typography";

import { ProductType } from "@/types";
import { ProductModal } from "./product-modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Product",
  description = "Are you sure you want to delete this product? This action cannot be undone.",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="h5">{title}</Typography>
          </DialogTitle>
          <DialogDescription>
            <Typography variant="p-14">{description}</Typography>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProductsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const { categoryStats } = useCategoryStats();
  const { products } = useDashboardProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.name.toLowerCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleDeleteClick = (product: ProductType) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      // await deleteProduct(selectedProduct.id);
      console.log("Deleting product:", selectedProduct.id);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCreate = async (formData: ProductType) => {
    try {
      // await createProduct(formData);
      console.log("Creating product:", formData);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateClick = (product: ProductType) => {
    setSelectedProduct(product); // Set the selected product
    setUpdateModalOpen(true); // Open the update modal
  };

  const handleUpdate = async (formData: ProductType) => {
    if (!selectedProduct) return;
    try {
      // await updateProduct(selectedProduct.id, formData);
      console.log("Updating product:", selectedProduct.id, formData);
      setUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h4">Products</Typography>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              className="bg-white pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <p
                className={`${selectedCategory === "all" ? "font-poppins text-gray-500" : ""}`}
              >
                {selectedCategory}
              </p>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
              All Categories
            </DropdownMenuItem>
            {categoryStats?.distribution.map((category) => (
              <DropdownMenuItem
                key={category.name}
                onClick={() => setSelectedCategory(category.name.toLowerCase())}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">
                Product Name
                <ArrowUpDown className="ml-2 inline h-4 w-4" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <Typography variant="p-14">{product.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="p-14">
                    {product.category?.name ?? "Uncategorized"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="p-14">${product.price}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="p-14">
                    {product.stock?.quantity ?? 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="p-14">
                    <span
                      className={`rounded-full px-2 py-1 font-poppins text-xs ${
                        (product.stock?.quantity ?? 0) <= 5
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {(product.stock?.quantity ?? 0) <= 5
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </Typography>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => handleUpdateClick(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDeleteClick(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {categoryStats && (
        <ProductModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreate}
          initialData={undefined}
          categories={categoryStats}
        />
      )}

      {categoryStats && (
        <ProductModal
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          onSubmit={handleUpdate}
          initialData={selectedProduct || undefined}
          categories={categoryStats}
        />
      )}
    </div>
  );
};

export { ProductsSection };
