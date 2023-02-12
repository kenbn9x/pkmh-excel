import { ChangeEvent, SyntheticEvent } from "react";

export interface FileUpload {
  fileData: any[];
  fileName: string;
  startRow?: number;
  columnsKey: string[];
  columnsCompare: string[];
  optionColumns: string[];
}

export interface InputItemProps {
  idx: number;
  data: FileUpload;
  handleChangeFile(
    e: ChangeEvent<HTMLInputElement>,
    idx: number
  ): Promise<void>;
  handleChangeInput?(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
    name: string
  ): void;
  handleChangeSelect(value: string[], idx: number, name: string): void;
}
