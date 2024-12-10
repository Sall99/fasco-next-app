"use client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface TabsProps {
  categories: {
    name: string;
  }[];
}

export function Tabs({ categories }: TabsProps) {
  return (
    <div className="flex h-screen w-full justify-center px-4 pt-24">
      <div className="w-full">
        <TabGroup>
          <TabList className="flex justify-center gap-4">
            {categories.map(({ name }) => (
              <Tab
                key={name}
                className="rounded-md bg-primary-100 px-3 py-1 font-poppins text-sm/6 font-normal focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-black data-[selected]:data-[hover]:bg-primary-100 data-[selected]:text-white data-[focus]:outline-1"
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            {categories.map(({ name }) => (
              <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                <ul>{name}</ul>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
