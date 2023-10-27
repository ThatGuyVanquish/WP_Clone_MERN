import { Col, Row } from 'antd';
import LoginFormComponent from "../components/forms/user_forms/login.js";

/**
 * React component for rendering a sign-in page.
 * @returns {JSX.Element} The rendered component.
 */
export default function SignIn() {
    return (
    <Row>
        <Col span={8} offset={8} style={{paddingTop: '20px'}}>
            <LoginFormComponent />
        </Col>
    </Row>
    )
}
