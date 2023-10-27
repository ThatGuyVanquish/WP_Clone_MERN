import { Col, Row } from "antd";
import ForgotPasswordFormComponent from "../components/forms/user_forms/forgotPassword.js";

/**
 * React component for rendering the forgot password page.
 * @returns {JSX.Element} The rendered component.
 */
export default function ForgotPassword() {
  return (
    <Row>
      <Col span={8} offset={8} style={{ paddingTop: "20px" }}>
        <h1>Forgot Password</h1>
        <ForgotPasswordFormComponent />
      </Col>
    </Row>
  );
}
