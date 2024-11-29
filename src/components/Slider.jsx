import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import listingImageService from "../services/listingImageService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slider = ({ listings }) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchImagePreviews = async () => {
      const previews = [];
      for (const listing of listings) {
        for (const imageId of listing.images) {
          try {
            // Get the preview URL for each image
            const previewUrl = await listingImageService.getFilePreview(
              imageId
            );
            previews.push(previewUrl);
          } catch (error) {
            console.error("Error fetching image preview:", error);
          }
        }
      }
      setImagePreviews(previews);
    };

    fetchImagePreviews();
  }, [listings]);

  return (
    <div className="bg-base-200">
      <div className="relative">
        {imagePreviews.length > 0 ? (
          <Swiper
            modules={[EffectFade, Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            navigation
            effect="fade"
            autoplay={{ delay: 3000 }}
            className="h-[400px]"
          >
            {imagePreviews.map((previewUrl, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative w-full h-full bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${previewUrl})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-base-300">
            No images available
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;
