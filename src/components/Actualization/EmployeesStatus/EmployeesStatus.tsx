import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { getRequest } from "helpers/requests";

import "./EmployStatus.css";
import { LogsContainer } from "components/LogsContainer/LogsContainer";

type TEmployStatusResponse = {
  Updated: number;
  Created: number;
  Skipped: number;
};

function isEmployStatusResponse(
  arg: TEmployStatusResponse | unknown
): arg is TEmployStatusResponse {
  return (arg as TEmployStatusResponse).Updated !== undefined;
}

export const EmployeesStatus: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    const result = await getRequest("update-employee-json-field/");
    if (isEmployStatusResponse(result)) {
      setLogs(JSON.stringify(result));
    }
    setLoading(false);
  };

  return (
    <>
      <LoadingButton
        onClick={handleClick}
        loading={loading}
        loadingIndicator="Loading..."
        variant="outlined"
      >
        UpdateJsonFields
      </LoadingButton>
      <div className="employees-logs">
        <LogsContainer logs={logs} />
      </div>
    </>
  );
};
