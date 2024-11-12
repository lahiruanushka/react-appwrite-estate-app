import React from "react";
import { LuHome, LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";

const EmptyListings = () => {
  return (
    <div className="card w-full bg-base-200 p-8">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className="bg-base-100 p-4 rounded-full">
          <LuHome className="w-12 h-12 text-primary" />
        </div>
        
        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-base-content">
            No Listings Yet
          </h3>
          <p className="text-base-content/70 max-w-sm">
            You haven&apos;t created any property listings. Start by creating your first listing to showcase your property.
          </p>
        </div>

        {/* Action Button */}
        <Link 
          to="/create-listing"
          className="btn btn-primary btn-lg gap-2 mt-4"
        >
          <LuPlus size={20} />
          Create Your First Listing
        </Link>

        {/* Helper Text */}
        <div className="text-sm text-base-content/60 mt-4">
          Need help? Check out our <a href="#" className="link link-primary">guide to creating listings</a>
        </div>
      </div>
    </div>
  );
};

export default EmptyListings;