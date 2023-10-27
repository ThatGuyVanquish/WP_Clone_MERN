import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./auth";
import { useRouter } from "next/router";

// Create a context
const MediaContext = createContext();

/**
 * Provider component for managing media data and operations.
 * @param {object} children - The child components to be wrapped by the provider.
 * @component
 */
export function MediaProvider({ children }) {
  // State for managing media data.
  const [media, setMedia] = useState({
    images: [],
    selected: null,
    showMediaModal: false,
  });

  // Context for authentication.
  const [auth] = useAuth();

  // Router hook for navigation.
  const router = useRouter();

  /**
   * Fetch media data from the server and update the media state.
   * @function
   */
  const fetchMedia = async () => {
    try {
      const { data } = await axios.get("/media");
      setMedia((prev) => ({ ...prev, images: data }));
    } catch (err) {
      toast.error(err);
    }
  };

  /**
   * Delete a media item from the server and update the media state.
   * @function
   * @param {object} image - The media image to be deleted.
   * @property {string} _id - The unique identifier of the image.
   */
  const deleteMedia = async (image) => {
    try {
      const { data } = await axios.delete(`/media/${image._id}`);
      if (data.ok) {
        toast.success("Image deleted successfully");
        setMedia((prev) => ({
          ...prev,
          images: media.images.filter((img) => img._id != image._id),
          selected: prev?.selected?._id === image._id ? null : prev.selected,
        }));
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Error: " + err);
    }
  };

  /**
   * Get props object for file uploader components.
   * @function
   * @param {Boolean} multiple - Should be able to upload multiple files at once.
   * @param {Boolean} redirectToLibrary - Should redirect to a library page when done.
   * @returns {object} - Props object for the uploader component.
   */
  const getPropsForUploader = (multiple = false, redirectToLibrary = false) => {
    const props = {
      name: "file",
      multiple: { multiple },
      action: `${process.env.NEXT_PUBLIC_API}/upload-image-lib`,
      headers: {
        authorization: `Bearer ${auth.token}`,
      },
      onChange(info) {
        if (info.file.status === "done") {
          toast.success(`${info.file.name} file uploaded successfully`);
          setMedia({
            images: [info.file.response, ...media.images],
            selected: info.file.response,
            showMediaModal: false,
          });
          if (redirectToLibrary) {
            router.push(
              `/${
                auth?.user?.role === "Author" ? "author" : "admin"
              }/media/library`
            );
          }
        } else if (info.file.status === "error") {
          toast.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return props;
  };

  return (
    <MediaContext.Provider
      value={{ media, setMedia, deleteMedia, fetchMedia, getPropsForUploader }}
    >
      {children}
    </MediaContext.Provider>
  );
}

/**
 * Custom hook for accessing media data and operations.
 * @returns {object} - An object containing media data and related functions.
 */
export function useMedia() {
  const { fetchMedia } = useContext(MediaContext);

  useEffect(() => {
    fetchMedia();
  }, []);

  return useContext(MediaContext);
}
