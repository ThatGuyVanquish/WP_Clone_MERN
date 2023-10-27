import { Row, Col } from "antd";
import RenderProgress from "../stats/RenderProgress";

/**
 * Component for displaying user statistics.
 * @component
 * @param {string} role - The role of the user.
 * @param {object} stats - The statistics of the user.
 */
export default function UserStats({ role, stats }) {
  console.log(`ROLE = ${role}, STATS = ${JSON.stringify(stats, null, 4)}`);
  return (
    <Row>
      {stats?.posts >= 0 && (
        <Col
          span={12}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            name="Posts"
            number={stats.posts}
            link={`/${role.toLowerCase()}/posts`}
          />
        </Col>
      )}
      <Col
        span={role.toString() === "Subscriber" ? 24 : 12}
        style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
      >
        <RenderProgress
          name="Comments"
          number={stats?.comments || 0}
          link={`/${role.toLowerCase()}/comments`}
        />
      </Col>
    </Row>
  );
}
