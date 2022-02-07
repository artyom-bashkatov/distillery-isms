import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import { useMutation, useQuery } from "react-query";
import { getRequest, patchRequest } from "helpers/requests";
import { TEmployees, Employ } from "types/employees";
import { UserEditModal } from "components/UserEditModal/UserEditModal";
import { queryClient } from "index";

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
  {
    field: "last_status",
    headerName: "Last_status",
    width: 850,
    valueFormatter: (params) => {
      if (params && params.value) {
        return JSON.stringify(params.value);
      }
    },
  },
];

type TAuthError = {
  detail?: string;
};

type TRowData = {
  user: Employ;
  field: string;
};

type DataResponse = {
  employees_to_delete: Employ[]
}

function isTAuthError(arg: TAuthError | unknown): arg is TAuthError {
  return (arg as TAuthError)?.detail !== undefined;
}

function isDataResponse(arg: DataResponse | unknown): arg is DataResponse {
  return (arg as DataResponse)?.employees_to_delete !== undefined;
}

const DeletedEmployees: React.FC = () => {
  const [rows, setRows] = useState<TEmployees | unknown>([]);
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = useState<TRowData | null>(null);

  const getDeletedEmployees = async () => {
    return await getRequest("employees-to-delete/");
  };
  const { data } = useQuery("getDeletedEmployees", getDeletedEmployees);


  const mutation = useMutation(
    (param: Employ) => {
      return patchRequest(`employees/${param.id}/`, param);
    },
    {
      onSuccess: (changeData) => {
        handleClose();
        if (Array.isArray(data)) {
          const replaceIndex = data.findIndex((employ: Employ) => {
            return employ.id === (changeData as Employ).id;
          });
          const newData = [...data];
          newData[replaceIndex] = changeData;
          queryClient.setQueryData("getEmployees", newData);
        }
      },
    }
  );

  useEffect(() => {
    if (data && (data as DataResponse).employees_to_delete.length) {
      if (isDataResponse(data)) {
        setRows(data.employees_to_delete);
      }
    }
  }, [data]);

  if (isTAuthError(data)) {
    return <h1>{data.detail}</h1>;
  }

  if (!rows || !(rows as TEmployees[]).length) {
    return <h1>No deleted employees data</h1>;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setModalData(null);
  };

  const handleSave = (e: Employ) => {
    mutation.mutate(e);
  };

  const handleDoubleClick = (
    params: GridCellParams
  ) => {
    if (params.field === "comments") {
      handleOpen();
      setModalData({ user: params.row, field: params.field });
    }

    if (params.field === "last_status") {
      handleOpen();
      setModalData({ user: params.row, field: params.field });
    }
  };

  return (
    <>
      {Array.isArray(rows) && (rows as TEmployees[]).length ? (
        <div style={{ height: "80vh", width: "100%" }}>
          <DataGrid
            onCellDoubleClick={handleDoubleClick}
            rows={Array.isArray(rows) ? rows : []}
            columns={columns}
          />
        </div>
      ) : null}
      <UserEditModal
        onSave={(e) => handleSave(e)}
        data={modalData}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export { DeletedEmployees };
