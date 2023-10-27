import { Col, Row } from 'antd'
import RegistrationFormComponent from '../components/forms/user_forms/register'

/**
 * React component for rendering a sign-up page.
 * @returns {JSX.Element} The rendered component.
 */
export default function SignUp() {
    return (
        <Row style={{paddingTop:'20px'}}>  
            <Col span={8} offset={8}>
            <RegistrationFormComponent />
            </Col>
        </Row>
    )
}
