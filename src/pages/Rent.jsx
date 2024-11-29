import React, { useEffect, useState } from "react";
import listingService from "../services/listingService";
import ListingItem from "../components/ListingItem";
import Loading from "../components/Loading";
import { LuFilter, LuHome } from "react-icons/lu";

const Rent = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000000 },
    bedrooms: null,
    bathrooms: null,
  });

  useEffect(() => {
    async function fetchRentListings() {
      try {
        const response = await listingService.getLitings();
        const rentListings = response.documents.filter(
          (listing) => listing.type === "rent"
        );
        setListings(rentListings);
        setFilteredListings(rentListings);
      } catch (error) {
        console.error("Error fetching rent listings:", error);
        setError("Error fetching rent listings");
      } finally {
        setLoading(false);
      }
    }

    fetchRentListings();
  }, []);

  const handleSort = (e) => {
    const sortOption = e.target.value;
    let sorted = [...filteredListings];

    switch (sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.regularPrice - b.regularPrice);
        break;
      case "price-high":
        sorted.sort((a, b) => b.regularPrice - a.regularPrice);
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredListings(sorted);
  };

  const applyFilters = () => {
    let filtered = listings.filter(
      (listing) =>
        listing.regularPrice >= filters.priceRange.min &&
        listing.regularPrice <= filters.priceRange.max &&
        (filters.bedrooms === null || listing.bedrooms === filters.bedrooms) &&
        (filters.bathrooms === null || listing.bathrooms === filters.bathrooms)
    );

    setFilteredListings(filtered);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 1000000 },
      bedrooms: null,
      bathrooms: null,
    });
    setFilteredListings(listings);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div role="alert" className="alert alert-error">
          <LuHome className="stroke-current shrink-0 h-6 w-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <LuHome className="mr-3 text-accent" />
          Properties for Rent
        </h1>
        <div className="flex items-center space-x-4">
          <select
            className="select select-bordered select-sm"
            onChange={handleSort}
          >
            <option disabled selected>
              Sort By
            </option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
              <LuFilter className="mr-2" /> Filters
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-4 shadow bg-base-100 rounded-box w-96"
            >
              <li className="menu-title">Filters</li>
              <li>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Price Range</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="input input-bordered input-sm w-full"
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: {
                            ...prev.priceRange,
                            min: Number(e.target.value),
                          },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="input input-bordered input-sm w-full"
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: {
                            ...prev.priceRange,
                            max: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </li>
              <li>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Bedrooms</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.bedrooms || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        bedrooms:
                          e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4+ Bedrooms</option>
                  </select>
                </div>
              </li>
              <li>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Bathrooms</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.bathrooms || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        bathrooms:
                          e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3+ Bathrooms</option>
                  </select>
                </div>
              </li>
              <li className="menu-title mt-4 flex justify-between items-center">
                <span>Apply Filters</span>
                <div className="space-x-2">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={applyFilters}
                  >
                    Apply
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-500">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingItem
              key={listing.$id}
              listing={listing}
              id={listing.$id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rent;
