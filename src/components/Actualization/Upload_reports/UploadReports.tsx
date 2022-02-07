import React, { useState } from "react";
import Button from "@mui/material/Button";

import Input from "@mui/material/Input";
import { postRequest } from "helpers/requests";

import "./UploadReports.css";
import { LogsContainer } from "components/LogsContainer/LogsContainer";
import { Calendar } from "components/Calendar/Calendar";
import { format } from 'date-fns';

export const UploadReports: React.FC = () => {
  const [logs, setLogs] = useState<string | null>(null);
  const [dateFromCalendar, setDateFromCalendar] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [fileName, setFileName] = useState("");
  const [reportObject, setReportObject] = useState(new FormData());
  const [loading, setLoading] = useState(false);

  const handleSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files) {
      setFileName(event.target.files[0].name);
      const formData = new FormData();
      formData.append("file", event.target.files[0], event.target.files[0].name);
      formData.append("date", dateFromCalendar);
      setReportObject(formData)
    }
  };

  const handleChangeCalendar = (value: string) => {
    setDateFromCalendar(value);
  }

  const uploadReportToServer = async () => {
    setLoading(true);
    try {
      const res = await postRequest("upload/", reportObject, true);
      setLogs(JSON.stringify(res));
    } catch(e) {
      console.error('Error when upload report', e)
      setLogs(JSON.stringify(e));
    } finally {
      setTimeout(() => {
        setLoading(false);
        setFileName("")
      }, 2000)
    }
  }

  return (
    <>
      <div className={`animationBorder ${loading ? "loading" : ""}`}>
        <div className="animationBorderBody">
          <div className="animationBorderTop">
          <p className="fileName">File: {fileName.length ? fileName : ''}</p>
          <div className="animationBorderCalendar">
            <Calendar onChange={handleChangeCalendar} formatDate="yyyy-MM-dd" />
          </div>
          </div>
          <div className="animationBorderBottom">
          <label className="labelButton" htmlFor="contained-button-file">
        <Input
          onChange={handleSelectFile}
          className="intune_upload"
          id="contained-button-file"
          type="file"
        />
        <Button disabled={loading} className="animationButton" variant="contained" component="span">
          Select report to upload
        </Button>
      </label>
      <Button disabled={!fileName.length || loading} className="animationButton" onClick={uploadReportToServer} variant="contained" component="span">
          Run upload
        </Button>
          </div>
        
        </div>
      </div>

      <div className="intune-logs">
      <LogsContainer logs={logs} />
      </div>
    </>
  );
};
