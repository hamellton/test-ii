import { Box, Typography } from "@mui/material";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import OrdersTable from "@components/Tables/OrdersTable";

export default function Orders() {
  return (
    <DashboardLayout isLoading={false}>
      <Box sx={{ maxWidth: 850 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: '32px', lineHeight: '150%', mb: 2 }}>
            Manage Your Orders
          </Typography>
        </Box>
        <Box>
          <OrdersTable />
        </Box>
      </Box>
    </DashboardLayout>
  )
}