import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';
import { useRouter } from 'next/router'

export default function OrdersTable() {
  const router = useRouter()

  function createData(
    orderId: string,
    date: string,
    amount: number,
  ) {
    return { orderId, date, amount };
  }

  const rows = [
    createData(
      '208585764',
      'September 27, 2024',
      14,
    ),
  ];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order Id</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.orderId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              onClick={() => { router.push(`/dashboard/orders/${row.orderId}`) }}
            >
              <TableCell>{row.orderId}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell align="right">${row.amount}</TableCell>
              <TableCell align="right"><LaunchIcon sx={{ fontSize: '1em', mt: 1, mr: 2 }} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
  );
}