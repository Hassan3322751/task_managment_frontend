import axios from 'axios';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('upload_preset', 'tasksmanag'); // Replace this
  formData.append('file', file); 

  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dmprsl1mx/image/upload', 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.secure_url;
  } catch (err) {
    console.error("Detailed Cloudinary Error:", err.response?.data || err.message);
    throw err;
  }
};