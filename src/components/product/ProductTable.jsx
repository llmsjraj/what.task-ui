import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import useSWR, { mutate } from "swr";
import { fetcher, modifier } from "../../helpers/axios";

const columns = [
  {
    header: "Title",
    accessorKey: "title",
    sortable: true,
  },
  {
    header: "Description",
    accessorKey: "description",
    sortable: true,
  },
  {
    header: "Price",
    accessorKey: "price",
    sortable: true,
  },
  {
    header: "Stock",
    accessorKey: "stock",
    sortable: true,
  },
  {
    header: "Created",
    accessorKey: "created",
    sortable: true,
  },
];

const ProductTable = (props) => {
  const [products, setProducts] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    let curRowSelection = rowSelection;
    products.forEach((product) => {
      if (product.is_active) {
        curRowSelection = { ...curRowSelection, [product.id]: true };
        setRowSelection(curRowSelection);
      }
    });
  }, [keyword]);

  return (
    <div className="flex flex-col gap-3">
      <MaterialReactTable
        columns={columns}
        data={
          products
            ? products
            : [{ title: "", description: "", price: "", stock: "" }]
        }
        sortable
        enableColumnResizing
        enableMultiRowSelection
        enableSelectAll
        pagination
        enablePinning
        enableRowSelection
        getRowId={(row) => row.id}
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        enableGlobalFilter
        onGlobalFilterChange={async (keyword) => {
          setKeyword(keyword);
          if (keyword) localStorage.setItem("keyword", keyword);
          const products = await fetcher(`/api/product/?title=${keyword}`);
          setProducts(products);
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: async (event) => {
            row.getToggleSelectedHandler()(event);
            const updatedData = {
              ...row.original,
              is_active: !row.getIsSelected(),
            };
            const product = await modifier(
              `/api/product/?id=${row.original.public_id}`,
              updatedData
            );
          },
          sx: {
            cursor: "pointer",
          },
        })}
      />
    </div>
  );
};

export default ProductTable;
