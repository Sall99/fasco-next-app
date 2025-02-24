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
import {
  useCreateCategory,
  useDeleteCategory,
  useOverview,
  useUpdateCategory,
} from "@/actions";
import Typography from "@/components/typography";
import { toast, Toaster } from "sonner";

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const CategoryForm = ({
  category,
  setCategory,
  isEdit = false,
  handleEditCategory,
  handleAddCategory,
}: {
  category: { id: string; name: string; slug: string };
  setCategory: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; slug: string }>
  >;
  isEdit?: boolean;
  handleEditCategory: (e: { preventDefault: () => void }) => void;
  handleAddCategory: (e: { preventDefault: () => void }) => void;
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
        required
        onChange={(e) => {
          const name = e.target.value;
          setCategory({ ...category, name, slug: generateSlug(name) });
        }}
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
  const [deletingCategory, setDeletingCategory] = useState({
    id: "",
    name: "",
    slug: "",
  });

  const { overview, mutate: refreshCategories } = useOverview();
  const createCategory = useCreateCategory;
  const updateCategory = useUpdateCategory;
  const deleteCategory = useDeleteCategory;

  const filteredCategories = useMemo(() => {
    if (!overview || !overview.categories.distribution) return [];
    return overview.categories.distribution.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [overview, searchQuery]);

  const handleAddCategory = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      toast.promise(createCategory(newCategory), {
        loading: `Creating ${newCategory.name}...`,
        success: () => {
          setIsAddDialogOpen(false);
          setNewCategory({ id: "", name: "", slug: "" });
          refreshCategories();
          return `${newCategory.name} has been created successfully`;
        },
        error: (err) => {
          return `${err.response.data.error}`;
        },
      });
    } catch (error) {
      console.error("Error in create operation:", error);
    }
  };

  const handleEditCategory = async (
    e: { preventDefault: () => void },
    productId: string,
  ) => {
    e.preventDefault();
    toast.promise(updateCategory(editingCategory, productId), {
      loading: `Updating ${editingCategory.name}...`,
      success: () => {
        setDeleteDialogOpen(false);
        refreshCategories();
        return `${editingCategory.name} has been updated successfully`;
      },
      error: (err) => {
        return `${err.response.data.error}`;
      },
    });
  };

  const handleDeleteCategory = () => {
    toast.promise(deleteCategory(deletingCategory.id), {
      loading: `Deleting ${deletingCategory.name}...`,
      success: () => {
        setDeleteDialogOpen(false);
        setDeletingCategory({ id: "", name: "", slug: "" });
        refreshCategories();
        return `${deletingCategory.name} has been deleted successfully`;
      },
      error: (err) => {
        return `${err.response.data.error}`;
      },
    });
  };

  const handleDeleteClick = (category: {
    id: string;
    name: string;
    slug: string;
  }) => {
    setDeletingCategory({
      id: category.id,
      name: category.name,
      slug: category.slug || "",
    });
    setDeleteDialogOpen(true);
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
            <CategoryForm
              category={newCategory}
              setCategory={setNewCategory}
              handleEditCategory={(e) =>
                handleEditCategory(e, editingCategory.id)
              }
              handleAddCategory={handleAddCategory}
            />
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
                    onClick={() =>
                      handleDeleteClick({
                        ...category,
                        slug: category.slug || "",
                      })
                    }
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
            handleEditCategory={(e) =>
              handleEditCategory(e, editingCategory.id)
            }
            isEdit={true}
            handleAddCategory={handleAddCategory}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={(e) => handleEditCategory(e, editingCategory.id)}
            >
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
      <Toaster richColors />
    </div>
  );
};

export { CategoriesSection };
