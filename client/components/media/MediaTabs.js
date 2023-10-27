import React from "react";
import UploadFile from "./UploadFile";
import { MediaLibrary } from "./MediaLibrary";
import { Tabs } from "antd";

const { Item } = Tabs;

/**
 * Component that provides a tabbed interface for uploading files and accessing the media library.
 * @component
 */
export default function MediaTabs() {
  return (
    <Tabs>
      <Item tab="Upload File" key="1">
        <UploadFile />
      </Item>
      <Item tab="Media Library" key="2">
        <MediaLibrary />
      </Item>
    </Tabs>
  );
}
