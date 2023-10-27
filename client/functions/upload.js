import axios from "axios";
import Resizer from "react-image-file-resizer";

/**
 * Resizes an image file.
 *
 * @param {File} file - The image file to be resized.
 * @returns {Promise<string>} - A promise that resolves with the resized image URI.
 */
const resizeImage = (file) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      720,
      400,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
};

/**
 * Uploads an image file to the server after resizing.
 *
 * @param {File} file - The image file to be uploaded.
 * @returns {Promise<any>} - A promise that resolves with the response data from the server.
 */
export const uploadImage = async (file) => {
  try {
    const image = await resizeImage(file);
    const { data } = await axios.post(`/upload-image`, { image });
    return data;
  } catch (err) {
    // Handle any errors here
  }
};
