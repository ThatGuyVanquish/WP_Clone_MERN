import AdminLayout from "../../components/layout/AdminLayout";
import { Row, Col, Divider } from "antd";
import RenderProgress from "../../components/stats/RenderProgress";
import { useStats } from "../../context/stats";
import { useState, useEffect } from "react";

/**
 * Component for displaying administrative statistics.
 * @returns {JSX.Element} JSX for the Admin component.
 */
export default function Admin() {
  // context
  const { adminStats, fetchStats } = useStats();
  // state
  const [gotStats, setGotStats] = useState(false);

  // hooks
  useEffect(() => {
    if (!gotStats) {
      fetchStats();
      setGotStats(true);
    }
  }, [gotStats]);

  return (
    <AdminLayout>
      <Row>
        <Col span={24}>
          <Divider>
            <h1>Statistics</h1>
          </Divider>
        </Col>
      </Row>
      <Row>
        <Col
          span={12}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            name="Posts"
            number={adminStats.posts}
            link="/admin/posts"
          />
        </Col>
        <Col
          span={12}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            name="Comments"
            number={adminStats.comments}
            link="/admin/comments"
          />
        </Col>
      </Row>
      <Row>
        <Col
          span={12}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            name="Categories"
            number={adminStats.categories}
            link="/admin/categories"
          />
        </Col>
        <Col
          span={12}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            name="Users"
            number={adminStats.users}
            link="/admin/users"
          />
        </Col>
      </Row>
    </AdminLayout>
  );
}
