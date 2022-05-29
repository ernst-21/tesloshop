import { Chip, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React from "react";
import { ShopLayout } from "../../components/layouts";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullName", headerName: "Nombre Completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagada",
    description: "Muestra información sobre si la orden está pagada o no",
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
    field: "orden",
    headerName: "Ver orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline="always">Ver Orden</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: true, fullName: "Ernesto Rivera" },
  { id: 2, paid: false, fullName: "Reinier Pupo" },
  { id: 3, paid: true, fullName: "Gretna Sabariego" },
  { id: 4, paid: false, fullName: "Gabriela Rivera" },
  { id: 5, paid: true, fullName: "Selene Seleva" },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title="Historial de órdendes"
      pageDescription="Historial de órdenes del cliente"
    >
      <Typography variant="h1" component={"h1"}>
        Historial de órdendes
      </Typography>
      <Grid container sx={{ height: 650, width: "100%" }}>
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

export default HistoryPage;
