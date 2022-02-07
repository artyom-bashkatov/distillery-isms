import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { requestsConnectWise, requestsEMS, requestsKnowBe4 } from "mock-data/requests";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "FirstName", width: 190 },
  { field: "lastName", headerName: "LastName", width: 190 },
  { field: "workEmail", headerName: "WorkEmail", width: 290 },
  { field: "country", headerName: "Country", width: 180 },
];

export const Requests:React.FC = () => {

  const [service, setService] = React.useState<string>("ConnectWise");

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: React.SetStateAction<string>
  ) => {
    setService(newValue);
  };

  const computedRowsByService = () => {
    switch (service) {
      case "ConnectWise":
        return requestsConnectWise;
      case "EMS":
        return requestsEMS;
      case "KnowBe4":
        return requestsKnowBe4;
      default:
        return requestsConnectWise;
    }
  };

  return <>
    <Box sx={{ width: "100%" }}>
        <Tabs
          value={service}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="ConnectWise" label="ConnectWise" />
          <Tab value="EMS" label="EMS" />
          <Tab value="KnowBe4" label="KnowBe4" />
        </Tabs>
      </Box>
      <div style={{ height: "80vh", width: "100%" }}>
        <DataGrid rows={computedRowsByService()} columns={columns} />
      </div>
  </>
};