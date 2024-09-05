import React from "react";
import "./SwaggerDocs.css";

const SwaggerDocs = () => {
  return (
    <div className="swagger-docs-container">
      <iframe
        src="/swagger-ui.html"
        title="Swagger UI"
        className="swagger-docs-iframe"
      ></iframe>
    </div>
  );
};
export default SwaggerDocs;
