import React from "react";
import "./SwaggerDocs.css";
import MetaData from "../layout/MetaData";

const SwaggerDocs = () => {
  return (
    <>
      <MetaData
        title="API Docs"
        isApiDocs={true}
        description="API Documentation"
      />
      <div className="swagger-docs-container">
        <iframe
          src="/swagger-ui.html"
          title="Swagger UI"
          className="swagger-docs-iframe"
        ></iframe>
      </div>
    </>
  );
};
export default SwaggerDocs;
