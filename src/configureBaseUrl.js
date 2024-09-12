

const configureBaseUrl = () => {
  // Get the IP address


  // Define the BASE_URL based on the hostname
  const BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:5000' 
    : `http://192.168.230.240:5000`;

  console.log('BASE_URL:', BASE_URL);
  return BASE_URL;
};

// Export the BASE_URL
export default configureBaseUrl;
