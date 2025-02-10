import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

export default function HeroSlider({ slider }) {
  return (
    <>
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className=" w-full h-fit md:h-[500px]  "
      >
        {slider.map((slide, index) => {
          return (
            <SwiperSlide key={index}>
              {
                <div className=" relative text-white w-full h-full flex flex-col items-center justify-center ">
                  <a href={slide.link}>
                    <img
                      className="w-full h-full object-fill lg:object-cover"
                      src={slide.image}
                      alt={slide.name}
                    />
                  </a>
                  <div className=" absolute pl-7 md:pl-0 flex flex-col">
                    {slide.title && (
                      <p className=" text-[15px] md:text-[17px] 2xl-text-[20px] uppercase text-left ">
                        {slide.title}
                      </p>
                    )}
                    {slide.description && (
                      <p className=" text-[20px] md:text-[40px] 2xl-text-[48px] w-[70%] leading-10 mt-1 mb-4 font-[700] plus-jakarta text-left -ml-1 ">
                        {slide.description}
                      </p>
                    )}
                    {slide.description && (
                      <Link to={slide.link} className=" w-fit">
                        <button className=" border border-white w-fit px-4 py-2 uppercase text-[11px] md:text-[13px]">
                          {slide.buttonContent}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              }
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
