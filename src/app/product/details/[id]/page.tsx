"use client";
import { useParams } from "next/navigation";
import React from "react";

// {
//   "status": 200,
//   "message": "success",
//   "product": {
//       "id": "676470e5f9d82c95c6d79398",
//       "name": "Shirt in real camel",
//       "slug": "shirt-in-real-camel",
//       "brand": "Blazers",
//       "price": 3500.99,
//       "viewersCount": 0,
//       "categoryId": "676470d1f9d82c95c6d79356",
//       "isAlmostSoldOut": false,
//       "tags": [
//           "Slim fit",
//           "men",
//           "Classic lapels"
//       ],
//       "images": [
//           "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1734110940/fasco/GI000443U33435_2157_1_gntknh.webp",
//           "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1734110940/fasco/GI000443U33435_2157_4_ilatsp.jpg",
//           "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1734110940/fasco/GI000443U33435_2157_2_xo16b4.jpg",
//           "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1734110939/fasco/GI000443U33435_2157_0_lxsgaj.jpg"
//       ],
//       "description": "Shirt in natural pure camel fibre. The fabric boasts a very opaque, velour-like brushed finish that gives it a classic look with a modern edge.",
//       "createdAt": "2024-12-19T19:15:49.245Z",
//       "updatedAt": "2024-12-19T19:15:49.245Z",
//       "category": {
//           "id": "676470d1f9d82c95c6d79356",
//           "name": "Men's Fashion",
//           "slug": "men's-fashion"
//       },
//       "stock": {
//           "id": "676470e5f9d82c95c6d79399",
//           "quantity": 10,
//           "lowStockThreshold": 3,
//           "productId": "676470e5f9d82c95c6d79398"
//       },
//       "rating": {
//           "id": "676470e5f9d82c95c6d7939a",
//           "average": 5,
//           "reviewsCount": 4500,
//           "productId": "676470e5f9d82c95c6d79398"
//       }
//   }
// }

export default function Page() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  return <div>Product Details</div>;
}
