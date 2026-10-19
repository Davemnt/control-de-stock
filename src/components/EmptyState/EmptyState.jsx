import React from "react";
import { Inbox } from "lucide-react";
import "./EmptyState.css";

const EmptyState = ({ icon: Icon = Inbox, title, description, action, compact = false }) => (
  <div className={`empty-state-box ${compact ? "compact" : ""}`}>
    <div className="empty-state-icon">
      <Icon size={compact ? 20 : 26} />
    </div>
    <p className="empty-state-title">{title}</p>
    {description && <p className="empty-state-desc">{description}</p>}
    {action && <div className="empty-state-action">{action}</div>}
  </div>
);

export default EmptyState;
