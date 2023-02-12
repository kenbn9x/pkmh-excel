import React, { ChangeEvent, useCallback, memo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InputItemProps } from "@/components/types";

const InputItem = ({
  idx,
  data,
  handleChangeFile,
  handleChangeSelect,
}: InputItemProps) => {
  return (
    <Accordion key={`fileUPload-${idx}`}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Chọn File {idx + 1}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            width="100%"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button variant="contained" component="label">
              Upload
              <input
                hidden
                accept=".xls,.xlsx"
                type="file"
                onChange={(e) => handleChangeFile(e, idx)}
              />
            </Button>
            <Typography style={{ marginLeft: "5px" }}>
              {data.fileName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} width="100%">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={data.optionColumns}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              autoComplete
              onChange={(_, v) => handleChangeSelect(v, idx, "columnsKey")}
              renderInput={(params) => (
                <TextField {...params} label="Chọn cột làm key" />
              )}
              disabled={!data.fileName}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} width="100%">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={data.optionColumns}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              autoComplete
              onChange={(_, v) => handleChangeSelect(v, idx, "columnsCompare")}
              renderInput={(params) => (
                <TextField {...params} label="Chọn cột so sánh" />
              )}
              disabled={!data.fileName}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(InputItem);
