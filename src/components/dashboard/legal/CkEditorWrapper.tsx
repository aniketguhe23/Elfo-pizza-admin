"use client";

import dynamic from "next/dynamic";
import React from "react";

const CKEditor = dynamic(
  async () => {
    const { CKEditor } = await import("@ckeditor/ckeditor5-react");
    const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;
    return function Wrapper(props: any) {
      return <CKEditor editor={ClassicEditor} {...props} />;
    };
  },
  { ssr: false }
);

export default CKEditor;
