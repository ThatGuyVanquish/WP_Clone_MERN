import { useState } from "react";
import { List } from "antd";
import { useCategories } from "../../../context/categories";
import EditCategoryModal from "./EditCategoryModal";

/**
 * CategoryDisplay component for displaying and managing categories.
 *
 * @component
 */
export default function CategoryDisplay() {
  // state
  /**
   * editingCategory state for holding a category object for editing.
   * @state
   * @type {object}
   */
  const [editingCategory, setEditingCategory] = useState({}); // State relevant to the category currently being edited.
  const [editingModalVisibility, setEditingModalVisibility] = useState(false);

  // context
  const { categories, sendCategoryDeletionRequest, sendCategoryUpdateRequest } =
    useCategories();

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={categories}
        renderItem={(item) => (
          <List.Item
            key={item.slug}
            actions={[
              /**
               * Handles editing a category and opens the edit modal.
               *
               * @param {object} item - The category item to be edited.
               */
              <a
                onClick={() => {
                  setEditingCategory(item);
                  setEditingModalVisibility(true);
                }}
              >
                edit
              </a>,

              /**
               * Handles deleting a category.
               *
               * @param {object} item - The category item to be deleted.
               */
              <a
                onClick={() => {
                  sendCategoryDeletionRequest(item);
                }}
              >
                delete
              </a>,
            ]}
          >
            <List.Item.Meta title={item.name} key={item.name} />
          </List.Item>
        )}
      />
      <EditCategoryModal
        visibility={editingModalVisibility}
        setVisibility={setEditingModalVisibility}
        updateCategory={sendCategoryUpdateRequest}
        category={editingCategory}
      />
    </>
  );
}
