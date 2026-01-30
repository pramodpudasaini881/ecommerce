# LUXE - Modern E-commerce Platform (Frontend)

LUXE is a premium, full-featured e-commerce frontend built with React, TypeScript, and Vite. It offers a seamless shopping experience with real-time backend integration, secure authentication, and a sleek, modern design.

![LUXE Frontend Interface](file:///C:/Users/acer/.gemini/antigravity/brain/bac57b12-4322-460a-a0fa-b886fb0878fc/frontend_verification_1769773007797.webp)

## 🚀 Features

### 🛍️ Shopping Experience
- **Dynamic Product Grid**: Real-time product fetching with pagination.
- **Advanced Search & Filtering**: URL-based search and category filtering for shareable results.
- **Product Details**: Comprehensive views including image galleries, size selection, and description.
- **Customer Reviews**: Real reviews fetched from the backend with the ability for verified users to submit new ones.

### 🛒 Cart & Checkout
- **Persistent Shopping Bag**: Global state management for the cart using React Context.
- **Streamlined Checkout**: Integrated multi-step checkout flow.
- **Real Order Creation**: Connected to the backend API for order processing and inventory management.

### 👤 User Account
- **Secure Authentication**: JWT-based login and signup systems.
- **Profile Management**: Update personal info and manage saved shipping addresses.
- **Order History**: View all previous orders with status updates (Paid, Shipped, Delivered).

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **State Management**: React Context API
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation

1. **Navigate to the frontend directory**:
   ```sh
   cd frontend
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file (if not present) and set your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**:
   ```sh
   npm run dev
   ```

## 🔌 API Integration

The frontend communicates with a MERN backend. Key services are located in `src/api/`:
- `authService.ts`: Handles login, signup, and profile updates.
- `productService.ts`: Manages products list, search, and reviews.
- `orderService.ts`: Handles order creation and history fetching.

---
Built with ❤️ for a premium shopping experience.
