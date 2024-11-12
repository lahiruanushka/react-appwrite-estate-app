import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import listingService from "../services/listingService";
import listingImageService from "../services/listingImageService";

export default function EditListing() {
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: null,
    existingImageIds: [], // Store existing image IDs
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]); // Store URLs of existing images

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    address,
    furnished,
    description,
    offer,
    regularPrice,
    discountedPrice,
    existingImageIds,
  } = formData;

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch existing listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listing = await listingService.getListing(listingId);
        
        // Verify user owns this listing
        if (listing.userId !== user.$id) {
          navigate("/");
          return;
        }

        // Get existing image URLs
        const imageUrls = await Promise.all(
          listing.images.map(async (imageId) => {
            const url = await listingImageService.getFilePreview(imageId);
            return url;
          })
        );

        setFormData({
          type: listing.type,
          name: listing.name,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          parking: listing.parking,
          furnished: listing.furnished,
          address: listing.address,
          description: listing.description,
          offer: listing.offer,
          regularPrice: listing.regularPrice,
          discountedPrice: listing.discountedPrice,
          images: null,
          existingImageIds: listing.images,
        });

        setExistingImageUrls(imageUrls);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        navigate("/");
      }
    };

    fetchListing();
  }, [listingId, navigate, user.$id]);

  function onChange(e) {
    // Handle file inputs
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = files.length + existingImageUrls.length;

      if (totalImages > 6) {
        alert("Maximum 6 images allowed");
        return;
      }

      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));

      // Create preview URLs for new images
      const urls = files.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);
      return;
    }

    // Handle other input changes
    if (e.target.type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.checked,
      }));
      return;
    }

    if (e.target.type === "number") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: Number(e.target.value),
      }));
      return;
    }

    if (e.target.type === "button") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  // Remove new image
  const removeNewImage = (indexToRemove) => {
    const dt = new DataTransfer();
    const files = Array.from(formData.images);
    files.forEach((file, index) => {
      if (index !== indexToRemove) {
        dt.items.add(file);
      }
    });

    setFormData((prev) => ({
      ...prev,
      images: dt.files,
    }));

    setImageUrls((prev) => {
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  // Remove existing image
  const removeExistingImage = async (indexToRemove) => {
    try {
      const imageIdToRemove = existingImageIds[indexToRemove];
      await listingImageService.deleteFile(imageIdToRemove);

      setFormData((prev) => ({
        ...prev,
        existingImageIds: prev.existingImageIds.filter((_, index) => index !== indexToRemove),
      }));

      setExistingImageUrls((prev) => 
        prev.filter((_, index) => index !== indexToRemove)
      );
    } catch (error) {
      console.error("Error removing existing image:", error);
    }
  };

  // Clean up URLs when component unmounts
  React.useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageUpload = async () => {
    if (!formData.images) return formData.existingImageIds;

    const uploadedImageIds = [...formData.existingImageIds];
    for (let i = 0; i < formData.images.length; i++) {
      const file = formData.images[i];
      try {
        const response = await listingImageService.uploadFile(file);
        uploadedImageIds.push(response.$id);
      } catch (error) {
        console.error("Image upload failed:", error);
        return null;
      }
    }
    return uploadedImageIds;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate pricing if there's an offer
    const priceValidation = offer ? discountedPrice < regularPrice : true;
    if (!priceValidation) {
      console.error("Discounted price must be less than regular price");
      return;
    }

    // Upload new images and combine with existing image IDs
    const updatedImageIds = await handleImageUpload();
    if (!updatedImageIds) return;

    // Prepare data for updating the database
    const listingData = {
      type,
      name,
      bedrooms,
      bathrooms,
      parking,
      furnished,
      address,
      description,
      offer,
      regularPrice,
      discountedPrice,
      images: updatedImageIds,
      userId: user.$id,
    };

    try {
      await listingService.updateListing(listingId, listingData);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      {loading ? (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-3xl justify-center mb-8">
                Edit Listing
              </h1>
  
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Listing Type Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Listing Type
                    </span>
                  </label>
                  <div className="join w-full">
                    {['sale', 'rent'].map((value) => (
                      <button
                        key={value}
                        type="button"
                        id="type"
                        value={value}
                        onClick={onChange}
                        className={`join-item btn flex-1 ${
                          type === value ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        {value === 'sale' ? 'Sell' : 'Rent'}
                      </button>
                    ))}
                  </div>
                </div>
  
                {/* Property Name Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Property Name
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Enter property name"
                    maxLength="32"
                    minLength="10"
                    required
                    className="input input-bordered w-full"
                  />
                </div>
  
                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  {['bedrooms', 'bathrooms'].map((field) => (
                    <div key={field} className="form-control">
                      <label className="label">
                        <span className="label-text text-lg font-semibold">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </span>
                      </label>
                      <input
                        type="number"
                        id={field}
                        value={formData[field]}
                        onChange={onChange}
                        min="1"
                        max="50"
                        required
                        className="input input-bordered w-full"
                      />
                    </div>
                  ))}
                </div>
  
                {/* Amenities */}
                <div className="space-y-4">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Amenities
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: 'parking', label: 'Parking Available' },
                      { id: 'furnished', label: 'Furnished' }
                    ].map(({ id, label }) => (
                      <label key={id} className="label cursor-pointer gap-2">
                        <input
                          type="checkbox"
                          className="checkbox"
                          id={id}
                          checked={formData[id]}
                          onChange={onChange}
                        />
                        <span className="label-text">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
  
                {/* Address & Description */}
                {['address', 'description'].map((field) => (
                  <div key={field} className="form-control">
                    <label className="label">
                      <span className="label-text text-lg font-semibold">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                    </label>
                    <textarea
                      id={field}
                      value={formData[field]}
                      onChange={onChange}
                      placeholder={`Enter property ${field}`}
                      required
                      className={`textarea textarea-bordered ${
                        field === 'description' ? 'h-32' : 'h-24'
                      }`}
                    />
                  </div>
                ))}
  
                {/* Pricing Section */}
                <div className="card bg-base-200 p-4">
                  <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
  
                  {/* Offer Toggle */}
                  <div className="form-control mb-4">
                    <label className="label cursor-pointer">
                      <span className="label-text">Special Offer Available?</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        id="offer"
                        checked={offer}
                        onChange={onChange}
                      />
                    </label>
                  </div>
  
                  {/* Price Inputs */}
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">
                          {type === 'rent' ? 'Monthly Rent' : 'Selling Price'}
                        </span>
                      </label>
                      <label className="input-group">
                        <span className="bg-primary text-primary-content">$</span>
                        <input
                          type="number"
                          id="regularPrice"
                          value={regularPrice}
                          onChange={onChange}
                          min="50"
                          max="400000000"
                          required
                          className="input input-bordered w-full"
                          placeholder="0.00"
                        />
                        {type === 'rent' && (
                          <span className="bg-primary text-primary-content">
                            /month
                          </span>
                        )}
                      </label>
                      <label className="label">
                        <span className="label-text-alt text-base-content/70">
                          Minimum $50
                        </span>
                      </label>
                    </div>
  
                    {offer && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            {type === 'rent'
                              ? 'Discounted Monthly Rent'
                              : 'Discounted Selling Price'}
                          </span>
                        </label>
                        <label className="input-group">
                          <span className="bg-secondary text-secondary-content">
                            $
                          </span>
                          <input
                            type="number"
                            id="discountedPrice"
                            value={discountedPrice}
                            onChange={onChange}
                            min="50"
                            max={regularPrice - 1}
                            required
                            className="input input-bordered w-full"
                            placeholder="0.00"
                          />
                          {type === 'rent' && (
                            <span className="bg-secondary text-secondary-content">
                              /month
                            </span>
                          )}
                        </label>
                        <label className="label">
                          <span className="label-text-alt text-base-content/70">
                            Must be less than regular {type === 'rent' ? 'rent' : 'price'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
  
                  {/* Price Error Alert */}
                  {offer && regularPrice <= discountedPrice && (
                    <div className="alert alert-error mt-4">
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
                      <span>
                        Discounted price must be less than regular price!
                      </span>
                    </div>
                  )}
                </div>
  
                {/* Images Section */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Property Images
                    </span>
                  </label>
  
                  {/* Existing Images */}
                  {existingImageUrls.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg mb-2">Current Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {existingImageUrls.map((url, index) => (
                          <div key={`existing-${index}`} className="relative group">
                            <img
                              src={url}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 badge badge-primary">
                                Cover Image
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="btn btn-circle btn-sm btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {/* New Images Upload */}
                  <div className="flex flex-col gap-2">
                    <div className="alert alert-info">
                      <span>
                        {existingImageUrls.length > 0
                          ? `You can add up to ${6 - existingImageUrls.length} more images`
                          : 'The first image will be the cover (max 6)'}
                      </span>
                    </div>
                    <input
                      type="file"
                      id="images"
                      onChange={onChange}
                      accept=".jpg,.png,.jpeg"
                      multiple
                      className="file-input file-input-bordered w-full"
                    />
                  </div>
  
                  {/* New Image Previews */}
                  {imageUrls.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg mb-2">New Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imageUrls.map((url, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <img
                              src={url}
                              alt={`New ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="btn btn-circle btn-sm btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
  
                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-full">
                  Update Listing
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}