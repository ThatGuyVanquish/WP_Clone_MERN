import axios from "axios";
import toast from "react-hot-toast";

/**
 * Fetches user data from the server and updates the state.
 *
 * @param {Array} users - Array of already fetched users.
 * @param {Function} setUsers - A state setter function for users.
 * @param {Function} setCounter - A state setter function for the user count.
 * @param {Function} setLoading - A setter function for the button loading state.
 * @param {Number} page - The page number to fetch the user data from.
 */
export const fetchUsersByPage = async (
  users,
  setUsers,
  setCounter,
  setLoading,
  page
) => {
  setLoading(true);
  try {
    const { data } = await axios.get(`/users/${page}`);
    if (page === 1) {
      setUsers(data);
      setCounter(data.length);
    } else {
      setCounter(users.length + data.length);
      setUsers([...users, ...data]);
    }
    setLoading(false);
  } catch (err) {
    toast.error(`Failed to fetch users from page ${page}: ${err.message}`);
  }
};

/**
 * Sends a request to delete a user from the server.
 *
 * @param {Object} params - Deletion request parameters.
 * @param {Object} params.user - The user to be deleted.
 * @param {string} params.myID - The ID of the requesting user.
 * @param {Array} params.users - The current user list state.
 * @param {Function} params.setUsers - A state setter function for users.
 */
export const sendUserDeletionRequest = async ({
  user,
  myID,
  users,
  setUsers,
}) => {
  if (user._id === myID) {
    alert("You can't delete yourself");
    return;
  }
  if (user.role === "Admin") {
    alert("You can't delete other admins");
    return;
  }
  const confirmation = window.confirm(
    "Are you sure you want to delete this user?"
  );
  if (!confirmation) return;
  try {
    const { data } = await axios.delete(`/users/${user._id}`);
    if (data?.ok) {
      toast.success("User deleted!");
      setUsers(users.filter((currentUser) => currentUser._id != user._id, []));
    } else {
      toast.error("Failed to delete user");
    }
  } catch (err) {
    toast.error(`Failed to delete user: ${err}`);
  }
};

/**
 * Sends a request to create a new user.
 *
 * @param {string} email - The email of the new user.
 * @param {string} phone - The phone number of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} role - The role of the new user.
 * @param {boolean} notify - Indicates if notifications should be sent.
 * @param {Function} setLoading - A state setter function for loading.
 * @param {object} router - The router object for navigation.
 */
export const sendUserCreationRequest = async (
  username,
  email,
  name,
  phone,
  password,
  role,
  notify,
  setLoading,
  router
) => {
  setLoading(true);
  try {
    const { data } = await axios.post(`/create-user`, {
      username,
      email: email.toLowerCase(),
      name,
      phone,
      password,
      role,
      notify,
    });
    setLoading(false);
    if (data?.error) {
      toast.error(`User creation failed: ${data.error}`);
    } else {
      toast.success("User created successfully!");
      router.push("/admin/users");
    }
  } catch (err) {
    setLoading(false);
    toast.error("User creation failed.");
  }
};

/**
 * Sends a request to update user information.
 *
 * @param {string} slug - The slug of the user to be updated.
 * @param {string} email - The updated email of the user.
 * @param {string} phone - The updated phone number of the user.
 * @param {string} password - The updated password of the user.
 * @param {string} role - The updated role of the user.
 * @param {object} media - The updated user media information.
 * @param {Function} setMedia - A state setter function for media.
 * @param {object} auth - The user's authentication information.
 * @param {Function} setAuth - A state setter function for authentication.
 * @param {string} setPassword - The updated password of the user.
 * @param {Function} setLoading - A state setter function for loading.
 * @param {boolean} chooseRole - Indicates if a role is chosen during the update.
 * @param {object} router - The router object for navigation.
 */
export const sendUserUpdateRequest = async (
  slug,
  email,
  phone,
  password,
  role,
  media,
  setMedia,
  auth,
  setAuth,
  setPassword,
  setLoading,
  chooseRole,
  router
) => {
  console.log(`Updating user ${slug}`);
  setLoading(true);
  try {
    const { data } = await axios.put(`/user/${slug}`, {
      email: email.toLowerCase(),
      phone,
      password,
      role,
      image: media?.selected?._id,
    });
    if (data?.error) {
      setLoading(false);
      toast.error(data?.error);
    } else {
      setLoading(false);
      // console.log(`User updated: ${JSON.stringify(data, null, 4)}`);
      if (auth?.user?.slug === slug) {
        setAuth({ ...auth, user: data });
        let localStorageAuth = JSON.parse(localStorage.getItem("auth"));
        localStorageAuth.user = data;
        localStorage.setItem("auth", JSON.stringify(localStorageAuth));
      }
      setMedia({ ...media, selected: null });
      if (chooseRole) {
        router.push(`/admin/users`);
      } else {
        setPassword("");
      }
      toast.success("Successfully updated the user");
    }
  } catch (err) {
    toast.error(`Failed to update user: ${err.message}`);
  }
};

/**
 * Fetches user information by ID and updates the state.
 *
 * @param {string} id - The ID of the user to be fetched.
 * @param {Function} setEmail - A state setter function for email.
 * @param {Function} setPhone - A state setter function for phone.
 * @param {Function} setRole - A state setter function for role.
 * @param {object} media - The user media information state.
 * @param {Function} setMedia - A state setter function for media.
 * @param {object} router - The router object for navigation.
 */
export const fetchUser = async (
  slug,
  setUsername,
  setEmail,
  setName,
  setPhone,
  setRole,
  media,
  setMedia,
  router
) => {
  try {
    if (!slug) {
      toast.error("SHIEEET");
      return;
    }
    const { data } = await axios.get(`/user/${slug}`);
    if (data?.error) {
      toast.error(
        `Failed to get user information: ${JSON.stringify(data.error)}`
      );
      router.push("/admin/users");
    } else {
      setUsername(data.username);
      setEmail(data.email);
      setName(data.name);
      setPhone(data.phone);
      setRole(data.role);
      if (data.image) setMedia({ ...media, selected: data.image });
    }
  } catch (err) {
    toast.error(`Failed to get user information: ${err.message}`);
  }
};

/**
 * Fetches the count of user data from the server.
 *
 * @param {Function} setUserCount - A state setter function for user count.
 */
export const fetchUserCount = async (setUserCount) => {
  try {
    const { data } = await axios.get(`/user-count`);
    setUserCount(data);
  } catch (err) {
    toast.error(`Failed to fetch user count: ${err.message}`);
  }
};

export const getUserRole = async (userID) => {
  try {
    const { data } = await axios.get(`/user-role/${userID}`);
  } catch (err) {}
};

export const fetchUsername = async (id, setUsername) => {
  try {
    const { data } = await axios.get(`/username/${id}`);
    setUsername(data);
  } catch (err) {}
};
