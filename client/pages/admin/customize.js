import { Col, Row, Button, Form, Input, Image, Divider } from "antd";
import MediaTabs from "../../components/media/MediaTabs";
import { useMedia } from "../../context/media";
import { useHomepage } from "../../context/homepage";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

/**
 * Component for customizing the homepage.
 * @returns {JSX.Element} JSX for the Customize component.
 */
export default function Customize() {
  // context
  const { homepage, setHomepage } = useHomepage();
  const { media, setMedia } = useMedia();

  // state
  const [loading, setLoading] = useState(false);

  /**
   * Handles the form submission for customizing the homepage.
   * @param {Object} values - The form values including title and subtitle.
   */
  const sendPageUpdateRequest = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/page", {
        page: "home",
        title: values.title,
        subtitle: values.subtitle,
        titleImage: media.selected ? media.selected : homepage.titleImage,
      });
      setLoading(false);
      setHomepage(data);
      setMedia({ ...media, selected: null });
      toast.success("Edited homepage successfully!");
    } catch (err) {
      setLoading(false);
      toast.error(`Failed to update homepage: ${err.message}`);
    }
  };

  return (
    <>
      <Row>
        <Col span={24} style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "30px", fontFamily: "monospace" }}>
            Customize home page
          </h1>
          <h4>Set full-width image, title, and subtitle</h4>
        </Col>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <Col span={16} style={{ paddingLeft: 20 }}>
          <MediaTabs />
          <Divider />
          <Form
            style={{ paddingTop: 15, textAlign: "center" }}
            onFinish={sendPageUpdateRequest}
          >
            <Form.Item
              key="title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "You must provide a title",
                  type: "string",
                },
              ]}
            >
              <Input
                style={{ width: "80%" }}
                placeholder="Main Title"
                defaultValue={homepage.title}
              />
            </Form.Item>
            <Form.Item
              key="subtitle"
              name="subtitle"
              rules={[
                {
                  required: true,
                  message: "Please set a subtitle",
                  type: "string",
                },
              ]}
            >
              <Input
                style={{ width: "80%" }}
                placeholder="Subtitle"
                defaultValue={homepage.subtitle}
              />
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="default"
                htmlType="submit"
                style={{ width: "70%" }}
                loading={loading}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={8} style={{ textAlign: "center", paddingTop: 75 }}>
          {(media?.selected || homepage?.titleImage) && (
            <div style={{ textAlign: "center", display: "flex" }}>
              <Image
                style={{
                  height: "200px",
                  width: "90%",
                  objectFit: "cover",
                }}
                src={
                  media?.selected?.url ||
                  homepage?.titleImage?.url ||
                  "/images/no_image.jpg"
                }
                alt="Title Image"
              />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}
