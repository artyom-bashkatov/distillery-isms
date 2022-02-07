import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortItem } from "@mui/x-data-grid";
import { useQuery } from 'react-query';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { getRequest } from "helpers/requests";
import { TEmployees, Employ } from "types/employees";
import { useTranslation } from "react-i18next";
import { Calendar } from "components/Calendar/Calendar";
import { isEqual, isAfter } from 'date-fns';

import "./Employees.css";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "full_name_2", headerName: "FullName", width: 190 },
  { field: "work_email", headerName: "WorkEmail", width: 290 },
  { field: "location", headerName: "Location", width: 180 },
  { field: "hire_date", headerName: "HireDate", width: 140 },
  { field: "termination_date", headerName: "TerminationDate", width: 140 },
];

function isRowsEmployees(arg: Employ[] | unknown): arg is Employ[] {
  if(Array.isArray(arg)) {
    return (arg[0] as Employ)?.work_email ? true : false;
  }
  return false;
}

export const Employees:React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = React.useState<string>("new");
  const [rows, setRows] = useState<TEmployees | unknown>([]);
  const [date, setDate] = useState("");
  const [sortModel, setSortModel] = useState<GridSortItem[] | undefined>([
    {
      field: 'hire_date',
      sort: 'asc',
    },
  ]);
  const getEmployees = async () => {
    return await getRequest("employees/");
  }
  const { data } = useQuery("getEmployees", getEmployees);

  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      setRows(data);
    }
  }, [data]);

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: React.SetStateAction<string>
  ) => {
    setTab(newValue);
  };

  const computedRowsEmployees = () => {
    switch (tab) {
      case "new":
        if (isRowsEmployees(rows)) {
          if(date.length) {
            const newEmployees = rows.filter(item => item.termination_date === null);
            return newEmployees.filter(item => {
              return isEqual(new Date(item.hire_date), new Date(date))  || isAfter(new Date(item.hire_date), new Date(date))
            })
          }
          return rows.filter(item => item.termination_date === null);
        }
        return [];
      case "dismissed":
        if (isRowsEmployees(rows)) {
          if(date.length) {
            const fireEmployees = rows.filter(item => item.termination_date !== null);
            return fireEmployees.filter((item:Employ) => {
              if (item.termination_date) {
                return isEqual(new Date(item.termination_date), new Date(date))  || isAfter(new Date(item.termination_date), new Date(date))
              }
            })
          }
          return rows.filter(item => item.termination_date !== null);
        }
        return [];
      default:
        return [];
    }
  };

  const handleChangeCalendar = (value: string) => {
    setDate(value);
  }

  return <>
    <Box sx={{ width: "100%" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="new" label={t("newEmployees")} />
          <Tab value="dismissed" label={t("firedEmployees")} />
        </Tabs>
      </Box>
      <div style={{ height: "80vh", width: "100%" }}>
        <div className="employees-calendar">
          <Calendar onChange={handleChangeCalendar} formatDate="yyyy-MM-dd" />
        </div>
        <DataGrid sortModel={date.length ? sortModel : undefined} onSortModelChange={(model) => setSortModel(model)} rows={computedRowsEmployees()} columns={columns} />
      </div>
  </>
}