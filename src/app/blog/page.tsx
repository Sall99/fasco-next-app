"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Search } from "lucide-react";
import { Typography } from "@/components";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "All",
  "Fashion",
  "Technology",
  "Lifestyle",
  "Business",
  "Culture",
  "Design",
];

const posts = [
  {
    id: 1,
    title: "The Future of E-commerce Fashion",
    date: "2025-04-15",
    readTime: "5 min read",
    author: "Jane Doe",
    category: "Fashion",
    featured: true,
    image: "/imgs/hero-img-1.png",
    tags: ["E-commerce", "Fashion", "Trends"],
    excerpt:
      "Discover how AI and personalization are reshaping the online fashion retail landscape.",
  },
  {
    id: 2,
    title: "Sustainable Fashion: A New Era",
    date: "2025-04-10",
    readTime: "8 min read",
    author: "John Smith",
    category: "Fashion",
    featured: true,
    image: "/imgs/hero-img-2.png",
    tags: ["Sustainability", "Fashion", "Environment"],
    excerpt:
      "Exploring the rise of sustainable and ethical fashion practices in the industry.",
  },
  {
    id: 3,
    title: "Tech Innovation in Retail",
    date: "2025-04-05",
    readTime: "6 min read",
    author: "Alex Johnson",
    category: "Technology",
    featured: false,
    image: "/imgs/features.png",
    tags: ["Technology", "Innovation", "Retail"],
    excerpt:
      "How cutting-edge technology is transforming the retail shopping experience.",
  },
  // Add more mock posts...
];

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="m-auto mt-20 max-w-7xl px-4">
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" className="mb-4">
            Fasco Blog
          </Typography>
          <Typography variant="p-14" className="text-muted-foreground">
            Discover the latest trends, stories, and insights from the world of
            fashion and e-commerce
          </Typography>
        </motion.div>
      </div>

      <div className="mb-12">
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {featuredPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <Typography variant="h5" className="mb-8">
            Featured Stories
          </Typography>
          <div className="grid gap-8 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group h-full overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.image})` }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3" variant="secondary">
                      {post.category}
                    </Badge>
                    <CardTitle className="mb-3 line-clamp-2 transition-colors group-hover:text-primary">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mb-4 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Typography variant="h5" className="mb-8">
          Latest Articles
        </Typography>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group h-full">
                <CardContent className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{post.category}</Badge>
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="mb-3 line-clamp-2 transition-colors group-hover:text-primary">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mb-4 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {filteredPosts.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <Typography variant="p-14" className="text-muted-foreground">
              No articles found matching your criteria. Try adjusting your
              search or category filter.
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlogPage;
