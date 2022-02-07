import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from 'react-query';
import { queryClient } from "index";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { UserEditModal } from "components/UserEditModal/UserEditModal";
import { TEmployees, Employ} from "types/employees";
import { getRequest, patchRequest } from "helpers/requests";
import { useTranslation } from "react-i18next";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "full_name_2", headerName: "FullName", width: 190 },
  { field: "work_email", headerName: "WorkEmail", width: 290 },
  { field: "hire_date", headerName: "HireDate", width: 140 },
  { field: "termination_date", headerName: "TerminationDate", width: 140 },
  { field: "location", headerName: "location", width: 180 },
  {
    field: "employment_history_status",
    headerName: "EmploymentHistoryStatus",
    width: 190,
  },
  { field: "comments", headerName: "Comments", width: 150 },
  { field: "last_status", headerName: "Last_status", width: 850, valueFormatter: (params) => {
    if (params && params.value) {
      return JSON.stringify(params.value);
    }
  }},
];

type TAuthError = {
  detail?: string;
}

type TRowData = {
  user: Employ;
  field: string;
}

function isTAuthError(arg: TAuthError | unknown): arg is TAuthError {
  return (arg as TAuthError)?.detail !== undefined;
}

const Users: React.FC = () => {
  const { t } = useTranslation();
  const [location, setlocation] = React.useState<string>(t("All"));
  const getEmployees = async () => {
    return await getRequest("employees/");
  }
  const { data } = useQuery("getEmployees", getEmployees);
  const mutation = useMutation((param: Employ) => {
    return patchRequest(`employees/${param.id}/`, param)
  }, {
    onSuccess: changeData => {
      handleClose();
      if(Array.isArray(data)) {
        const replaceIndex = data.findIndex((employ: Employ) => {
          return employ.id === (changeData as Employ).id
        });
        const newData = [...data];
        newData[replaceIndex] = changeData;
        queryClient.setQueryData("getEmployees", newData);
      }
    }});
  const [rows, setRows] = useState<TEmployees | unknown>([]);
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = useState<TRowData | null>(null);

  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      setRows(data);
    }
  }, [data]);

  if (isTAuthError(data)) {
    return <h1>{data.detail}</h1>;
  }

  if (!rows || !(rows as TEmployees[]).length) {
    return <h1>No employees data</h1>;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setModalData(null);
  }

  const handleSave = (e: Employ) => {
    mutation.mutate(e);
  }

  const computedlocationFilter = (): GridRowsProp | [] => {
    if (Array.isArray(rows)) {
      return rows.filter((row: Employ) => {
        if (location === "Все" || location === 'All') {
          return row;
        }
        if (location === "USA") {
          return row?.location?.includes("United States");
        }
        if (location === "México") {
          return row?.location?.includes("Mexico");
        }
        if (location === "Other") {
          if (!row?.location) {
            return row;
          }
          if (
            !row?.location?.includes("Argentina") &&
            !row?.location?.includes("United States") &&
            !row?.location?.includes("Mexico") &&
            !row?.location?.includes("Russia")
          ) {
            return row;
          }
        }
        return row?.location?.includes(location);
      });
    }
    return [];
  };

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: React.SetStateAction<string>
  ) => {
    setlocation(newValue);
  };

  const handleDoubleClick = (
    params: GridCellParams,
  ) => {
    console.info(params.row)
    if (params.field === 'comments') {
      handleOpen();
      setModalData({ user: params.row, field: params.field });
    }
    
    if(params.field === 'last_status') {
      handleOpen();
      setModalData({ user: params.row, field: params.field });
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={location}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value={t("All")} label={t("All")} />
          <Tab value="Argentina" label="Argentina" />
          <Tab value="México" label="México" />
          <Tab value="Russia" label="Russia" />
          <Tab value="USA" label="USA" />
          <Tab value="Other" label="Other" />
        </Tabs>
      </Box>
      {Array.isArray(rows) && (rows as TEmployees[]).length ? (
        <div style={{ height: "80vh", width: "100%" }}>
          <DataGrid
            onCellDoubleClick={handleDoubleClick}
            rows={computedlocationFilter()}
            columns={columns}
          />
        </div>
      ) : null}
      <UserEditModal onSave={(e) => handleSave(e)} data={modalData} open={open} onClose={handleClose} />
    </>
  );
};

export { Users };
