"use client";
import React, { useState } from "react";
// import Slider from "react-slick";
import Countdown, { CountdownRenderProps } from "react-countdown";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import "./index.css";

import { Typography, Button } from "@/components";
// import { monthDealsData } from "@/constants/data";

function CountDown() {
  const [key, setKey] = useState(0);
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      setKey((prevKey) => prevKey + 1);
      return null;
    }

    return (
      <div className="mt-4 flex max-w-_444 space-x-4">
        <div className="text-center">
          <div className="timing-wrapper">
            <Typography variant="h3" font="secondary">
              {String(days).padStart(2, "0")}
            </Typography>
          </div>
          <div className="mt-5">
            <Typography variant="h6" font="default" alignment="center">
              Days
            </Typography>
          </div>
        </div>
        <div className="text-center">
          <div className="timing-wrapper">
            <Typography variant="h3" font="secondary">
              {String(hours).padStart(2, "0")}
            </Typography>
          </div>
          <div className="mt-5">
            <Typography variant="h6" font="default" alignment="center">
              Hr
            </Typography>
          </div>
        </div>
        <div className="text-center">
          <div className="timing-wrapper">
            <Typography variant="h3" font="secondary">
              {String(minutes).padStart(2, "0")}
            </Typography>
          </div>
          <div className="mt-5">
            <Typography variant="h6" font="default" alignment="center">
              Mins
            </Typography>
          </div>
        </div>
        <div className="text-center">
          <div className="timing-wrapper">
            <Typography variant="h3" font="secondary">
              {String(seconds).padStart(2, "0")}
            </Typography>
          </div>
          <div className="mt-5">
            <Typography variant="h6" font="default" alignment="center">
              Sec
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <Typography font="primary" variant="h3">
          Deals Of The Month
        </Typography>
        <Typography font="primary" variant="p-16" className="mt-5">
          Dont miss our special offers! Shop the best deals and save big on your
          favorite items
        </Typography>

        <Button className="mt-10">Buy Now</Button>
      </div>

      <div className="mt-10">
        <Typography variant="h5">Hurry, Before It’s Too Late!</Typography>
        <Countdown
          key={key}
          date={Date.now() + 2 * 24 * 60 * 60 * 1000}
          renderer={renderer}
        />
      </div>
    </div>
  );
}

// const Carrousel = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     arrows: true,
//     nextArrow: <ChevronRight color="#B88E2F" width={10} height={10} />,
//     prevArrow: <ChevronLeft color="#B88E2F" />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: false,
//         },
//       },
//     ],
//   };

//   return (
//     <Slider {...settings}>
//       {monthDealsData.map(({ title, description, id, imageUrl }) => (
//         <div key={id} className="home-slider-container">
//           <div
//             className="home-slider-image"
//             style={{
//               backgroundImage: `url(${imageUrl})`,
//             }}
//           >
//             <div className="slider-content-overlay">
//               <p className="flex items-center gap-4 text-xs">
//                 <span>0 {id}</span>
//                 <span className="border-black-500 w-8 border-t"> </span>
//                 <span>{description}</span>
//               </p>
//               <h3 className="slider-title">{title}</h3>
//               <p className="slider-description">{description}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </Slider>
//   );
// };

export function MonthDeals() {
  return (
    <section className="m-auto mt-10 flex max-w-7xl px-4 lg:mt-24">
      <CountDown />
      {/* <div className="home-slider-container w-_373 lg:w-_876 m-auto">
        <Carrousel />
      </div> */}
    </section>
  );
}
