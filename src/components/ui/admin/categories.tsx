"use client";
import React, { useMemo, useState } from "react";
import {
  Tags,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
  Package,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useOverview } from "@/actions";
import Typography from "@/components/typography";

const CategoriesSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: "",
    name: "",
    slug: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState({
    id: "",
    name: "",
    slug: "",
  });
  const { overview } = useOverview();

  const filteredCategories = useMemo(() => {
    if (!overview || !overview.categories.distribution) return [];
    return overview.categories.distribution.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [overview, searchQuery]);

  const handleAddCategory = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsAddDialogOpen(false);
    setNewCategory({ id: "", name: "", slug: "" });
  };

  const handleEditCategory = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsEditDialogOpen(false);
    setEditingCategory({ id: "", name: "", slug: "" });
  };

  const handleDeleteCategory = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (category: {
    id: string;
    name: string;
    slug: string;
  }) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
    setIsEditDialogOpen(true);
  };

  const CategoryForm = ({
    category,
    setCategory,
    isEdit = false,
  }: {
    category: { id: string; name: string; slug: string };
    setCategory: React.Dispatch<
      React.SetStateAction<{ id: string; name: string; slug: string }>
    >;
    isEdit?: boolean;
  }) => (
    <form
      onSubmit={isEdit ? handleEditCategory : handleAddCategory}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          placeholder="Enter category name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={category.slug}
          onChange={(e) => setCategory({ ...category, slug: e.target.value })}
          placeholder="enter-slug-here"
        />
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h4">Categories</Typography>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for your products.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm category={newCategory} setCategory={setNewCategory} />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleAddCategory}>
                Save Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Tags className="h-6 w-6 text-blue-600" />
              <h3 className="font-poppins text-sm font-medium text-gray-600">
                Total Categories
              </h3>
            </div>
            <p className="mt-2 font-poppins text-2xl font-bold text-gray-600">
              {overview?.categories.total}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-green-600" />
              <h3 className="font-poppins text-sm font-medium text-gray-600">
                Total Products
              </h3>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-600">
              {overview?.products.total}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search categories..."
              className="bg-white pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">
                Category Name
                <ArrowUpDown className="ml-2 inline h-4 w-4" />
              </TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug || ""}</TableCell>
                <TableCell>{category.count}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() =>
                      handleEditClick({
                        ...category,
                        slug: category.slug || "",
                      })
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Modify the existing category details.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            setCategory={setEditingCategory}
            isEdit={true}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleEditCategory}>
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteCategory}>Delete Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { CategoriesSection };
