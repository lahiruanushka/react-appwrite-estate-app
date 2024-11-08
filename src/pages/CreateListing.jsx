import { useState } from "react";

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
  });

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

  function onChange(e) {
    // Handle file inputs
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
      return;
    }

    // Handle checkboxes
    if (e.target.type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.checked,
      }));
      return;
    }

    // Handle number inputs
    if (e.target.type === "number") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: Number(e.target.value),
      }));
      return;
    }

    // Handle buttons (for type selection)
    if (e.target.type === "button") {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
      return;
    }

    // Handle all other inputs
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const onSubmit = (e) => {
    e.preventDefault();

    // Create a copy of formData for display
    const displayData = { ...formData };

    // Convert FileList to array of file names for display
    if (displayData.images) {
      displayData.images = Array.from(displayData.images).map(
        (file) => file.name
      );
    }

    // Log the formatted data
    console.log("Form Submission Data:");
    console.table(displayData);

    // Additional validation could go here
    const priceValidation = offer ? discountedPrice < regularPrice : true;
    if (!priceValidation) {
      console.error("Discounted price must be less than regular price");
      return;
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

                {/* Regular Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Regular Price</span>
                  </label>
                  <label className="input-group">
                    <input
                      type="number"
                      id="regularPrice"
                      value={regularPrice}
                      onChange={onChange}
                      min="50"
                      max="400000000"
                      required
                      className="input input-bordered w-full"
                    />
                    <span>{type === "rent" ? "$/month" : "$"}</span>
                  </label>
                </div>

                {/* Discounted Price */}
                {offer && (
                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Discounted Price</span>
                    </label>
                    <label className="input-group">
                      <input
                        type="number"
                        id="discountedPrice"
                        value={discountedPrice}
                        onChange={onChange}
                        min="50"
                        max="400000000"
                        required
                        className="input input-bordered w-full"
                      />
                      <span>{type === "rent" ? "$/month" : "$"}</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Images Upload */}
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
