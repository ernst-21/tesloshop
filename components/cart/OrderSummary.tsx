import { Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { currency } from '../../utils';

const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100;

type Props = {
  orderValues?: {
    total: number;
    subTotal: number;
    numberOfItems: number;
    tax: number;
  };
};

export const OrderSummary: FC<Props> = ({ orderValues }) => {
  const { total, subTotal, numberOfItems, tax } = useContext(CartContext);

  const summaryValues = orderValues
    ? orderValues
    : { total, subTotal, numberOfItems, tax };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Products</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{summaryValues.numberOfItems}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Taxes ({taxRate}%)</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
        <Typography variant="subtitle1">
          {currency.format(summaryValues.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
