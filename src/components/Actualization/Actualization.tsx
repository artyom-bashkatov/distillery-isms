import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Bamboo } from "./Bamboo/Bamboo";
import { UploadReports } from "./Upload_reports/UploadReports";
import { EmployeesStatus } from "./EmployeesStatus/EmployeesStatus";

const TabPanel = (props: { children: ReactNode; value: number; index: number; }) => {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Actualization:React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
  };

  return <><Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
    <Tab label="Bamboo HR" />
    <Tab label="Download and Parse Reports" />
    <Tab label="Sync Employees Status" />
  </Tabs>
</Box>
<TabPanel value={value} index={0}>
  <Bamboo />
</TabPanel>
<TabPanel value={value} index={1}>
  <UploadReports />
</TabPanel>
<TabPanel value={value} index={2}>
  <EmployeesStatus />
</TabPanel></>
}