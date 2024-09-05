import React from "react";
import Helmet from "react-helmet";

const MetaData = ({ title, description, isApiDocs = false }) => {
  const apiDocsImage = "/api-docs-og.png";
  const mainImage = "/main-og.png";
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={isApiDocs ? apiDocsImage : mainImage}
      />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </Helmet>
  );
};

export default MetaData;
