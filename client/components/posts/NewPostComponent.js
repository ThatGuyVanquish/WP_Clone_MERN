import PreviewPostModalComponent from "./PreviewPostModal";
import Editor from "rich-markdown-editor";
import { useTheme } from "../../context/theme";
import { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, Select, Image } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadImage } from "../../functions/upload";
import { useCategories } from "../../context/categories";
import { useMedia } from "../../context/media";
import { usePosts } from "../../context/posts";
import MediaSelection from "../media/MediaSelectionModal";

/**
 * NewPostComponent is a component for creating a new post.
 * It provides a form for entering post details, including title, content, and categories.
 *
 * @component
 * @param {string} route - The route for creating a new post (e.g., "admin").
 * @returns {JSX.Element} JSX element representing the new post form.
 */
export default function NewPostComponent({ route = "admin" }) {
  // context
  const { theme } = useTheme();
  const { media, setMedia } = useMedia();
  const { categories } = useCategories();
  const { sendPostCreationRequest } = usePosts();
  // state
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [postCategories, setPostCategories] = useState();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // hooks
  const { Option } = Select;

  /**
   * Load post details from local storage and update component state.
   */
  useEffect(() => {
    if (localStorage.getItem("title")) {
      setTitle(localStorage.getItem("title"));
    }
    if (localStorage.getItem("content")) {
      setContent(localStorage.getItem("content"));
    }
    if (localStorage.getItem("featuredImage")) {
      setFeaturedImage(localStorage.getItem("featuredImage"));
    }
  }, []);

    /**
   * Set state and update local storage with a new value.
   * This is so that authors/admins writing a new post (not available for editing posts) can
   * be sure that the content they've written will be there even if they accidentally exit
   * the new post page or refresh it.
   *
   * @param {function} setState - The state update function.
   * @param {string} localStorageKey - The key to use for storing the value in local storage.
   * @param {string} newValue - The new value to set.
   */
  const setStateAndUpdateLocalStorage = (
    setState,
    localStorageKey,
    newValue
  ) => {
    if (newValue === "" || newValue === "\\\n") {
      setState("");
      localStorage.removeItem(localStorageKey);
    } else {
      setState(newValue);
      localStorage.setItem(localStorageKey, newValue);
    }
  };

  return (
    <>
      <Row>
        <Col span={14} xs={22} sm={22} lg={14} offset={1}>
          <h3>Create a new post:</h3>
          <Form initialValues={{ title: title || undefined }}>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "Post must have a title!",
                },
              ]}
            >
              <Input
                prefix={<EditOutlined />}
                placeholder="Title"
                onChange={(event) =>
                  setStateAndUpdateLocalStorage(
                    setTitle,
                    "title",
                    event.target.value
                  )
                }
              />
            </Form.Item>
          </Form>
          <div className="editor-scroll">
            <Editor
              defaultValue={content || undefined}
              placeholder="Write something..."
              dark={theme === "dark" ? true : false}
              onChange={(v) =>
                setStateAndUpdateLocalStorage(setContent, "content", v())
              }
              style={{
                outlineStyle: "solid",
                outlineWidth: "3px",
                outlineColor: "#c4c4c5",
              }}
              uploadImage={uploadImage}
            />
          </div>
        </Col>
        <Col span={6} offset={1}>
          <Form>
            <Form.Item name="preview" style={{ padding: "20px 0px 0px 0px" }}>
              <Button
                onClick={() => setPreviewVisible(true)}
                style={{ width: "100%" }}
              >
                Preview
              </Button>
            </Form.Item>
            <Form.Item style={{ marginTop: "-15px" }}>
              <h3>Categories</h3>
              <Select
                mode="multiple"
                allowClear
                placeholder="Please select"
                onChange={(value) => setPostCategories(value)}
                style={{ width: "100%" }}
              >
                {categories.map(
                  (category) => (
                    <Option key={category.name}>{category.name}</Option>
                  ),
                  []
                )}
              </Select>
            </Form.Item>
            {media?.selected && (
              <div style={{ textAlign: "center" }}>
                <Image
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                  src={featuredImage?.url || media?.selected?.url}
                />{" "}
                <br />
                <br />
              </div>
            )}
            <Form.Item>
              <Button
                onClick={() => {
                  setMedia({
                    ...media,
                    showMediaModal: true,
                  });
                }}
                style={{ width: "100%" }}
              >
                <UploadOutlined />
                Featured Image
              </Button>
              <br />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                onClick={() =>
                  sendPostCreationRequest(
                    media,
                    setMedia,
                    setLoading,
                    title,
                    content,
                    postCategories,
                    route
                  )
                }
                loading={loading}
              >
                Publish
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <PreviewPostModalComponent
        visible={previewVisible}
        setVisible={setPreviewVisible}
        title={title}
        content={content}
      />
      <MediaSelection
        onOk={() => {
          setMedia({
            ...media,
            showMediaModal: false,
          });
          if (media.selected) {
            setStateAndUpdateLocalStorage(
              setFeaturedImage,
              "featuredImage",
              JSON.stringify(media.selected)
            );
          }
        }}
        onCancel={() => {
          setMedia({
            ...media,
            showMediaModal: false,
          });
          if (media.selected) {
            setStateAndUpdateLocalStorage(
              setFeaturedImage,
              "featuredImage",
              JSON.stringify(media.selected)
            );
          }
        }}
      />
    </>
  );
}
