import React from "react";
import "./PageHeader.css";

const PageHeader = ({ title, subtitle, actions }) => (
  <div className="page-header">
    <div className="page-header-text">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actions && <div className="page-header-actions">{actions}</div>}
  </div>
);

export default PageHeader;
