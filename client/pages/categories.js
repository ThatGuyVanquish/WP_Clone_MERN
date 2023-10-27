import ShowCategories from "../components/categories/ShowCategoriesComponent";

/**
 * React component for displaying categories.
 * @returns {JSX.Element} The rendered component.
 */
export default function categories() {
  return (
    <ShowCategories>
      <h4 style={{ fontSize: 20, fontFamily: "monospace" }}>
        Choose a category to view all posts related to it:
      </h4>
    </ShowCategories>
  );
}
