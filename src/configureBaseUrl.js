

const configureBaseUrl = () => {
  // Get the IP address


  // Define the BASE_URL based on the hostname
  const BASE_URL = window.location.hostname === 'localhost' 
    ? 'https://backend-2-9t4g.onrender.com' 
    : `https://backend-2-9t4g.onrender.com`;
  return BASE_URL;
};

// Export the BASE_URL
export default configureBaseUrl;
