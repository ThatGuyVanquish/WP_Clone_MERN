import Head from "next/head";
import FullWidthImage from "../components/homepage/FullWidthImage";
import RenderProgress from "../components/stats/RenderProgress";
import { useStats } from "../context/stats";
import { useLatestPosts } from "../context/posts";
import { Col, Row, Divider } from "antd";
import { EyeTwoTone } from "@ant-design/icons";
import Link from "next/link";
import slugify from "slugify";
import ParallaxImage from "../components/homepage/ParallaxImage";
import ShowCategories from "../components/categories/ShowCategoriesComponent";
import Footer from "../components/homepage/Footer";
import { useState, useEffect } from "react";

/**
 * React component for rendering the home page.
 * @returns {JSX.Element} The rendered component.
 */
export default function Home() {
  // context
  const { adminStats, fetchStats } = useStats();
  const { latestPosts } = useLatestPosts();
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
    <>
      <Head>
        <title>CMS</title>
        <meta name="description" content="BLYAT WORK" />
      </Head>
      <FullWidthImage />
      <Row>
        <Col
          key={1}
          span={6}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            key="PostsRender"
            name="Posts"
            number={adminStats.posts}
            link="/posts"
            fontColor="black"
          />
        </Col>
        <Col
          key={2}
          span={6}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            key="CommentsRender"
            name="Comments"
            number={adminStats.comments}
            fontColor="black"
          />
        </Col>
        <Col
          key={3}
          span={6}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            key="CategoriesRender"
            name="Categories"
            link="/categories"
            number={adminStats.categories}
            fontColor="black"
          />
        </Col>
        <Col
          key={4}
          span={6}
          style={{ marginTop: 100, textAlign: "center", fontSize: 20 }}
        >
          <RenderProgress
            key="UsersRender"
            name="Users"
            number={adminStats.users}
            fontColor="black"
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ParallaxImage>
              <h1
                style={{
                  fontSize: 70,
                  fontFamily: "monospace",
                  color: "white",
                }}
              >
                POSTS
              </h1>
              <Divider
                key="PostsDivider"
                style={{ marginTop: "-40px", marginBottom: "5px" }}
              >
                <EyeTwoTone twoToneColor="lightblue" style={{ fontSize: 30 }} />
              </Divider>
              {latestPosts.map((post) => (
                <Link
                  key={post.title}
                  href={`/post/${slugify(post.title)}`}
                  style={{ marginBottom: 2 }}
                >
                  <pre
                    style={{
                      color: "white",
                      fontFamily: "inherit",
                      fontSize: 15,
                    }}
                  >
                    {post.title}
                  </pre>
                </Link>
              ))}
            </ParallaxImage>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div style={{ marginBottom: "10%" }}>
            <ShowCategories fontSize="25px" />
          </div>
        </Col>
      </Row>
      <Footer />
    </>
  );
}
