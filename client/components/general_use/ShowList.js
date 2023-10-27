import { useState } from "react";
import { Row, Col, Button } from "antd";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import { PlusOutlined } from "@ant-design/icons";
import approx from "approximate-number";

/**
 * A general component for displaying a list page with title, search functionality, and paging.
 *
 * @component
 * @param {object} props - The props for the component.
 * @param {React.Component} props.ListComponent - The component responsible for rendering the list items.
 * @param {object} props.ListComponentProps - Additional props to be passed to the ListComponent.
 * @param {string} props.title - The title to be displayed at the top of the list page.
 * @param {string} props.counterDescription - The description of the number of items displayed.
 * @param {number} props.maxAmountOfItems - The maximum number of items that can be displayed.
 * @param {boolean} props.showSearch - Whether to display the search bar.
 * @param {boolean} props.showNewButton - Whether to display a "New Item" button.
 * @param {string} props.newButtonURL - The URL to navigate to when clicking the "New Item" button.
 * @returns {JSX.Element}
 */
export default function ShowList({
  ListComponent,
  ListComponentProps = {},
  title,
  counterDescription,
  maxAmountOfItems,
  showSearch = true,
  showNewButton = false,
  newButtonURL = "",
  canEdit = false,
}) {
  // state
  const [keyword, setKeyword] = useState(""); // Keyword given in the search input.
  const [counter, setCounter] = useState(0); // Amount of items currently held by list's dataset.
  // Amount of items currently displayed based on keyword.
  const [amountOfDisplayedItems, setAmountOfDisplayedItems] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for submission button.
  const [page, setPage] = useState(1);

  // hooks
  const router = useRouter();
  return (
    <>
      <Row>
        <Col span={24}>
          <h1 style={{ marginBottom: "10px" }}>{title}</h1>
          <h2>
            {approx(amountOfDisplayedItems, {
              min10k: true,
              capital: true,
              decimal: ".",
              precision: 4,
            })}{" "}
            {counterDescription}
          </h2>
          {showSearch && <SearchBar setKeyword={setKeyword} />}
          {showNewButton && (
            <Button
              type="primary"
              style={{ margin: "10px 0px 10px 0px" }}
              icon={<PlusOutlined />}
              onClick={() => router.push(newButtonURL)}
            >
              Add New
            </Button>
          )}
        </Col>
      </Row>
      <ListComponent
        keyword={keyword}
        setCounter={setCounter}
        setAmountOfDisplayedItems={setAmountOfDisplayedItems}
        page={page}
        setLoading={setLoading}
        {...ListComponentProps}
        canEdit={canEdit}
      />
      <Row>
        <Col span={24} style={{ textAlign: "center", padding: 20 }}>
          {counter < maxAmountOfItems && (
            <Button
              size="large"
              type="primary"
              loading={loading}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Load More
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}
