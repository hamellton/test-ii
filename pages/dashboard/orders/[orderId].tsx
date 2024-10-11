import { Box, Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const tickets = [
  {
    title: 'Episode 1: The Unreasonable Effectiveness of Mathematics',
    date: 'Tuesday, January 28 • 16:00 CET',
    attendess: [
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        price: 14
      },
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        price: 14
      },
    ]
  },
  {
    title: 'Episode 2: The Unreasonable Effectiveness of Mathematics',
    date: 'Tuesday, January 28 • 16:00 CET',
    attendess: [
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        price: 14
      },
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        price: 14
      },
    ]
  },
]

const Ticket = (ticket: any) => {
  return (
    <Box sx={{
      mb: 4
    }}>
      <Typography sx={{
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '150%',
        mb: 2,
      }}>
        {ticket.title}
      </Typography>
      <Typography sx={{ mb: 2 }}>{ticket.date}</Typography>
      {
        ticket.attendess.map((attendee: any, index: number) => {
          return (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }}>Attendee #{index + 1}</Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>Name</Typography>
                  <Typography>{attendee.name}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>Email</Typography>
                  <Typography>{attendee.email}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>Ticket Price</Typography>
                  <Typography>${attendee.price}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })
      }
    </Box >
  )
}

export default function Orders() {
  const router = useRouter();
  const { orderId } = router.query;
  console.log(orderId);

  const date = 'September 27, 2024 '
  const amount = 14

  return (
    <DashboardLayout isLoading={false}>
      <Box sx={{
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '720px',
          marginBottom: '2em',
        }}>
          <Link href='/dashboard/orders' sx={{ textDecoration: 'none', cursor: 'pointer' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <ChevronLeftIcon sx={{
                marginRight: '0.5em',
                fontSize: '1em',
                color: '#8060FE',
              }} />
              <Typography sx={{
                justifySelf: 'flex-start',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}>
                My Orders
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box>
          <Typography variant="h2" sx={{
            fontWeight: 'bold',
            fontSize: '32px',
            lineHeight: '150%',
            mb: 2,
          }}>
            Order #{orderId}
          </Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          gap: '10em',
        }}>
          <Box>
            <Typography>Purchased on <span style={{ fontWeight: 'bold' }}>{date}</span></Typography>
            <Typography>Order total: <span style={{ fontWeight: 'bold' }}>${amount}</span></Typography>
          </Box>
          <Box>
            {tickets.map((ticket: any, index: number) => { return <Ticket key={index} {...ticket} /> })}
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  )
} 