import { Row, Col } from "antd";
import ContactForm from "../components/forms/ContactFormComponent";

/**
 * React component for rendering a contact form.
 * @returns {JSX.Element} The rendered component.
 */
export default function Contact() {
  return (
    <Row>
      <Col
        span={12}
        offset={6}
        style={{ paddingTop: "6%", textAlign: "center" }}
      >
        <ContactForm />
      </Col>
    </Row>
  );
}
