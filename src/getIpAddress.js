import axios from 'axios';

export const getIpAddress = async () => {
  try {
    // Fetching IP address using the ipify API
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return '127.0.0.1'; // Fallback to localhost in case of an error
  }
};
