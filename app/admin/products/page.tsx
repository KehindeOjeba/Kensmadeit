"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, MoreHorizontal, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string;
  stock: number;
  sku: string;
  description: string;
  images: string[];
  tags: string[];
  sizes?: string[];
  colors?: string[];
  isActive: boolean;
  categoryId: string;
  createdAt: string;
}

interface AdminProductFormData {
  name: string;
  sku: string;
  price: string;
  comparePrice: string;
  stock: string;
  description: string;
  categoryId: string;
  images: string;
  tags: string;
  sizes: string;
  colors: string;
}

const initialFormData: AdminProductFormData = {
  name: "",
  sku: "",
  price: "",
  comparePrice: "",
  stock: "",
  description: "",
  categoryId: "",
  images: "",
  tags: "",
  sizes: "39,40,41,42,43,44,45,46",
  colors: "Black,Brown,White,Blue,Red",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, low, out
  const [formData, setFormData] = useState<AdminProductFormData>(initialFormData);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/products?limit=1000");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.target.files;

  if (!files) return;

  const newPreviewUrls: string[] = [];
  const newImagePaths: string[] = [];

  Array.from(files).forEach((file) => {
    newPreviewUrls.push(URL.createObjectURL(file));

    newImagePaths.push(`/images/${file.name}`);
  });

  // Append previews
  setUploadedImages((prev) => [
    ...prev,
    ...newPreviewUrls,
  ]);

  // Append image paths
  setFormData((prev) => {
    const existingImages = prev.images
      ? prev.images.split(", ")
      : [];

    return {
      ...prev,
      images: [...existingImages, ...newImagePaths].join(", "),
    };
  });
}; 

const removeImage = (index: number) => {
  const updatedPreviews = [...uploadedImages];
  updatedPreviews.splice(index, 1);

  setUploadedImages(updatedPreviews);

  const updatedPaths = formData.images
    .split(", ")
    .filter((_, i) => i !== index);

  setFormData({
    ...formData,
    images: updatedPaths.join(", "),
  });
}; 
  const filterProducts = () => {
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (stockFilter === "low") {
      filtered = filtered.filter((p) => p.stock > 0 && p.stock < 10);
    } else if (stockFilter === "out") {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        !formData.name ||
        !formData.sku ||
        !formData.price ||
        !formData.stock
      ) {
        setError("Please fill in all required fields");
        return;
      }

      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice
          ? parseFloat(formData.comparePrice)
          : undefined,
        stock: parseInt(formData.stock),
        description: formData.description,
        categoryId: formData.categoryId,
        images: formData.images
          ? formData.images.split(",").map((img) => img.trim())
          : [],
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        sizes: formData.sizes
          ? formData.sizes.split(",").map((size) => size.trim())
          : [],
        colors: formData.colors
          ? formData.colors.split(",").map((color) => color.trim())
          : [],
      };

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save product");
      }

      await fetchProducts();
      setFormData(initialFormData);
      setEditingProduct(null);
      setDialogOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

const handleEdit = (product: Product) => {
  setEditingProduct(product);

  const editFormData: AdminProductFormData = {
    name: product.name,
    sku: product.sku,
    price: product.price,
    comparePrice: product.comparePrice || "",
    stock: product.stock.toString(),
    description: product.description || "",
    categoryId: product.categoryId,
    images: product.images.join(", "),
    tags: product.tags.join(", "),
    sizes:
      product.sizes?.join(", ") ||
      "39,40,41,42,43,44,45,46",
    colors:
      product.colors?.join(", ") ||
      "Black,Brown,White,Blue,Red",
  };

  setFormData(editFormData);
  setDialogOpen(true);
};
  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove products.</p>
        </div>
        <Button
          onClick={handleNewProduct}
          className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update product details"
                  : "Create a new product"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Product Name*</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Handmade Leather Shoes"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SKU*</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="e.g., SHOE-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price (₦)*</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Compare Price (₦)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, comparePrice: e.target.value })
                    }
                    placeholder="12000 (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Stock*</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category ID</label>
                  <Input
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    placeholder="Category ID"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Product description..."
                  className="w-full px-3 py-2 border rounded-md text-sm min-h-[100px]"
                />
              </div>

             <div className="space-y-2">
  <label className="text-sm font-medium">
    Upload Product Images
  </label>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleImageUpload}
    className="w-full border rounded-md p-2 text-sm"
  />

 {uploadedImages.length > 0 && (
  <div className="grid grid-cols-3 gap-3 mt-4">
    {uploadedImages.map((img, index) => (
      <div
        key={index}
        className="relative border rounded-lg overflow-hidden"
      >
        <div className="relative w-full h-32 bg-slate-100">
          <img
            src={img}
            alt={`Preview ${index}`}
            className="w-full h-32 object-cover"
            loading="lazy"
          />
        </div>
        <button
  type="button"
  onClick={() => removeImage(index)}
  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2"
>
  ×
</button>
      </div>
    ))}
  </div>
)}
</div>

              <div>
                <label className="text-sm font-medium">
                  Tags (comma-separated)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="handmade, shoes, leather"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Sizes (comma-separated)
                </label>
                <Input
                  value={formData.sizes}
                  onChange={(e) =>
                    setFormData({ ...formData, sizes: e.target.value })
                  }
                  placeholder="39,40,41,42,43,44,45,46"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Colors (comma-separated)
                </label>
                <Input
                  value={formData.colors}
                  onChange={(e) =>
                    setFormData({ ...formData, colors: e.target.value })
                  }
                  placeholder="Black, Brown, White, Blue, Red"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingProduct(null);
                    setFormData(initialFormData);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by product name or SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock (1-9)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <Button onClick={fetchProducts} variant="outline" size="sm">
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No products found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-600">
                        {product.sku}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold">
                        ₦
                        {parseFloat(product.price).toLocaleString("en-NG", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600 font-semibold"
                              : product.stock < 10
                                ? "text-yellow-600 font-semibold"
                                : "text-green-600"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {product.stock < 10 && product.stock > 0 && (
                          <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                            Low Stock
                          </Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge className="ml-2 bg-red-100 text-red-800">
                            Out of Stock
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Product
                                  </AlertDialogTitle>

                                  <AlertDialogDescription>
                                    Are you sure you want to delete `
                                    {product.name}`? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                                  <AlertDialogAction
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Product
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
