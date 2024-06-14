import { Injectable } from '@angular/core';
import * as XLSX from "xlsx";
import FileSaver, {saveAs} from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor() { }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    const data: Blob = new Blob([excelBuffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, excelFileName+'.xlsx');
  }
  exportAsCsvFile(json:any[],csvFileName:any):void{
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(json[0]);
    let csv = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    const blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob,csvFileName);
  }
}
