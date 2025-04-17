"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, BriefcaseIcon, MapPin, User2, ArrowRight } from "lucide-react";
import { Typography } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const departments = [
  "All Departments",
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Customer Service",
];

const locations = ["All Locations", "New York", "London", "Paris", "Remote"];

const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Join our engineering team to build the future of fashion e-commerce...",
    requirements: [
      "5+ years of experience with React and modern JavaScript",
      "Experience with Next.js and TypeScript",
      "Strong understanding of web performance and optimization",
    ],
  },
  {
    id: 2,
    title: "UI/UX Designer",
    department: "Design",
    location: "New York",
    type: "Full-time",
    description: "Help shape the user experience of our e-commerce platform...",
    requirements: [
      "3+ years of experience in product design",
      "Strong portfolio showcasing web and mobile design work",
      "Experience with Figma and design systems",
    ],
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "London",
    type: "Full-time",
    description:
      "Lead product initiatives and drive growth for our platform...",
    requirements: [
      "4+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience in e-commerce or fashion industry",
    ],
  },
];

const CareersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      job.department === selectedDepartment;
    const matchesLocation =
      selectedLocation === "All Locations" || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="m-auto mt-20 max-w-7xl px-4">
      <div className="mb-12 text-center">
        <Typography variant="h4" className="mb-4">
          Join Our Team
        </Typography>
        <Typography variant="p-14" className="text-muted-foreground">
          Help us shape the future of fashion e-commerce. We&apos;re always
          looking for talented individuals to join our team.
        </Typography>
      </div>

      <div className="mb-16 grid gap-8 lg:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <User2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Typography variant="h6">Great Culture</Typography>
                <Typography variant="p-14" className="text-muted-foreground">
                  Work with passionate individuals who inspire
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <BriefcaseIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Typography variant="h6">Growth Opportunities</Typography>
                <Typography variant="p-14" className="text-muted-foreground">
                  Develop your skills and advance your career
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Typography variant="h6">Global Impact</Typography>
                <Typography variant="p-14" className="text-muted-foreground">
                  Work on products used worldwide
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>Find your next opportunity at Fasco</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{job.department}</Badge>
                      <Badge variant="outline">{job.location}</Badge>
                      <Badge>{job.type}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Typography variant="p-14" className="text-muted-foreground">
                  {job.description}
                </Typography>
                <div className="mt-4">
                  <Typography variant="p-14" className="font-medium">
                    Requirements:
                  </Typography>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-muted-foreground">
                        <Typography variant="p-14">{req}</Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="inline-flex items-center gap-2">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Typography variant="p-14" className="text-muted-foreground">
                No positions found matching your criteria. Try adjusting your
                filters.
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CareersPage;
