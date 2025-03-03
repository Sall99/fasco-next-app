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

const NextArrow = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`${className} !flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-amber-50`}
      onClick={onClick}
    >
      <ChevronRight className="h-5 w-5 text-amber-700" />
    </div>
  );
};

const PrevArrow = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`${className} !flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-amber-50`}
      onClick={onClick}
    >
      <ChevronLeft className="h-5 w-5 text-amber-700" />
    </div>
  );
};

const settings = {
  dots: true,
  infinite: true,
  arrows: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  dotsClass: "slick-dots custom-dots",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        arrows: true,
      },
    },
    {
      breakpoint: 640,
      settings: {
        arrows: false,
      },
    },
  ],
};

export const Testimonials = () => {
  return (
    <section className="relative bg-gradient-to-b from-amber-50/30 to-white py-16 lg:py-24">
      <div className="testimonials m-auto flex max-w-7xl flex-col px-4">
        <div className="mb-12 md:mb-16">
          <Typography
            variant="h2"
            font="primary"
            alignment="center"
            className="relative mb-3 inline-block after:absolute after:-bottom-3 after:left-1/2 after:h-1 after:w-16 after:-translate-x-1/2 after:rounded-full after:bg-amber-400"
          >
            This Is What Our Customers Say
          </Typography>
          <Typography
            variant="p-14"
            alignment="center"
            className="mt-8 text-gray-600 md:mx-auto md:max-w-2xl"
          >
            Here are some of the testimonials we have received from our
            satisfied customers who have experienced our exceptional products
            and service.
          </Typography>
        </div>

        <div className="relative mx-auto w-full max-w-4xl px-4 md:px-8">
          <Slider {...settings} className="testimonial-slider">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-2 focus:outline-none md:px-6">
                <div className="overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl md:p-8">
                  <div className="flex flex-col items-center md:flex-row md:items-start">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-4 border-amber-100 shadow-md md:h-32 md:w-32">
                      <Image
                        src={testimonial.profilePicture}
                        alt={`${testimonial.name}'s profile picture`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority
                      />
                    </div>

                    <div className="mt-6 flex w-full flex-col items-center justify-center md:ml-8 md:mt-0 md:items-start">
                      <div className="mb-4">
                        <StarRating average={testimonial.rating} />
                      </div>

                      <Typography
                        variant="p-16"
                        className="mb-4 font-serif italic text-gray-700 md:text-left"
                      >
                        &quot;{testimonial.text}&quot;
                      </Typography>

                      <Typography
                        variant="p-16"
                        className="font-medium text-amber-900"
                      >
                        — {testimonial.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};
