import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import { read, utils, writeFileXLSX } from "xlsx";
import InputItem from "@/components/InputItem";
import { FileUpload } from "@/components/types";

const defaultFile: FileUpload = {
  fileData: [],
  fileName: "",
  startRow: 1,
  columnsKey: [],
  columnsCompare: [],
  optionColumns: [],
};

export default function Home() {
  const [fileUpload, setFileUpload] = useState<FileUpload[]>([
    defaultFile,
    defaultFile,
  ]);
  const [__html, setHtml] = useState("");
  /* the ref is used in export */
  const tbl = useRef(null);

  // const handleExport = useCallback(() => {
  //   const ws = utils.json_to_sheet(dataCompare);
  //   const wb = utils.book_new();
  //   utils.book_append_sheet(wb, ws, "Data");
  //   writeFileXLSX(wb, "SheetJSReactAoO.xlsx");
  // }, [dataCompare]);

  // const handleExport1 = useCallback(() => {
  //   const elt = tbl.current.getElementsByTagName("TABLE")[0];
  //   const wb = utils.table_to_book(elt);
  //   writeFileXLSX(wb, "SheetJSReactHTML.xlsx");
  // }, [tbl]);

  const handleChangeFile = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, idx: number): Promise<void> => {
      const file = e.target?.files[0];
      const f = await file.arrayBuffer();
      const wb = read(f); // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
      const dataJson = utils.sheet_to_json(ws) as any; // generate objects
      setFileUpload((state) => {
        return [
          ...state.map((x, idxState) => {
            if (idxState != idx) return { ...x };
            return {
              fileData: dataJson,
              fileName: file.name,
              startRow: 1,
              columnsKey: [],
              columnsCompare: [],
              // optionColumns: [...Object.keys(dataJson[x.startRow])], cho compare
              optionColumns: [...Object.keys(dataJson[0])], // cho map data
            };
          }),
        ];
      });
    },
    []
  );

  // const handleChangeInput = useCallback(
  //   (
  //     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //     idx: number,
  //     name: string
  //   ): void => {
  //     setFileUpload((state) => {
  //       return [
  //         ...state.map((x, idxState) => {
  //           if (idxState != idx) return x;
  //           if (name === "startRow") {
  //             x.startRow = +e.target.value;
  //             x.optionColumns = [...Object.keys(x.fileData[x.startRow])];
  //           }
  //           return { ...x };
  //         }),
  //       ];
  //     });
  //   },
  //   []
  // );

  const handleChangeSelect = useCallback(
    (value: string[], idx: number, name: string): void => {
      setFileUpload((state) => {
        return [
          ...state.map((x, idxState) => {
            if (idxState != idx) return x;
            return {
              ...x,
              [name]: value,
            };
          }),
        ];
      });
    },
    []
  );

  const handleExport = useCallback((): void => {
    // const file = e.target?.files[0];
    // const f = await file.arrayBuffer();
    // const wb = read(f); // parse the array buffer
    // const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
    // const dataJson = utils.sheet_to_json(ws) as any; // generate objects
    // const dataHtml = utils.sheet_to_html(ws) as any; // generate objects
    // setPres(dataJson); // update state
    // setHtml(dataHtml);
    // console.log(Object.keys(dataJson[0]));
    let rs = [] as any[];
    for (let e = 0; e < fileUpload.length; e++) {
      const { fileData, startRow, columnsKey, columnsCompare } = fileUpload[e];
      rs[e] = {};
      for (let i = startRow ?? 1 + 1; i < fileData.length; i++) {
        const key = columnsKey.reduce((x, item, idx) => {
          const data = fileData[i][item] || "";
          x += `k${idx}${
            typeof data == "string" ? data.trim().toLowerCase() : data
          }`;
          return x;
        }, "");

        const xItem = {
          ...columnsKey.reduce((x, item) => {
            return {
              ...x,
              [item]:
                typeof fileData[i][item] == "string"
                  ? fileData[i][item].trim().toLowerCase()
                  : typeof fileData[i][item] == "number"
                  ? Math.round(fileData[i][item] * 10) / 10
                  : fileData[i][item],
            };
          }, {}),
          ...columnsCompare.reduce((x, item, idx) => {
            return {
              ...x,
              [item]:
                typeof fileData[i][item] == "string"
                  ? fileData[i][item].trim().toLowerCase()
                  : typeof fileData[i][item] == "number"
                  ? Math.round(fileData[i][item] * 10) / 10
                  : fileData[i][item],
            };
          }, {}),
        };
        rs[e][key] = xItem;
      }
    }

    const data1 = rs[0];
    const data2 = rs[1];
    // console.log({ data1, data2 });
    let dataCompare = [] as any[];
    const columnsKey1 = fileUpload[0].columnsKey;
    const columnsKey2 = fileUpload[1].columnsKey;
    const columnsCompare1 = fileUpload[0].columnsCompare;
    const columnsCompare2 = fileUpload[1].columnsCompare;
    const max =
      columnsCompare1.length > columnsCompare2.length
        ? columnsCompare1.length
        : columnsCompare2.length;
    for (const x in data1) {
      let item = data1[x];
      // kiểm tra xem file 2 có cặp khoá này không
      if (data2[x]) {
        let note: string[] = [];
        for (let y = 0; y < max; y++) {
          if (
            !data2[x][columnsCompare2[y]] ||
            data1[x][columnsCompare1[y]] != data2[x][columnsCompare2[y]]
          ) {
            note = [...note, `Sai ${columnsCompare2[y]}`];
          }
        }
        item = {
          ...item,
          ...columnsKey2.reduce((total, item) => {
            return { ...total, [`${item}@`]: data2[x][item] };
          }, {}),
          ...columnsCompare2.reduce((total, item) => {
            return { ...total, [`${item}@`]: data2[x][item] };
          }, {}),
          "Ghi chú": note.join(","),
        };
        dataCompare.push(item);
        delete data1[x];
        delete data2[x];
      }
    }
    for (const item of Object.values(data1)) {
      dataCompare.push({
        ...(item as any),
        ...columnsKey2.reduce((total, item) => {
          return { ...total, [`${item}@`]: "" };
        }, {}),
        ...columnsCompare2.reduce((total, item) => {
          return { ...total, [`${item}@`]: "" };
        }, {}),
        "Ghi chú": "",
      });
    }
    for (const item of Object.values(data2)) {
      dataCompare.push({
        ...columnsKey1.reduce((total, item) => {
          return { ...total, [item]: "" };
        }, {}),
        ...columnsCompare1.reduce((total, item) => {
          return { ...total, [item]: "" };
        }, {}),
        ...Object.keys(item as any).reduce((total: any, k) => {
          total[`${k}@`] = (item as any)[k];
          return total;
        }, {}),
        "Ghi chú": "",
      });
    }
    const ws = utils.json_to_sheet(dataCompare);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "Dữ liệu so sánh.xlsx");
  }, [fileUpload]);


  const handleExportMapData = useCallback((): void => {
    let rs = [] as any[];

    const { fileData, startRow, columnsKey, columnsCompare } = fileUpload[0];
    const fileData2 = fileUpload[1].fileData;
    const columnsKey2 = fileUpload[1].columnsKey;
    const columnsCompare2 = fileUpload[1].columnsCompare;

    for (let i = 0; i < fileData.length; i++) {
      console.log(i,fileData[i].code);
      const findSource = fileData2.find(x => `k${x[columnsKey2[0]]}` == `k${fileData[i][columnsKey[0]]}`);
      if (findSource) {
        for(let c = 0; c < columnsCompare.length; c++) {
          // console.log(`k${fileData[i].code} == ${findSource.code}` + ' || ' + columnsCompare[c] + ' || ' +columnsCompare2[c] + ' => ' + findSource[columnsCompare2[c]]);
          fileData[i][columnsCompare[c]] = findSource[columnsCompare2[c]];
        }
      } else {
        for(let c = 0; c < columnsCompare.length; c++) {
          // console.log(`k${fileData[i].code} == ${findSource.code}` + ' || ' + columnsCompare[c] + ' || ' +columnsCompare2[c] + ' => ' + findSource[columnsCompare2[c]]);
          fileData[i][columnsCompare[c]] = '';
        }
      }
    }

    
    const ws = utils.json_to_sheet(fileData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFileXLSX(wb, "Dữ liệu map.xlsx");
  }, [fileUpload]);

  return (
    <Paper elevation={0}>
      <Box my={3} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h4">HỆ THỐNG SO SÁNH DỮ LIỆU</Typography>
      </Box>
      {fileUpload.map((x, idx) => (
        <InputItem
          key={`input-item${idx}`}
          idx={idx}
          data={{ ...x }}
          handleChangeFile={handleChangeFile}
          // handleChangeInput={handleChangeInput}
          handleChangeSelect={handleChangeSelect}
        />
      ))}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
        mt={2}
        display="flex"
      >
        <Grid item>
          <Button variant="contained" component="label" onClick={handleExport}>
            Export File Compare
          </Button>

          <Button variant="contained" component="label" onClick={handleExportMapData}>
            Export File Map Data
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
