import { Injectable } from '@angular/core';

export interface GpExportColumn {
  field: string;
  header?: string;
  format?: (value: any, row: any) => string;
}

export interface GpExportCsvOptions {
  filename?: string;
  delimiter?: string;
  columns?: GpExportColumn[];
  includeHeaders?: boolean;
}

export interface GpExportExcelOptions {
  filename?: string;
  sheetName?: string;
  columns?: GpExportColumn[];
}

@Injectable({
  providedIn: 'root'
})
export class GpExportService {
  /**
   * Exports an array of records to a CSV file and triggers a browser download.
   */
  public exportToCsv(data: any[], options: GpExportCsvOptions = {}): void {
    if (!data || data.length === 0) {
      return;
    }

    const filename = options.filename
      ? options.filename.endsWith('.csv')
        ? options.filename
        : `${options.filename}.csv`
      : 'export.csv';
    const delimiter = options.delimiter || ',';
    const includeHeaders = options.includeHeaders !== false;

    const columns: GpExportColumn[] =
      options.columns || Object.keys(data[0]).map((key) => ({ field: key, header: key }));

    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility

    if (includeHeaders) {
      const headerRow = columns.map((col) => this.escapeCsvValue(col.header || col.field, delimiter)).join(delimiter);
      csvContent += headerRow + '\r\n';
    }

    data.forEach((row) => {
      const rowValues = columns.map((col) => {
        let val = row[col.field];
        if (col.format) {
          val = col.format(val, row);
        }
        return this.escapeCsvValue(val, delimiter);
      });
      csvContent += rowValues.join(delimiter) + '\r\n';
    });

    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  }

  /**
   * Exports an array of records to a lightweight native Excel XML Spreadsheet (compatible with MS Excel, LibreOffice, Google Sheets).
   */
  public exportToExcel(data: any[], options: GpExportExcelOptions = {}): void {
    if (!data || data.length === 0) {
      return;
    }

    const filename = options.filename
      ? options.filename.endsWith('.xls')
        ? options.filename
        : `${options.filename}.xls`
      : 'export.xls';
    const sheetName = options.sheetName || 'Data';
    const columns: GpExportColumn[] =
      options.columns || Object.keys(data[0]).map((key) => ({ field: key, header: key }));

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${this.escapeXml(sheetName)}">
  <Table>
   <Row ss:StyleID="Header">`;

    columns.forEach((col) => {
      xml += `\n    <Cell><Data ss:Type="String">${this.escapeXml(col.header || col.field)}</Data></Cell>`;
    });

    xml += '\n   </Row>';

    data.forEach((row) => {
      xml += '\n   <Row>';
      columns.forEach((col) => {
        let val = row[col.field];
        if (col.format) {
          val = col.format(val, row);
        }
        const isNum = typeof val === 'number';
        const type = isNum ? 'Number' : 'String';
        const strVal = val === null || val === undefined ? '' : String(val);
        xml += `\n    <Cell><Data ss:Type="${type}">${this.escapeXml(strVal)}</Data></Cell>`;
      });
      xml += '\n   </Row>';
    });

    xml += `\n  </Table>
 </Worksheet>
</Workbook>`;

    this.downloadFile(xml, filename, 'application/vnd.ms-excel');
  }

  /**
   * Exports an array of records to formatted JSON file.
   */
  public exportToJson(data: any[], filename = 'export.json'): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const fname = filename.endsWith('.json') ? filename : `${filename}.json`;
    this.downloadFile(jsonStr, fname, 'application/json');
  }

  private escapeCsvValue(val: any, delimiter: string): string {
    if (val === null || val === undefined) {
      return '';
    }
    const str = String(val);
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private escapeXml(val: string): string {
    if (!val) {
      return '';
    }
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    if (typeof document === 'undefined') {
      return;
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
