import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Create a context
const CategoriesContext = createContext();

/**
 * Provider component for managing categories.
 * @param {object} children - The child components to be wrapped by the provider.
 * @component
 */
export function CategoriesProvider({ children }) {
  // State for managing categories.
  const [categories, setCategories] = useState([]);

  /**
   * Sends a request to create a new category.
   * @param {object} values - The values for creating the category.
   * @param {object} form - The form object for resetting fields.
   * @param {function} setLoading - The function to set loading state.
   */
  const sendCategoryCreationRequest = async (values, form, setLoading) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/category`, values);
      setLoading(false);
      if (data?.error) {
        toast.error(`ERROR creating category: ${data.error}`);
      } else {
        toast.success(`Successfully created the ${values.name} category!`);
        setCategories([data, ...categories]);
        form.resetFields();
      }
    } catch (err) {
      setLoading(false);
      const status = err.response?.status;
      let msg = "";
      if (status === 404) {
        msg = "ERROR: Can't reach category server.";
      } else if (status === 400)
        msg = `ERROR: Category ${values.name} already exists!`;
      else msg = status;
      toast.error(msg);
    }
  };

  /**
   * Sends a request to delete a category.
   * @param {object} item - The category to delete.
   */
  const sendCategoryDeletionRequest = async (item) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmation) return;
    try {
      const category = await axios.delete(`/category/${item.slug}`);
      setCategories(categories.filter((item) => item._id != category.data._id));
      toast.success(`Successfully deleted the ${item.name} category!`);
    } catch (err) {
      toast.error("Failed to delete category: " + err.error);
    }
  };

  /**
   * Sends a request to update a category.
   * @param {string} CategoryName - The new name for the category.
   * @param {object} target - The category to update.
   * @param {function} setVisibility - The function to set visibility.
   * @param {function} setLoading - The function to set loading state.
   */
  const sendCategoryUpdateRequest = async (
    CategoryName,
    target,
    setVisibility,
    setLoading
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/category/${target.slug}`, {
        name: CategoryName,
      });
      setCategories(
        categories.map((item) => (item._id === data._id ? data : item))
      );
      setLoading(false);
      setVisibility(false);
      toast.success(`Successfully changed ${target.name} to ${CategoryName}`);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to update category: " + err.message);
    }
  };

  /**
   * Fetches the post count in a category.
   *
   * @param {string} slug - The slug of the category.
   * @param {function} setPostCount - A function to set the post count.
   */
  const fetchPostCountInCategory = async (slug, setPostCount) => {
    try {
      const { data } = await axios.get(`/category/${slug}`);
      setPostCount(data);
    } catch (err) {}
  };

  /**
   * Fetches the category name by slug.
   *
   * @param {string} slug - The slug of the category.
   * @param {function} setCategoryName - A function to set the category name.
   */
  const fetchCategoryName = async (slug, setCategoryName) => {
    try {
      const { data } = await axios.get(`/category-name/${slug}`);
      setCategoryName(data);
    } catch (err) {}
  };

  /**
   * Fetches the first set of posts in a category.
   *
   * @param {string} slug - The slug of the category.
   * @param {function} setPosts - A function to set the fetched posts.
   */
  const fetchFirstPostsInCategory = async (slug, setPosts) => {
    try {
      const { data } = await axios.get(`/category/${slug}/1`);
      setPosts(data);
    } catch (err) {}
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        sendCategoryCreationRequest,
        sendCategoryDeletionRequest,
        sendCategoryUpdateRequest,
        fetchPostCountInCategory,
        fetchCategoryName,
        fetchFirstPostsInCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

/**
 * Custom hook for accessing category-related functions and state.
 * @returns {object} An object containing category functions and state.
 */
export function useCategories() {
  // Access state and functions from the context.
  const { setCategories } = useContext(CategoriesContext);

  useEffect(() => {
    // Fetch categories on component mount.
    const getCategories = async () => {
      try {
        const { data } = await axios.get("/categories");
        setCategories(data);
      } catch (err) {}
    };

    getCategories();
  }, []);

  return useContext(CategoriesContext);
}
