import EditProfile from "../../../components/user/EditProfile";
import ProfileLayout from "../../../components/layout/ProfileLayout";
import axios from "axios";

export async function getServerSideProps({ params }) {
  const { id } = params;
  const { data } = await axios.get(`${process.env.API}/username/${id}`);
  return {
    props: {
      id,
      username: data,
    },
  };
}

/**
 * React component for the user's profile page.
 * @returns {JSX.Element} The rendered component.
 */
export default function Profile({ id, username }) {
  return (
    <ProfileLayout id={id} username={username}>
      <EditProfile />
    </ProfileLayout>
  );
}
