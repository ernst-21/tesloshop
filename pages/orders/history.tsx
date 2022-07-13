import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { Chip, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React from 'react';
import { ShopLayout } from '../../components/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullName', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra información sobre si la orden está pagada o no',
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No Pagada" variant="outlined" />
      );
    },
  },
  {
    field: 'orden',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline="always">See order</Link>
        </NextLink>
      );
    },
  },
];

type Props = {
  orders: IOrder[];
};

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, idx) => ({
    id: idx + 1,
    paid: order.isPaid,
    fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }));

  return (
    <ShopLayout
      title="Orders history"
      pageDescription="History of client orders"
    >
      <Typography sx={{ mb: 1 }} variant="h1" component={'h1'}>
        Orders history
      </Typography>
      <Grid className="fadeIn" container sx={{ height: 650, width: '100%' }}>
        <Grid item xs={12}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      },
    };
  }

  const id = session.user._id;

  const orders = await dbOrders.getOrdersByUserId(id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
