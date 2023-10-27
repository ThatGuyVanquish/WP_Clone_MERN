import PreviewPostModalComponent from "./PreviewPostModal";
import MediaSelection from "../media/MediaSelectionModal";
import Editor from "rich-markdown-editor";
import { useState, useEffect } from "react";
import { Row, Col, Form, Input, Button, Select, Image } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useCategories } from "../../context/categories";
import { useMedia } from "../../context/media";
import { usePosts } from "../../context/posts";
import { useTheme } from "../../context/theme";
import { uploadImage } from "../../functions/upload";

/**
 * Component for editing a post.
 *
 * @component
 * @param {object} props - The component's props.
 * @param {string} props.route - The route for the edit post component.
 */
export default function EditPostComponent({ route = "admin" }) {
  // context
  const { theme } = useTheme();
  const { categories } = useCategories();
  const { media, setMedia } = useMedia();
  const { fetchPost, sendPostUpdateRequest } = usePosts();
  // state
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [postCategories, setPostCategories] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [postID, setPostID] = useState("");
  const [loading, setLoading] = useState(true);
  // hooks
  const { Option } = Select;

  useEffect(() => {
    fetchPost({
      setPostID,
      setTitle,
      setContent,
      setPostCategories,
      media,
      setMedia,
      setLoading,
    });
  }, []);

  return (
    <>
      <Row>
        <Col span={14} xs={22} sm={22} lg={14} offset={1}>
          <h3>Edit post:</h3>
          <Form>
            <Form.Item
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Item>
          </Form>
          <div className="editor-scroll">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Editor
                defaultValue={content || undefined}
                placeholder="Write something..."
                dark={theme === "dark" ? true : false}
                onChange={(v) => setContent(v())}
                style={{
                  outlineStyle: "solid",
                  outlineWidth: "3px",
                  outlineColor: "#c4c4c5",
                }}
                uploadImage={uploadImage}
              />
            )}
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
                name="categories"
                mode="multiple"
                allowClear
                placeholder="Please select"
                onChange={(value) => setPostCategories(value)}
                style={{ width: "100%" }}
                value={postCategories}
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
                  src={media?.selected?.url}
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
                  sendPostUpdateRequest(
                    postID,
                    title,
                    content,
                    postCategories,
                    media,
                    setMedia,
                    setLoading,
                    route
                  )
                }
                loading={loading}
              >
                Update
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
        onOk={() =>
          setMedia({
            ...media,
            showMediaModal: false,
          })
        }
        onCancel={() =>
          setMedia({
            ...media,
            showMediaModal: false,
          })
        }
      />
    </>
  );
}
