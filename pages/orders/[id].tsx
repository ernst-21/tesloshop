import { GetServerSideProps, NextPage } from 'next';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import {
  CreditScoreOutlined,
  CreditCardOffOutlined,
} from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  console.log({ order });

  const { shippingAddress, total, subTotal, numberOfItems, tax } = order;

  const orderValues = {
    total,
    subTotal,
    numberOfItems,
    tax,
  };

  return (
    <ShopLayout title="Order details" pageDescription="Order details">
      <Typography variant="h1" component="h1">
        Order: {order._id}
      </Typography>
      <Chip
        sx={{ my: 2 }}
        label={order.isPaid ? 'Order paid' : 'Payment pending'}
        variant="outlined"
        color={order.isPaid ? 'success' : 'error'}
        icon={
          order.isPaid ? <CreditScoreOutlined /> : <CreditCardOffOutlined />
        }
      />
      <Grid className="fadeIn" container>
        <Grid item xs={12} sm={7}>
          <CartList editable={false} products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summaryary-cart">
            <CardContent>
              <Typography variant="h2">
                Details ({order.numberOfItems}{' '}
                {order.numberOfItems === 1 ? 'product' : 'products'})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Shipping address</Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address}{' '}
                {shippingAddress.address2
                  ? `, ${shippingAddress.address2}`
                  : ''}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary orderValues={orderValues} />

              <Box sx={{ mt: 3 }}>
                {/* Todo */}
                {!order.isPaid && <h1>Pay</h1>}
                <Chip
                  sx={{ my: 2, width: '100%' }}
                  label={order.isPaid ? 'Order paid' : 'Payment pending'}
                  variant="outlined"
                  color={order.isPaid ? 'success' : 'error'}
                  icon={
                    order.isPaid ? (
                      <CreditScoreOutlined />
                    ) : (
                      <CreditCardOffOutlined />
                    )
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
