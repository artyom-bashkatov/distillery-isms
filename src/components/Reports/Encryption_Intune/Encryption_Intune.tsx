import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { DataGrid, GridColDef, GridColumnVisibilityChangeParams } from "@mui/x-data-grid";
import { ArrayEmployees } from "types/employees";
import { getRequest } from "helpers/requests";

type TParams = {
  row: {
    last_status: {
      [key: string]: number|boolean|string
    }
  },
  field: string
}

const getValue = (params: TParams) => {
  return params.row?.last_status?.[params.field];
}

const columns: GridColDef[] = [
  { field: "full_name_2", headerName: "Full Name", width: 200},
  { field: "work_email", headerName: "Work Email", width: 200},
  { field: "location", headerName: "Location", width: 200},
  { field: "encryption_status", valueGetter: getValue, headerName: "Encryption_status", width: 200},
  { field: "connect_wise", valueGetter: getValue, headerName: "Connect_wise", width: 200},
];

type TAuthError = {
  detail?: string;
};

function isTAuthError(arg: TAuthError | unknown): arg is TAuthError {
  return (arg as TAuthError)?.detail !== undefined;
}

function isArrayOfEmployees(arg: ArrayEmployees): arg is ArrayEmployees {
  return (arg as ArrayEmployees)[0]?.full_name_2 !== undefined;
}

export const Encryption_Intune: React.FC = () => {
  const getEmployees = async () => {
    return await getRequest("employees/");
  };
  const { data } = useQuery("getEmployees", getEmployees);
  const [rows, setRows] = useState<ArrayEmployees | null>(null);

  useEffect(() => {
    if (Array.isArray(data) && isArrayOfEmployees(data)) {
      setRows(data);
    }
  }, [data]);

  const saveVisibleRows = () => {
    localStorage.setItem('encryption_intune_state', JSON.stringify(columns))
  }

  useEffect(() => {
    if (localStorage.getItem('encryption_intune_state') !== null) {
      const state = localStorage.getItem('encryption_intune_state');
      if (state) {
        for (const key of JSON.parse(state)) {
          if (Object.prototype.hasOwnProperty.call(key, 'hide')) {
            const index = columns.findIndex((item: GridColDef) => {
              if(key.hide) {
                return item.field === key.field
              }
            });
            if(index >= 0) {
              columns[index].hide = key.hide;
            }
          }
        }
      }
    }
    window.addEventListener('beforeunload', saveVisibleRows);

    return () => {
      window.removeEventListener('beforeunload', saveVisibleRows);
    }
  }, [])

  if (isTAuthError(data)) {
    return <h1>{data.detail}</h1>;
  }

  if (!data || (Array.isArray(data) && !data.length)) {
    return <h1>No employees data</h1>;
  }

  const handleVisibility = (params: GridColumnVisibilityChangeParams) => {
    const field = params.field;
    const index = columns.findIndex((item: GridColDef) => {
      return item.field === field;
    })
    columns[index].hide = !params.isVisible
  }

  return (
    <>
      {rows && Array.isArray(rows) && (
        <div style={{ height: "80vh", width: "100%" }}>
          <DataGrid onColumnVisibilityChange={handleVisibility} rows={rows} columns={columns} />
        </div>
      )}
    </>
  );
};
