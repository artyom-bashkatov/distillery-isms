import React from "react";
import Typography from "@mui/material/Typography";

import "./LogsContainer.css";

export const LogsContainer: React.FC<{
  logs: string | null;
  headerText?: string | null;
}> = ({
  logs,
  headerText = null,
}: {
  logs: string | null;
  headerText?: string | null;
}) => {
  return (
    <>
      <div className="logs-title">
        <Typography variant="subtitle2" sx={{ color: "white" }}>
          Logs: {headerText && headerText}
        </Typography>
      </div>
      <div className="logs-container">
        {logs && logs}
      </div>
    </>
  );
};
