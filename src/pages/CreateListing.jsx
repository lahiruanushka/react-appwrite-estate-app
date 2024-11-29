import React from "react";
import { useState } from "react";
import listingService from "../services/listingService";
import listingImageService from "../services/listingImageService";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function CreateListing() {
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
    geolocation: [0, 0], // Initialize as an array with default coordinates
  });

  const [imageUrls, setImageUrls] = useState([]);

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
  } = formData;

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  function onChange(e) {
    // Handle file inputs
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (files.length > 6) {
        alert("Maximum 6 images allowed");
        return;
      }

      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));

      // Create preview URLs
      const urls = files.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);
      return;
    }

    // Rest of your existing onChange handlers...
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

  // Function to remove an image
  const removeImage = (indexToRemove) => {
    // Create new FileList without the removed image
    const dt = new DataTransfer();
    const files = Array.from(formData.images);
    files.forEach((file, index) => {
      if (index !== indexToRemove) {
        dt.items.add(file);
      }
    });

    // Update form data with new FileList
    setFormData((prev) => ({
      ...prev,
      images: dt.files,
    }));

    // Update preview URLs
    setImageUrls((prev) => {
      // Revoke the URL to avoid memory leaks
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  // Clean up URLs when component unmounts
  React.useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageUpload = async () => {
    if (!formData.images) return null;

    const uploadedImageIds = [];
    for (let i = 0; i < formData.images.length; i++) {
      const file = formData.images[i];
      try {
        const response = await listingImageService.uploadFile(file);
        console.log(response);
        uploadedImageIds.push(response.$id);
      } catch (error) {
        console.error("Image upload failed:", error);
        return null; // Exit on failure
      }
    }
    return uploadedImageIds;
  };

  const getGeolocation = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }
      
      const results = await response.json();
      
      if (results && results.length > 0) {
        return {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Validate pricing if there's an offer
    const priceValidation = offer ? discountedPrice < regularPrice : true;
    if (!priceValidation) {
      console.error("Discounted price must be less than regular price");
      return;
    }
  
    // Upload images and get their IDs
    const uploadedImageIds = await handleImageUpload();
    if (!uploadedImageIds) return; // Exit if upload failed
  

 // Get geolocation for the address
 const geocodedLocation = await getGeolocation(address);

 // Store geolocation as an array
 const geolocationArray = geocodedLocation 
   ? [geocodedLocation.lat, geocodedLocation.lng]
   : [0, 0];

  
    // Prepare data for saving to database
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
      images: uploadedImageIds,
      userId: user.$id,
      geolocation: geolocationArray,
    };
  
    try {
      const response = await listingService.createLitings(listingData);
      console.log("Listing saved successfully:", response);
      navigate("/profile");
    } catch (error) {
      console.error("Error saving listing:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl justify-center mb-8">
              Create a Listing
            </h1>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Sell/Rent Toggle */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Listing Type
                  </span>
                </label>
                <div className="join w-full">
                  <button
                    type="button"
                    id="type"
                    value="sale"
                    onClick={onChange}
                    className={`join-item btn flex-1 ${
                      type === "sale" ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    Sell
                  </button>
                  <button
                    type="button"
                    id="type"
                    value="rent"
                    onClick={onChange}
                    className={`join-item btn flex-1 ${
                      type === "rent" ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    Rent
                  </button>
                </div>
              </div>

              {/* Property Name */}
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

              {/* Beds & Baths */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Bedrooms
                    </span>
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    value={bedrooms}
                    onChange={onChange}
                    min="1"
                    max="50"
                    required
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">
                      Bathrooms
                    </span>
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    value={bathrooms}
                    onChange={onChange}
                    min="1"
                    max="50"
                    required
                    className="input input-bordered w-full"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Amenities
                  </span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      className="checkbox"
                      id="parking"
                      checked={parking}
                      onChange={onChange}
                    />
                    <span className="label-text">Parking Available</span>
                  </label>
                  <label className="label cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      className="checkbox"
                      id="furnished"
                      checked={furnished}
                      onChange={onChange}
                    />
                    <span className="label-text">Furnished</span>
                  </label>
                </div>
              </div>

              {/* Address */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Address
                  </span>
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={onChange}
                  placeholder="Enter property address"
                  required
                  className="textarea textarea-bordered h-24"
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Description
                  </span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Describe your property"
                  required
                  className="textarea textarea-bordered h-32"
                />
              </div>

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

                {type === "rent" ? (
                  // Rental Pricing
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Monthly Rent</span>
                      </label>
                      <label className="input-group">
                        <span className="bg-primary text-primary-content">
                          $
                        </span>
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
                        <span className="bg-primary text-primary-content">
                          /month
                        </span>
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
                            Discounted Monthly Rent
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
                          <span className="bg-secondary text-secondary-content">
                            /month
                          </span>
                        </label>
                        <label className="label">
                          <span className="label-text-alt text-base-content/70">
                            Must be less than regular rent
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  // Sale Pricing
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Selling Price</span>
                      </label>
                      <label className="input-group">
                        <span className="bg-primary text-primary-content">
                          $
                        </span>
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
                            Discounted Selling Price
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
                        </label>
                        <label className="label">
                          <span className="label-text-alt text-base-content/70">
                            Must be less than regular price
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

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

              {/* Updated Images Upload Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    Property Images
                  </span>
                </label>
                <div className="flex flex-col gap-2">
                  <div className="alert alert-info">
                    <span>The first image will be the cover (max 6)</span>
                  </div>
                  <input
                    type="file"
                    id="images"
                    onChange={onChange}
                    accept=".jpg,.png,.jpeg"
                    multiple
                    required
                    className="file-input file-input-bordered w-full"
                  />
                </div>

                {/* Image Preview */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 badge badge-primary">
                            Cover Image
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="btn btn-circle btn-sm btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-full">
                Create Listing
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
