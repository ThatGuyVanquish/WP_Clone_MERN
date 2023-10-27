import axios from "axios";
import { Row, Col, Card, Image, Typography, List, Avatar } from "antd";
import Head from "next/head";
import dayjs from "dayjs";
import Editor from "rich-markdown-editor";
import { useTheme } from "../../context/theme";
import CommentForm from "../../components/comments/CommentForm";
import { useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  sendCommentDeletionRequest,
  sendCommentCreationRequest,
} from "../../functions/comments";
import { useAuth } from "../../context/auth";
import { usePosts } from "../../context/posts";
import EditCommentModal from "../../components/comments/EditCommentModal";
import SidebarComponent from "../../components/posts/PostSidebarComponent";
import LinkToProfile from "../../components/user/ProfileLink";
dayjs.extend(relativeTime);

/**
 * Function that retrieves the post data from the server on the server side.
 * @param {object} params - The parameters including the post slug.
 * @returns {object} The post data.
 */
export async function getServerSideProps({ params }) {
  const { data } = await axios.get(`${process.env.API}/post/${params.slug}`);
  return { props: { post: data } };
}

const { Title } = Typography;

/**
 * React component for displaying a blog post.
 * @param {object} post - The post data.
 * @returns {JSX.Element} The rendered component.
 */
export default function Post({ post }) {
  const defaultImage = "/images/no_image.jpg";
  const title = post.title;
  const description = post.content.substring(0, 160);
  const content = post.content;

  // state
  const [comments, setComments] = useState(post.comments);
  /**
   * currentlyEditing state for holding an object of the comment which is being edited.
   * @state
   * @type {object}
   * @property {object} item - Comment object itself.
   * @property {string} content - The content of the comment being edited.
   */
  const [currentlyEditing, setCurrentlyEditing] = useState({
    item: null,
    content: "",
  });
  const [editingModalVisibility, setEditingModalVisibility] = useState(false);
  const [comment, setComment] = useState("");
  const [modalSize, setModalSize] = useState(720);
  const [loading, setLoading] = useState(false);
  // context
  const { theme } = useTheme();
  const [auth] = useAuth();
  const { generatePostDescription } = usePosts();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta description={description} />
      </Head>
      <Row>
        <Col xs={24} xl={16}>
          <Card
            cover={
              <Image
                src={post?.featuredImage?.url || defaultImage}
                alt={post.title}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "scale-down",
                  overflow: "clip",
                }}
              ></Image>
            }
          >
            <Title>{post.title}</Title>
            {generatePostDescription(post, comments)}
            <Editor
              value={content}
              readOnly={true}
              className="editor-scroll"
              dark={theme === "dark" ? true : false}
            />
            <br />
            <CommentForm
              comment={comment}
              setComment={setComment}
              submit={() =>
                sendCommentCreationRequest(
                  post,
                  comment,
                  setComment,
                  comments,
                  setComments,
                  setLoading
                )
              }
              loading={loading}
            />
            <br />
            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item) => (
                <List.Item
                  key={item._id}
                  id={item._id}
                  actions={
                    (auth?.user?.role === "Admin" ||
                      (auth?.user &&
                        auth.user._id.toString() === item.author?._id)) && [
                      <a
                        onClick={() => {
                          setCurrentlyEditing({
                            item: item,
                            content: item.content,
                          });
                          setEditingModalVisibility(true);
                        }}
                      >
                        edit
                      </a>,
                      <a
                        onClick={() =>
                          sendCommentDeletionRequest(
                            item,
                            comments,
                            setComments,
                            0 /*commentCount, means nothing here because i always display ALL of the posts comments regardless of amount TODO: add limiter and paging */,
                            (value) =>
                              null /*setCommentCount, doesn't matter here */
                          )
                        }
                      >
                        delete
                      </a>,
                    ]
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="circle">
                        {item.author?.username[0] || "☠️"}
                      </Avatar>
                    }
                    title={
                      item?.author ? (
                        <LinkToProfile user={item.author} />
                      ) : (
                        "DELETED USER"
                      )
                    }
                    description={`${item.content} - ${dayjs(
                      item.createdAt
                    ).fromNow()}`}
                    style={{ paddingLeft: "10px" }}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={22} xl={6} offset={1}>
          <SidebarComponent />
        </Col>
      </Row>
      <EditCommentModal
        currentlyEditing={currentlyEditing}
        setCurrentlyEditing={setCurrentlyEditing}
        comments={comments}
        setComments={setComments}
        loading={loading}
        setLoading={setLoading}
        modalVisibility={editingModalVisibility}
        setModalVisibility={setEditingModalVisibility}
        modalSize={modalSize}
      />
    </>
  );
}
