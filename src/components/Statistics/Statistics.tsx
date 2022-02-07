import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { statistics } from "mock-data/statistics";

import "./Statistics.css";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const rows = [
  { name: 'ConnectWise', data: statistics.connectWise },
  { name: 'EMS', data: statistics.ems },
  { name: 'KnowBe4', data: statistics.knowBe4 },
  { name: 'Microsoft Secure Score', data: statistics["Microsoft Secure Score"] },
  { name: 'Information Security Policy', data: statistics["Information Security Policy"] },
  { name: 'Telecommuting Security Policy', data: statistics["Telecommuting Security Policy"] },
  { name: 'Data encryption', data: statistics["Data encryption"] },
  { name: 'Microsoft account', data: statistics["Microsoft account"] }
];

export const Statistics:React.FC = () => {
  return <><TableContainer component={Paper}>
  <Table id="table-to-xls" sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell>Название поля</TableCell>
        <TableCell align="right">Weekly Increase</TableCell>
        <TableCell align="right">Complete</TableCell>
        <TableCell align="right">Russia</TableCell>
        <TableCell align="right">Mexico</TableCell>
        <TableCell align="right">Argentina</TableCell>
        <TableCell align="right">USA</TableCell>
        <TableCell align="right">Other</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.name}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.data.weeklyIncrease.sign}{row.data.weeklyIncrease.value} %</TableCell>
          <TableCell align="right">{row.data.complete} %</TableCell>
          <TableCell align="right">{row.data.russia} %</TableCell>
          <TableCell align="right">{row.data.mexico} %</TableCell>
          <TableCell align="right">{row.data.argentina} %</TableCell>
          <TableCell align="right">{row.data.usa} %</TableCell>
          <TableCell align="right">{row.data.other} %</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
<div className="excel-statistics">
<ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Excel - XLS"/></div>
</>
}