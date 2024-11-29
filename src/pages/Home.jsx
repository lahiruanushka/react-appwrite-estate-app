import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import listingService from "../services/listingService";
import Slider from "../components/Slider";
import ListingItem from "../components/ListingItem";
import Loading from "../components/Loading";
import { LuHome, LuMapPin, LuTag, LuTrendingUp, LuWarehouse } from "react-icons/lu";


const CategoryCard = ({ icon, title, count, link }) => (
  <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
    <div className="card-body items-center text-center">
      <div className="text-4xl text-primary mb-4">
        {icon}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="text-base-content/70">{count} Listings Available</p>
      <div className="card-actions justify-center mt-4">
        <Link to={link} className="btn btn-primary btn-outline btn-sm">
          View {title}
        </Link>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await listingService.getLitings();
        const fetchedListings = response.documents;
        setListings(fetchedListings);

        setOfferListings(
          fetchedListings.filter((listing) => listing.offer === true)
        );
        setRentListings(
          fetchedListings.filter((listing) => listing.type === "rent")
        );
        setSaleListings(
          fetchedListings.filter((listing) => listing.type === "sale")
        );
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Error fetching listings");
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div role="alert" className="alert alert-error">
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Slider Section */}
      <section>
        <Slider listings={listings} />
      </section>

      {/* Categories Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard 
            icon={<LuTag />}
            title="Offers"
            count={offerListings.length}
            link="/offers"
          />
          <CategoryCard 
            icon={<LuHome />}
            title="Rent"
            count={rentListings.length}
            link="/category/rent"
          />
          <CategoryCard 
            icon={<LuWarehouse />}
            title="Sale"
            count={saleListings.length}
            link="/category/sale"
          />
        </div>
      </section>

      {/* Listings Sections */}
      <section>
        {offerListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <LuTrendingUp className="mr-3 text-2xl text-primary" />
              <h2 className="text-2xl font-bold">Latest Offers</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerListings.slice(0, 3).map((listing) => (
                <ListingItem
                  key={listing.$id}
                  listing={listing}
                  id={listing.$id}
                />
              ))}
            </div>
            {offerListings.length > 3 && (
              <div className="text-center mt-6">
                <Link to="/offers" className="btn btn-primary">
                  View All Offers
                </Link>
              </div>
            )}
          </div>
        )}

        {rentListings.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <LuMapPin className="mr-3 text-2xl text-secondary" />
              <h2 className="text-2xl font-bold">Rent Properties</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentListings.slice(0, 3).map((listing) => (
                <ListingItem
                  key={listing.$id}
                  listing={listing}
                  id={listing.$id}
                />
              ))}
            </div>
            {rentListings.length > 3 && (
              <div className="text-center mt-6">
                <Link to="/category/rent" className="btn btn-secondary">
                  View All Rentals
                </Link>
              </div>
            )}
          </div>
        )}

        {saleListings.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <LuHome className="mr-3 text-2xl text-accent" />
              <h2 className="text-2xl font-bold">Properties for Sale</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saleListings.slice(0, 3).map((listing) => (
                <ListingItem
                  key={listing.$id}
                  listing={listing}
                  id={listing.$id}
                />
              ))}
            </div>
            {saleListings.length > 3 && (
              <div className="text-center mt-6">
                <Link to="/category/sale" className="btn btn-accent">
                  View All Sale Properties
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;