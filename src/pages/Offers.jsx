import React, { useEffect, useState } from "react";
import { LuTag, LuFilter } from "react-icons/lu";
import listingService from "../services/listingService";
import ListingItem from "../components/ListingItem";
import Loading from "../components/Loading";

const Offers = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    async function fetchOfferListings() {
      try {
        const response = await listingService.getLitings();
        const offerListings = response.documents.filter(
          (listing) => listing.offer === true
        );
        setListings(offerListings);
        setFilteredListings(offerListings);
      } catch (error) {
        console.error("Error fetching offer listings:", error);
        setError("Error fetching offer listings");
      } finally {
        setLoading(false);
      }
    }

    fetchOfferListings();
  }, []);

  const handleSort = (e) => {
    const sortOption = e.target.value;
    let sorted = [...filteredListings];

    switch (sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price-high":
        sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredListings(sorted);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div role="alert" className="alert alert-error">
          <LuTag className="stroke-current shrink-0 h-6 w-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <LuTag className="mr-3 text-primary" />
          Special Offers
        </h1>
        <div className="flex items-center space-x-4">
          <select 
            className="select select-bordered select-sm"
            onChange={handleSort}
          >
            <option disabled selected>Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <button className="btn btn-ghost btn-sm">
            <LuFilter className="mr-2" /> Filters
          </button>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl">No offers available at the moment</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default Offers;