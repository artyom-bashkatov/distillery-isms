import React, { useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useQuery } from 'react-query';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { getRequest } from "helpers/requests";
import { debounce } from "lodash";

type TParams = {
  row: {
    last_status: {
      [key: string]: number|boolean|string
    }
  },
  field: string
}

function getDataEcryptionValue(params: TParams) {
  return params?.row?.last_status?.encryption_status ?? 0;
}

function getConnectWiseValue(params: TParams) {
  return params?.row?.last_status?.connect_wise ?? 0;
}

function getInformationSecurityPolicyValue(params: TParams) {
  return params?.row?.last_status?.signing ?? 0;
}

function getKnowBe4Value(params: TParams) {
  return params?.row?.last_status?.kb4 ?? 0;
}

function get2stepVerificationValue(params: TParams) {
  return params?.row?.last_status?.verification_enrolled ?? 0;
}

function getOSVersionValue(params: TParams) {
  return params?.row?.last_status?.device_inv ?? 0;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "location", headerName: "Location / Office", width: 120 },
  { field: "work_email", headerName: "Email address", width: 250 },
  { field: "Data encryption", headerName: "Data encryption", width: 150, valueGetter: getDataEcryptionValue },
  { field: "ConnectWise", headerName: "ConnectWise", width: 150, valueGetter: getConnectWiseValue },
  { field: "Information Security Policy", headerName: "Information Security Policy", width: 250, valueGetter: getInformationSecurityPolicyValue },
  { field: "KnowBe4", headerName: "KnowBe4", width: 150, valueGetter: getKnowBe4Value },
  { field: "2-step verification", headerName: "2-step verification", width: 150, valueGetter: get2stepVerificationValue },
  { field: "OS version", headerName: "OS version", width: 950, valueGetter: getOSVersionValue },
];

const Services: React.FC = () => {
  const [country, setCountry] = useState<string>("Global");
  const [searchValue, setSearchValue] = useState('');
  const getEmployees = async () => {
    return await getRequest("employees/");
  }
  const { data } = useQuery("getEmployees", getEmployees);

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: React.SetStateAction<string>
  ) => {
    setCountry(newValue);
  };

  const computedRowsByCountry = () => {
    const generalLocations = ['Argentina', 'Mexico', 'Russia', 'USA']
    switch (country) {
      case "Global":
        return Array.isArray(data) ? data : [];
      case "Argentina":
        return Array.isArray(data) ? data.filter(item => item.location === 'Argentina') : [];
      case "México":
        return Array.isArray(data) ? data.filter(item => item.location === 'Mexico') : [];
      case "Russia":
        return Array.isArray(data) ? data.filter(item => item.location === 'Russia') : [];
      case "USA":
        return Array.isArray(data) ? data.filter(item => item.location === 'USA') : [];
      default:
        return Array.isArray(data) ? data.filter(item => !generalLocations.includes(item.location)) : [];
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setSearchValue(e.target.value);
  }

  const debouncedEventHandler = useMemo(
    () => debounce(handleSearchChange, 300)
  , []);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={country}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="Global" label="Global" />
          <Tab value="Argentina" label="Argentina" />
          <Tab value="México" label="México" />
          <Tab value="Russia" label="Russia" />
          <Tab value="USA" label="USA" />
          <Tab value="Other" label="Other" />
        </Tabs>
      </Box>
      <div className="search">
      <TextField
          id="standard-search"
          label="Search field"
          type="search"
          variant="standard"
          onChange={debouncedEventHandler}
        />
      </div>
      <div style={{ height: "80vh", width: "100%", marginTop: "1em" }}>
        <DataGrid filterModel={{
    items: [{ columnField: 'work_email', operatorValue: 'contains', value: searchValue.length ? searchValue : undefined }],
  }} rows={computedRowsByCountry()} columns={columns} />
      </div>
    </>
  );
};

export { Services };
