import { useContext, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { CartList, OrderSummary } from '../../components/cart';
import { ShopLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { CartContext } from '../../context';
import { countries } from '../../utils';

const SummaryPage = () => {
  const { shippingAddress, numberOfItems } = useContext(CartContext);

  const itemsNumber = useMemo(() => {
    return numberOfItems === 1 ? 'producto' : 'productos';
  }, [numberOfItems]);

  const countryName = useMemo(() => {
    if (shippingAddress && shippingAddress.country) {
      const country = countries.find(
        (country) => shippingAddress?.country === country.code
      );
      return country?.name;
    }
  }, [shippingAddress]);

  if (!shippingAddress) {
    return <></>;
  }

  const { firstName, lastName, address, address2, city, country, phone, zip } =
    shippingAddress;

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Order Details
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          {/* CartList */}
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summaryary-cart">
            <CardContent>
              <Typography variant="h2">
                Details ({numberOfItems} {itemsNumber})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Shipping Address</Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ''}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>{countryName}</Typography>
              <Typography>+{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirm order
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
