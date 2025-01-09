
# UniBooks - Your Gateway to Literature  

Welcome to UniBooks, an innovative React-based e-commerce application for book enthusiasts. UniBooks offers a seamless experience for browsing, purchasing, and managing books, providing categories for new arrivals, top-rated, and more.

## Features  
- **User Authentication**: Powered by Firebase Authentication for secure login and signup.  
- **Book Categories**: Discover new arrivals, featured, engineering, science, and more.  
- **Wishlist & Cart Management**: Add books to your cart or wishlist with smooth UX.  
- **Admin Features**: Manage books, users, and categories (optional).  
- **Search and Recommendations**: Intuitive search area and personalized recommendations.  
- **Responsive Design**: Mobile-friendly and accessible.  
- **Firebase Hosting**: Deployed using Firebase Hosting for a robust experience.

---

## Directory Structure  

```plaintext
Chijex5-test_public/
├── bookshop/               # Firebase hosting directory
│   └── index.html          # Hosting landing page
├── public/                 # Public assets and manifest
│   ├── 404.html            # Custom 404 handler
│   ├── index.html          # Main entry point
│   └── robots.txt          # Robots exclusion
├── src/                    # Core React project
│   ├── components/         # Modular React components
│   ├── styles/             # Custom CSS for the application
│   ├── App.js              # Main React component
│   ├── Books.js            # Book listing and recommendations
│   ├── AuthContext.js      # Authentication context
│   └── firebase.js         # Firebase initialization
├── .github/                # CI/CD workflows
├── firebase.json           # Firebase project settings
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

---

## Getting Started  

### Prerequisites  
- **Node.js**: v16.0.0 or higher  
- **npm**: v7.0.0 or higher  
- **Firebase CLI**: Installed globally  

### Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-repo/unibooks.git  
   cd unibooks  
   ```  

2. Install dependencies:  
   ```bash  
   npm install  
   ```  

3. Configure Firebase:  
   Update the `firebase.js` file with your Firebase configuration.  

4. Start the development server:  
   ```bash  
   npm start  
   ```  
   Visit [http://localhost:3000](http://localhost:3000) in your browser.  

---

## Deployment  

### Firebase Hosting  

1. Build the project:  
   ```bash  
   npm run build  
   ```  

2. Deploy to Firebase:  
   ```bash  
   firebase deploy  
   ```  

---

## Key Dependencies  
- **React**: Frontend library for building UI.  
- **Firebase**: Backend-as-a-service for authentication and hosting.  
- **Axios**: HTTP client for API calls.  
- **React Router**: Client-side routing.  
- **Lottie**: Animations for an enhanced user experience.  

---

## Contributing  

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.  

---

## License  

This project is licensed under the [MIT License](LICENSE).  
