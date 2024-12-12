"use client";
import { ProductType } from "@/types";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Product } from "../product";

interface TabsProps {
  categories: {
    name: string;
    data: ProductType[];
  }[];
}

export function Tabs({ categories }: TabsProps) {
  return (
    <div className="container mx-auto px-4 py-24">
      <TabGroup>
        <TabList className="mb-6 flex space-x-4 overflow-x-auto lg:justify-center">
          {categories.map(({ name }) => (
            <Tab
              key={name}
              className="scroll-ml-6 scroll-smooth whitespace-nowrap rounded-md bg-primary-100 px-4 py-2 font-poppins text-sm focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-black data-[selected]:text-white"
            >
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {categories.map(({ name, data }) => (
            <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
              <ul className="grid grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((product) => (
                  <li key={product.id} className="flex justify-center">
                    <Product product={product} />
                  </li>
                ))}
              </ul>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
