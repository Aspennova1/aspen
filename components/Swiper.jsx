'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import aspen6 from '@/assets/aspen6.jpg';
import aspen7 from '@/assets/aspen7.jpg';
import aspen8 from '@/assets/aspen8.jpg';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';

export const SwiperComponent = () => {
  return (
    <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper w-full h-full"
      >
        <SwiperSlide>
            <div className="w-full h-full relative">
                <Image
                src={aspen8}
                alt="Sample Image 1"
                fill
                className="object-cover"
                priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-start">
      <div className="max-w-6xl w-full px-4 sm:px-12 lg:px-20">
        
        <h1 className="text-white text-4xl sm:text-6xl font-bold drop-shadow-lg">
          Aspen Group
        </h1>

        <p className="text-white text-lg sm:text-2xl mt-4 drop-shadow-lg">
          Delivering innovation for the future.
        </p>

      <Link href={'/future'}>
        <button className="mt-6 px-6 py-3 bg-lime-400 text-black font-semibold rounded-full shadow-lg hover:bg-lime-500 transition">
          Read More
        </button>
      </Link>
      </div>
    </div>
            </div>
        </SwiperSlide>
        <SwiperSlide>
            <div className="w-full h-full relative">
                <Image
                src={aspen6}
                alt="Sample Image 1"
                fill
                className="object-cover"
                priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-start">
      <div className="max-w-6xl w-full px-4 sm:px-12 lg:px-20">
        
        <h1 className="text-white text-4xl sm:text-6xl font-bold drop-shadow-lg">
              Aspen Fire & Safety
        </h1>

        <p className="text-white text-lg sm:text-2xl mt-4 drop-shadow-lg">
          Fire, safety, and protection systems engineered for reliability.
        </p>

        <Link href={'/fire-safety'}>
          <button className="mt-6 px-6 py-3 bg-lime-400 text-black font-semibold rounded-full shadow-lg hover:bg-lime-500 transition">
            Read More
          </button>
        </Link>
      </div>
    </div>
            </div>
        </SwiperSlide>

        <SwiperSlide>
            <div className="w-full h-full relative">
                <Image
                src={aspen7}
                alt="Sample Image 1"
                fill
                className="object-cover"
                priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-start">
      <div className="max-w-6xl w-full px-4 sm:px-12 lg:px-20">
        
        <h1 className="text-white text-4xl sm:text-6xl font-bold drop-shadow-lg">
              Aspen Mills
        </h1>

        <p className="text-white text-lg sm:text-2xl mt-4 drop-shadow-lg">
          Infrastructure and manufacturing-grade project delivery.
        </p>

      <Link href={'/mills'}>
        <button className="mt-6 px-6 py-3 bg-lime-400 text-black font-semibold rounded-full shadow-lg hover:bg-lime-500 transition">
          Read More
        </button>
      </Link>

      </div>
    </div>
            </div>
        </SwiperSlide>
        
      </Swiper>
  )
}
