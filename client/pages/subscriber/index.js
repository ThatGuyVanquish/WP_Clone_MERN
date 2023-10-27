import SubscriberLayout from "../../components/layout/SubscriberLayout";
import { Row, Col, Divider } from "antd";
import { useAuth } from "../../context/auth";
import { useStats } from "../../context/stats";
import { useEffect } from "react";
import UserStats from "../../components/user/UserStats";

/**
 * React component for the subscriber's statistics page.
 * @returns {JSX.Element} The rendered component.
 */
export default function Subscriber() {
  // context
  const [auth] = useAuth();
  const { subscriberStats, fetchStats } = useStats();

  // hooks
  useEffect(() => {
    const fetchStatsOfAuthor = async (userID) => {
      try {
        await fetchStats(userID, "Subscriber");
      } catch (err) {}
    };
    if (auth?.token) {
      fetchStatsOfAuthor(auth.user._id);
    }
  }, [auth]);

  return (
    <SubscriberLayout>
      <Row>
        <Col span={24}>
          <Divider>
            <h1>Statistics</h1>
          </Divider>
        </Col>
      </Row>
      <UserStats
        userID={auth?.user?._id}
        role="Subscriber"
        stats={subscriberStats}
      />
    </SubscriberLayout>
  );
}
