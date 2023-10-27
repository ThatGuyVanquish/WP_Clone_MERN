import ParallaxImage from "./ParallaxImage";
import { Row, Col } from "antd";
import {
  TransactionOutlined,
  CopyrightCircleOutlined,
  ApiOutlined,
} from "@ant-design/icons";

/**
 * Footer component that displays content at the bottom of the homepage.
 *
 * @component
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be displayed within the footer.
 * @returns {JSX.Element} Footer component.
 */
export default function Footer({ children }) {
  return (
    <ParallaxImage url="/images/swiss1.jpg" bgPosition="left bottom">
      <Row>
        <Col span={8} style={{ textAlign: "center", color: "white" }}>
          <TransactionOutlined style={{ fontSize: 50, color: "white" }} />
          <br />
          <pre>a Yuan icon?</pre>
        </Col>
        <Col span={8} style={{ textAlign: "center", color: "white" }}>
          <CopyrightCircleOutlined style={{ fontSize: 50, color: "white" }} />
          <br />
          <pre>random footer</pre>
        </Col>
        <Col span={8} style={{ textAlign: "center", color: "white" }}>
          <ApiOutlined style={{ fontSize: 50, color: "white" }} />
          <br />
          <pre>obviously</pre>
        </Col>
      </Row>
    </ParallaxImage>
  );
}
