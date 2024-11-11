const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteListingsCollectionId: String(
    import.meta.env.VITE_APPWRITE_LISTINGS_COLLECTION_ID
  ),
  appwriteProfilesCollectionId: String(
    import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID
  ),
  appwriteListingImagesBucketId: String(
    import.meta.env.VITE_APPWRITE_LISTING_IMAGES_BUCKET_ID
  ),
};

export default conf;
