import React from "react";

import { Tabs, Typography } from "@/components";

const categories = [
  {
    name: "Classrooms",
  },
  {
    name: "Library",
  },
  {
    name: "Science Lab",
  },
  {
    name: "Computer Lab",
  },
  {
    name: "Garden and Nature Area",
  },
];

export const NewArrivals = () => {
  return (
    <section className="m-auto mt-10 flex max-w-7xl flex-col px-4 lg:mt-24">
      <div className="m-auto max-w-_756">
        <Typography variant="h2" font="primary" alignment="center">
          New Arrivals
        </Typography>
        <Typography variant="p-16" alignment="center" className="mt-5">
          Explore the latest trends in fashion with our new collection of
          dresses, sweaters, and accessories. Find your perfect outfit today!
        </Typography>
      </div>

      <Tabs categories={categories} />
    </section>
  );
};
