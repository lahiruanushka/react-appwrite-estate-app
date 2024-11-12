import React, { useState, useEffect } from "react";
import { LuSend, LuX } from "react-icons/lu";
import userService from "../services/userService";

const ContactModal = ({ userId, listing, isOpen, onClose }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getLandlord() {
      try {
        setLoading(true);
        const response = await userService.getUserProfile(userId);
        setLandlord(response);
        setError(null);
      } catch (err) {
        setError("Failed to load contact information");
      } finally {
        setLoading(false);
      }
    }
    if (isOpen && userId) {
      getLandlord();
    }
  }, [userId, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }
    window.location.href = `mailto:${
      landlord.email
    }?Subject=${encodeURIComponent(listing.name)}&body=${encodeURIComponent(
      message
    )}`;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-base-100 rounded-lg shadow-xl w-full max-w-md mx-4 p-6 transform transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-base-content/60 hover:text-base-content transition-colors"
        >
          <LuX size={20} />
        </button>

        {/* Modal Header */}
        <h3 className="text-lg font-semibold text-base-content mb-4">
          Contact Property Owner
        </h3>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && landlord && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Landlord Info */}
            <div className="bg-base-200 rounded-lg p-4">
              <p className="text-base-content/80">
                Sending message to{" "}
                <span className="font-semibold">{landlord.name}</span>
              </p>
              <p className="text-base-content/70 text-sm">
                Regarding: {listing.name}
              </p>
            </div>

            {/* Message Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-32 w-full resize-none focus:border-primary"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!message.trim()}
              >
                <LuSend size={16} className="mr-2" />
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
