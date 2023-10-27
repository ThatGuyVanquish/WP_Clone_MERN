import AuthorLayout from "../../components/layout/AuthorLayout";
import { Row, Col, Divider } from "antd";
import { useAuth } from "../../context/auth";
import { useStats } from "../../context/stats";
import UserStats from "../../components/user/UserStats";
import { useEffect } from "react";

/**
 * Component for displaying statistics in the Author view.
 * @returns {JSX.Element} JSX for the Author component.
 */
export default function Author() {
  // context
  const [auth] = useAuth();
  const { authorStats, fetchStats } = useStats();

  // hooks
  useEffect(() => {
    const fetchStatsOfAuthor = async (userID) => {
      try {
        await fetchStats(userID, "Author");
      } catch (err) {}
    };
    if (auth?.token) {
      fetchStatsOfAuthor(auth.user._id);
    }
  }, [auth]);

  return (
    <AuthorLayout>
      <Row>
        <Col span={24}>
          <Divider>
            <h1>Statistics</h1>
          </Divider>
        </Col>
      </Row>
      <UserStats userID={auth?.user?._id} role="Author" stats={authorStats} />
    </AuthorLayout>
  );
}
