# React EstateEase App 🏡🔑

React EstateEase App is a modern real estate web application built with React, Redux, and Tailwind CSS. It provides users with the ability to explore real estate listings, manage their profiles, create listings, and navigate through various property categories like rent and sale.

## Screenshots 📸

### Home Page
![Home Page Screenshot](/screenshots/home-page.png)

### Listings Page
![Listings Page Screenshot](/screenshots/listings-page.png)

### Single Listing Details
![Single Listing Screenshot](/screenshots/single-listing.png)

### User Authentication
![Sign In Page Screenshot](/screenshots/signin-page.png)

## Features ✨

- **Public Pages**: 🌐
  - Home
  - Offers
  - Rent Listings
  - Sale Listings
  - Single Listing Details

- **User Authentication**: 🔐
  - Sign In, Sign Up, and Forgot Password pages
  - Private routes for authorized users
  - Role-based access control for profile and listing management

- **Listing Management**: 📝
  - Create a new listing
  - Edit existing listings
  - Filter listings by category (Rent/Sale)

- **Modern UI**: 🎨
  - Responsive design with Tailwind CSS and DaisyUI
  - Interactive map integration using Leaflet
  - Smooth navigation and scrolling

- **State Management**: 🧠
  - Centralized state using Redux Toolkit
  - Persistent authentication state with Redux Persist

## Tech Stack 💻

- **Frontend**: React, React Router, Redux Toolkit, Redux Persist, React Icons
- **Styling**: Tailwind CSS, DaisyUI
- **Maps**: Leaflet, React-Leaflet
- **Authentication**: Appwrite
- **Date Handling**: date-fns
- **Swiper**: For interactive carousels

## Installation 🛠️

### Prerequisites 📋

- Node.js (v16 or higher)
- npm or yarn
- Appwrite instance for authentication and backend services

### Steps 🚀

1. Clone the repository:

   ```bash
   git clone https://github.com/lahiruanushka/react-appwrite-estate-app.git
   cd react-appwrite-estate-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file for your environment variables (e.g., Appwrite configuration).

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open the app in your browser at `http://localhost:5173`.

### Build for Production 🏗️

To build the app for production, run:

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

## Project Structure 📂

```plaintext
src/
├── components/      # Reusable components (Header, Footer, ScrollToTop, etc.)
├── pages/           # Page components (Home, Profile, SignIn, etc.)
├── store/           # Redux store and slices
├── App.js           # Main application file
├── main.js          # Entry point
└── styles/          # Tailwind and global styles
```

## Scripts 📜

- `dev`: Start the development server
- `build`: Build the app for production
- `lint`: Run ESLint for code linting
- `preview`: Preview the production build

## Dependencies 📦

### Main Dependencies
- React
- React Router
- Redux Toolkit
- Leaflet and React-Leaflet
- Appwrite
- Tailwind CSS and DaisyUI

### Dev Dependencies 🛠️
- ESLint with React hooks
- Tailwind CSS with PostCSS and Autoprefixer
- Vite

## Contribution 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Acknowledgments 🙏

- **Appwrite** for backend services
- **Leaflet** for map integration
- **Tailwind CSS** and **DaisyUI** for beautiful UI components
- Various online tutorials and resources

## Contact 📬

For inquiries, you can reach me at [lahiruanushkaofficial@gmail.com] or connect on LinkedIn.

Built with ❤️ by Lahiru Anushka