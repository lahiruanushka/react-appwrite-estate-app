import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  LuBath,
  LuBed,
  LuCar,
  LuHome,
  LuMapPin,
  LuMessageSquare,
  LuPhone,
  LuShare,
  LuSofa,
  LuTag,
} from "react-icons/lu";
import listingImageService from "../services/listingImageService";
import listingService from "../services/listingService";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import ContactModal from "../components/ContactModal";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await listingService.getListing(params.listingId);
        if (response) {
          setListing(response);
          if (response.images?.length > 0) {
            const validUrls = await Promise.all(
              response.images.map(async (fileId) => {
                try {
                  return await listingImageService.getFilePreview(fileId);
                } catch (error) {
                  console.error(
                    `Error fetching preview for image ${fileId}:`,
                    error
                  );
                  return null;
                }
              })
            ).then((urls) => urls.filter((url) => url !== null));
            setImageUrls(validUrls);
          }
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Listing not found</span>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="relative">
        {imageUrls.length > 0 ? (
          <Swiper
            modules={[EffectFade, Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            autoplay={{ delay: 3000 }}
            className="h-[400px]"
          >
            {imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative w-full h-full bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${url})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-[400px] bg-base-300 flex items-center justify-center">
            <LuHome size={48} className="text-base-content opacity-20" />
          </div>
        )}

        <button
          className="btn btn-circle btn-primary absolute top-4 right-4 z-10"
          onClick={handleShare}
        >
          <LuShare size={20} />
        </button>

        {shareLinkCopied && (
          <div className="toast toast-end z-50">
            <div className="alert alert-success">
              <span>Link copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold">{listing.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <LuMapPin className="text-primary" size={16} />
                  <span className="text-base-content/80">
                    {listing.address}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="stats bg-primary text-primary-content">
                  <div className="stat">
                    <div className="stat-title text-primary-content/80">
                      Price
                    </div>
                    <div className="stat-value">
                      $
                      {listing.offer
                        ? listing.discountedPrice.toLocaleString()
                        : listing.regularPrice.toLocaleString()}
                    </div>
                    <div className="stat-desc text-primary-content/80">
                      {listing.type === "rent" ? "per month" : ""}
                    </div>
                  </div>
                </div>

                {listing.offer && (
                  <div className="badge badge-secondary gap-2 mt-2">
                    <LuTag size={12} />$
                    {(
                      listing.regularPrice - listing.discountedPrice
                    ).toLocaleString()}{" "}
                    off
                  </div>
                )}
              </div>
            </div>

            <div className="divider" />

            <div className="tabs tabs-bordered">
              <button
                className={`tab tab-lg ${
                  activeTab === "details" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`tab tab-lg ${
                  activeTab === "features" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
              <button
                className={`tab tab-lg ${
                  activeTab === "contact" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("contact")}
              >
                Contact
              </button>
            </div>

            <div className="mt-4">
              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat bg-base-200 rounded-box">
                      <div className="stat-figure text-primary">
                        <LuBed size={24} />
                      </div>
                      <div className="stat-title">Bedrooms</div>
                      <div className="stat-value text-2xl">
                        {listing.bedrooms}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box">
                      <div className="stat-figure text-primary">
                        <LuBath size={24} />
                      </div>
                      <div className="stat-title">Bathrooms</div>
                      <div className="stat-value text-2xl">
                        {listing.bathrooms}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box">
                      <div className="stat-figure text-primary">
                        <LuCar size={24} />
                      </div>
                      <div className="stat-title">Parking</div>
                      <div className="stat-value text-2xl">
                        {listing.parking ? "Yes" : "No"}
                      </div>
                    </div>
                    <div className="stat bg-base-200 rounded-box">
                      <div className="stat-figure text-primary">
                        <LuSofa size={24} />
                      </div>
                      <div className="stat-title">Furnished</div>
                      <div className="stat-value text-2xl">
                        {listing.furnished ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>

                  <div className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                      Description
                    </div>
                    <div className="collapse-content">
                      <p>{listing.description}</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "features" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title">Property Features</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="badge badge-primary">
                            {listing.type === "rent" ? "Rental" : "For Sale"}
                          </span>
                        </li>
                        {/* Add more features as needed */}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "contact" && (
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Contact Information</h3>
                    <div className="flex items-center gap-2">
                      <LuPhone size={20} />
                      <a
                        href="tel:+1234567890"
                        className="link link-primary no-underline"
                      >
                        Call Us
                      </a>
                      <LuMessageSquare size={20} />
                      <button
                        className="link link-primary no-underline"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Email Us
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {listing.geolocation && (
                <div className="w-full h-[200px] md:h-[400px] z-10 overflow-hidden mt-8 md:mt-3 md:ml-2">
                  {(() => {
                    // Parse the geolocation string
                    const [lat, lng] = listing.geolocation
                      .split(",")
                      .map(parseFloat);

                    // Check if coordinates are valid
                    if (lat && lng) {
                      return (
                        <MapContainer
                          center={[lat, lng]}
                          zoom={13}
                          scrollWheelZoom={false}
                          className="h-full w-full rounded-box shadow-md"
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[lat, lng]}>
                            <Popup>{listing.name || "Property Location"}</Popup>
                          </Marker>
                        </MapContainer>
                      );
                    }

                    // Fallback if coordinates are invalid
                    return (
                      <div role="alert" className="alert alert-warning">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-current shrink-0 h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span>Location information not available</span>
                      </div>
                    );
                  })()}
                </div>
              )}

              <ContactModal
                userId={listing.userId}
                listing={listing}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
