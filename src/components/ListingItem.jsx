import { Link } from "react-router-dom";
import {
  IoLocationSharp,
  IoBedOutline,
  IoWaterOutline,
  IoCalendarNumberOutline,
  IoHeartOutline,
  IoHeart,
  IoArrowForward,
} from "react-icons/io5";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import listingImageService from "../services/listingImageService";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export default function ListingItem({ listing, id, onEdit, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const fetchPreviewUrl = async () => {
      try {
        const url = await listingImageService.getFilePreview(listing.images[0]);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error fetching image preview:", error);
      }
    };
    fetchPreviewUrl();
  }, []);

  const handleConfirmDelete = () => {
    if (id) {
      onDelete(id); // Use the prop id directly
    }
    setIsModalOpen(false);
  };

  return (
    <div
      className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 m-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <figure className="relative overflow-hidden">
          <img
            src={previewUrl}
            alt={listing.name}
            className={`h-56 w-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="badge badge-lg badge-primary text-lg font-bold">
              $
              {formatPrice(
                listing.offer ? listing.discountedPrice : listing.regularPrice
              )}
            </div>
            {listing.type === "rent" && (
              <span className="text-white text-sm">/month</span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="btn btn-circle btn-sm absolute top-4 right-4 bg-base-100/80 hover:bg-base-100"
          >
            {isFavorite ? (
              <IoHeart className="text-error text-xl" />
            ) : (
              <IoHeartOutline className="text-xl" />
            )}
          </button>
        </figure>

        <div className="card-body p-4">
          {/* Title and Status */}
          <div className="flex justify-between items-start mb-2">
            <Link to={`/category/${listing.type}/${id}`} className="relative">
              <h2 className="card-title text-lg font-bold truncate flex-1">
                {listing.name}
              </h2>
            </Link>
            <div className="badge badge-success gap-1">
              <span className="capitalize">{listing.type}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-base-content/70 mb-3">
            <IoLocationSharp className="text-primary text-lg" />
            <p className="text-sm truncate">{listing.address}</p>
          </div>

          {/* Features */}
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-1">
              <IoBedOutline className="text-base-content/70" />
              <span className="text-sm font-medium">
                {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <IoWaterOutline className="text-base-content/70" />
              <span className="text-sm font-medium">
                {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-300 space-x-4">
            <div className="relative flex space-x-2">
              {onDelete && (
                <button
                  className="btn btn-sm btn-error btn-circle cursor-pointer"
                  onClick={() => {
                    setDeleteId(listing.$id); // Set the ID to be deleted
                    setIsModalOpen(true); // Open the delete confirmation modal
                  }}
                  aria-label="Delete"
                >
                  <FaTrash className="text-xs" />
                </button>
              )}
              {onEdit && (
                <button
                  className="btn btn-sm btn-circle cursor-pointer"
                  onClick={() => onEdit(listing.id)}
                  aria-label="Edit"
                >
                  <MdEdit className="text-xs" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <IoCalendarNumberOutline className="text-lg" />
              <span>Listed {format(listing.$updatedAt, "MMM d, yyyy")}</span>
            </div>

            <div
              className={`transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <IoArrowForward className="text-primary text-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
