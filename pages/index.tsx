import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button, Grid } from "@mui/material";
import { read, utils, writeFileXLSX } from "xlsx";

export default function Home() {
  const [pres, setPres] = useState([]);
  const [__html, setHtml] = useState("");
  /* the ref is used in export */
  const tbl = useRef(null);

  // const exportFile = useCallback(() => {
  //   const ws = utils.json_to_sheet(pres);
  //   const wb = utils.book_new();
  //   utils.book_append_sheet(wb, ws, "Data");
  //   writeFileXLSX(wb, "SheetJSReactAoO.xlsx");
  // }, [pres]);

  const exportFile = useCallback(() => {
    const elt = tbl.current.getElementsByTagName("TABLE")[0];
    const wb = utils.table_to_book(elt);
    writeFileXLSX(wb, "SheetJSReactHTML.xlsx");
  }, [tbl]);

  const handleChangeFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = e.target?.files[0];
      const f = await file.arrayBuffer();
      const wb = read(f); // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
      const dataJson = utils.sheet_to_json(ws) as any; // generate objects
      const dataHtml = utils.sheet_to_html(ws) as any; // generate objects
      setPres(dataJson); // update state
      setHtml(dataHtml);

      console.log(Object.keys(dataJson[0]));
    },
    []
  );

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Grid item xs={12}>
        <Button variant="contained" component="label">
          Upload
          <input
            hidden
            accept=".xls,.xlsx"
            type="file"
            onChange={handleChangeFile}
          />
        </Button>
      </Grid>
      {__html && <div ref={tbl} dangerouslySetInnerHTML={{ __html }} />}
      <button onClick={exportFile}>Export XLSX</button>
    </Grid>
  );
}
