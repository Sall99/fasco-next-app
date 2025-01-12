"use client";
import React from "react";
import Slider from "react-slick";
import { Typography } from "@/components";
import Image from "next/image";
import { StarRating } from "../star-rating";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    text: "This is the best product I have ever used! It has completely changed my life for the better. The quality is unmatched and the customer service is outstanding. I can't imagine going back to using anything else.",
    profilePicture:
      "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1736679678/fasco/image_1_igra8a.png",
    rating: 5,
  },
  {
    name: "Jane Smith",
    text: "Amazing quality and great customer service. I was blown away by how well this product works. The team behind it is incredibly supportive and always ready to help. Highly recommended!",
    profilePicture:
      "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1736679692/fasco/image_3_n28h4q.png",
    rating: 5,
  },
  {
    name: "Sam Wilson",
    text: "I would highly recommend this to everyone. It has exceeded all my expectations and I am extremely satisfied with my purchase. The attention to detail and the level of craftsmanship is truly impressive.",
    profilePicture:
      "https://res.cloudinary.com/dx6jhjxpt/image/upload/v1736679677/fasco/image_2_miekgs.png",
    rating: 5,
  },
];

const settings = {
  dots: true,
  infinite: true,
  arrows: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  nextArrow: <ChevronRight color="#B88E2F" width={10} height={10} />,
  prevArrow: <ChevronLeft color="#B88E2F" />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        arrows: false,
      },
    },
  ],
};

export const Testimonials = () => {
  return (
    <section className="testimonials m-auto mt-10 flex max-w-7xl flex-col px-4 lg:mt-24">
      <div className="md:w-_752 m-auto w-full lg:max-w-_876">
        <div className="mb-10">
          <Typography variant="h2" font="primary" alignment="center">
            This Is What Our Customers Say
          </Typography>
          <Typography variant="p-12" alignment="center" className="mt-4">
            Here are some of the testimonials we have received from our
            satisfied customers.
          </Typography>
        </div>
        <Slider {...settings} className="mt-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="!flex h-auto flex-col items-center justify-center rounded-md bg-white p-5 shadow-md md:h-80 md:flex-row"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full md:h-40 md:w-40">
                <Image
                  src={testimonial.profilePicture}
                  alt={"Profile Picture"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="mt-5 flex w-full flex-col items-center justify-center gap-5 md:ml-5 md:mt-0 md:w-3/4">
                <Typography variant="p-16" alignment="center">
                  {testimonial.text}
                </Typography>
                <StarRating average={testimonial.rating} />
                <Typography variant="p-16" alignment="center" className="mt-2">
                  - {testimonial.name}
                </Typography>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};
