import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

/**
 * Component for a search bar.
 *
 * @component
 * @param {object} props - The props for the component.
 * @property {function} props.setKeyword - A function to set the search keyword.
 * @returns {JSX.Element}
 */
export default function SearchBar({ setKeyword }) {
  /**
   * Handles the change event of the search input field.
   *
   * @param {object} e - The change event.
   */
  const handleSearchInputChange = (e) => {
    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <Input
      type="search"
      prefix={<SearchOutlined />}
      placeholder={"Search"}
      onChange={handleSearchInputChange}
    />
  );
}
