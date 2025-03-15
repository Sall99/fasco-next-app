import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../card";
import { Button } from "../button";
import { ShoppingCart, Trash, X, Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  selectWishlistItems,
  selectWishlistTotalItems,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
} from "@/store/slices/wishlist";
import { addToCart } from "@/store/slices/cart";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: number;
}

export const WishlistTab = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const totalItems = useSelector(selectWishlistTotalItems);

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Item removed from wishlist");
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    toast.success("Wishlist cleared");
  };

  const handleMoveToCart = (item: WishlistItem) => {
    dispatch(
      addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      }),
    );

    dispatch(moveToCart(item.productId));
    toast.success("Item moved to cart");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Wishlist</CardTitle>
            <CardDescription>Items you&apos;ve saved for later</CardDescription>
          </div>
          {totalItems > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearWishlist}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <Heart className="h-12 w-12 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                Your wishlist is empty
              </p>
              <Button variant="outline" size="sm">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveToCart(item)}
                      title="Move to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className="text-destructive"
                      title="Remove from wishlist"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {wishlistItems.length > 0 && (
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"} in wishlist
            </p>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                wishlistItems.forEach((item) => handleMoveToCart(item));
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Move All to Cart
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
