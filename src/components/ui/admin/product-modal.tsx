"use client";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/button";
import { Button as Btn } from "@/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  CategoriesType,
  CreateProductRequestInterface,
  ProductType,
} from "@/types";
import Typography from "@/components/typography";
import { useCreateProduct } from "@/actions/admin/product";
import { toast, Toaster } from "sonner";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ProductType>;
  onSubmit: (data: ProductType) => void;
  categories: CategoriesType;
}

const createProductPromise = (
  productData: ProductType | PromiseLike<ProductType>,
  onSubmit: (data: ProductType) => void,
  onClose: () => void,
  setIsLoading: (value: SetStateAction<boolean>) => void,
) =>
  new Promise<ProductType>((resolve, reject) => {
    const transformedData: CreateProductRequestInterface = {
      name: "then" in productData ? "" : productData.name,
      brand: "then" in productData ? "" : productData.brand,
      price: "then" in productData ? 0 : productData.price,
      description: "then" in productData ? "" : productData.description,
      tags: "then" in productData ? [] : productData.tags,
      images: "then" in productData ? [] : productData.images,
      category:
        "then" in productData
          ? { id: "", name: "", slug: "" }
          : productData.category,
      stock:
        "then" in productData
          ? { quantity: null, lowStockThreshold: null }
          : productData.stock || {
              quantity: 0,
              lowStockThreshold: 0,
            },
    };

    useCreateProduct(transformedData)
      .then(() => {
        if ("then" in productData) {
          productData.then((resolvedData) => {
            resolve(resolvedData);
            onSubmit(resolvedData);
            onClose();
          });
        } else {
          resolve(productData);
          onSubmit(productData);
          onClose();
        }
      })
      .catch((error) => {
        reject(error);
        console.error("Error creating product:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  });

export const ProductModal = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  categories,
}: ProductModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductType>>({
    name: "",
    brand: "",
    price: 0,
    description: "",
    tags: [],
    images: [],
    category: { id: "", name: "", slug: "" },
    stock: {
      quantity: 0,
      lowStockThreshold: 0,
    },
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        stock: initialData.stock || {
          quantity: 0,
          lowStockThreshold: 5,
        },
      });
    }
  }, [initialData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    if (formData.name && formData.price && formData.category) {
      const productData: ProductType = {
        id: initialData?.id || crypto.randomUUID(),
        name: formData.name,
        brand: formData.brand || "",
        price: formData.price,
        viewersCount: formData.viewersCount || 0,
        isAlmostSoldOut: formData.isAlmostSoldOut || false,
        tags: formData.tags || [],
        images: formData.images || [],
        description: formData.description || "",
        category: {
          ...formData.category,
          slug: formData.category?.slug || "",
        } as Required<ProductType>["category"],
        rating: formData.rating || null,
        stock: formData.stock || { quantity: 0, lowStockThreshold: 0 },
      };

      toast.promise(
        () =>
          createProductPromise(productData, onSubmit, onClose, setIsLoading),
        {
          loading: "Creating product...",
          success: (data) => `${data.name} has been created successfully`,
          error: "Failed to create product",
        },
      );
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-poppins text-sm font-medium text-primary-600">
                Product Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-poppins text-sm font-medium text-primary-600">
                Brand
              </label>
              <Input
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-poppins text-sm font-medium text-primary-600">
                Category
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Btn variant="outline" className="w-full justify-start">
                    <Typography variant="p-14">
                      {formData.category?.name || "Select Category"}
                    </Typography>
                  </Btn>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  {categories.distribution.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setFormData({ ...formData, category })}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <label className="font-poppins text-sm font-medium text-primary-600">
                Price
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-poppins text-sm font-medium text-primary-600">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="font-poppins text-sm font-medium text-primary-600">
              Stock Information
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={formData.stock?.quantity ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: {
                      ...formData.stock!,
                      quantity: parseInt(e.target.value),
                    },
                  })
                }
                placeholder="Quantity"
                min="0"
              />
              <Input
                type="number"
                value={formData.stock?.lowStockThreshold ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: {
                      ...formData.stock!,
                      lowStockThreshold: parseInt(e.target.value),
                    },
                  })
                }
                placeholder="Low Stock Threshold"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-poppins text-sm font-medium text-primary-600">
              Tags
            </label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
              />
              <Btn type="button" onClick={addTag}>
                Add
              </Btn>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags?.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 font-poppins text-sm text-primary-600"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-poppins text-sm font-medium text-primary-600">
              Images
            </label>
            <div className="grid grid-cols-5 gap-4">
              {formData.images?.map((image, index) => (
                <div key={index} className="group relative">
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    width={120}
                    height={120}
                    className="aspect-square rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 py-4 transition-colors hover:border-muted-foreground/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              color="destructive"
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {initialData ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Toaster richColors />
    </Dialog>
  );
};
