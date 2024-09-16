

const configureBaseUrl = () => {
  // Get the IP address


  // Define the BASE_URL based on the hostname
  const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://192.168.170.240:5000' 
    : `http://192.168.170.240:5000`;
  return BASE_URL;
};

// Export the BASE_URL
export default configureBaseUrl;
