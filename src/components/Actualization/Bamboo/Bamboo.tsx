import React, { useState } from "react";

import "./Bamboo.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { getRequest } from "helpers/requests";
import { Employ } from "types/employees";
import { LogsContainer } from "components/LogsContainer/LogsContainer";

type TSyncResponse = {
  message: string;
  skipped_lines?: Employ[];
}

function isBambooResponse(arg: TSyncResponse | unknown): arg is TSyncResponse {
  return (arg as TSyncResponse).message !== undefined;
}

export const Bamboo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [logs, setLogs] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setLoading(true);
    const result = await getRequest('employees/update-from-bamboo');
    if (isBambooResponse(result)) {
      setLogs(JSON.stringify(result?.skipped_lines));
      setMessage(result.message);
    }
    setLoading(false);
  }

  return (
    <>
      <LoadingButton onClick={handleClick}
        loading={loading} loadingIndicator="Loading..." variant="outlined">
        Fetch data
      </LoadingButton>
      <p>Результат синхронизации: {JSON.stringify(message)}</p>
      <div className="bamboo-logs">
      <LogsContainer logs={logs} headerText="skipped_lines" />
      </div>
    </>
  );
};
