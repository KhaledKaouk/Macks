import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrdouctShippingDetailsComponent } from '../prdouct-shipping-details/prdouct-shipping-details.component';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { first } from "rxjs/operators";
import * as FileSaver from 'file-saver';
import { FormatDate } from 'src/app/Utilities/Common';
import { ProductShippingDetails } from 'src/app/Models/CommercialInvoice';
@Component({
  selector: 'app-commercial-innvoice',
  templateUrl: './commercial-innvoice.component.html',
  styleUrls: ['./commercial-innvoice.component.sass']
})
export class CommercialInnvoiceComponent implements OnInit {

  InvoiceNumber: string = "10293812093801298"
  InvoiceDate: string = FormatDate(Date.now().toString());
  PS_Details: ProductShippingDetails[] = [];

  TotalQuantity: number = 0;
  TotalPacks: number = 0;
  TotalKG: number = 0;
  TotalCUBM: number = 0;
  TotalPrice: number = 0;
  FreightPrice: number = 0;
  GrantTotal: number = 0;
  POs: string[] = [];

  InvoicePOs: string[] = [];
  PoFileNames: string[] = []
  CostumerAddressPart1: string = "";
  CostumerAddressPart2: string = "";
  CostumerAddressPart3: string = "";
  Port = "";
  constructor(private dialog: MatDialog,
    private ActivatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.CreateCommercialInvoice();
  }
  async GetPoFileNamesAndPort() {
    await this.ActivatedRoute.queryParams.pipe(first()).toPromise().then(params => {
      this.PoFileNames = params['IP'] as string[]
      this.Port = params['Port'] as string
    })
  }

  async CreateCommercialInvoice() {
    await this.GetPoFileNamesAndPort();
    for (let PoFileName of Array.from(this.PoFileNames)) {
      let PO = await this.getPO(PoFileName)
      await this.GetProductDetailsFromPoFile(await this.GetWorkSheet(PO))
      this.GetCustomerAddress(await this.GetWorkSheet(PO))
    }
    this.CalculateTotals(this.PS_Details);
  }
  async getPO(POFileName: string) {
    let realapi = 'https://macksdistribution.com/Attatchments/NP/';
    let localApi = 'http://localhost:5000/Assets/';
    let ResponseWithPoBlob = await fetch(localApi + POFileName)
    let POBlob = await ResponseWithPoBlob.clone().blob();

    let POFile: any
    POFile = POBlob;
    POFile.name = "PO";
    POFile.lastModifiedDate = new Date();

    return POFile as File;
  }
  async GetWorkSheet(POFile: File) {
    let arrayBuffer: any;
    await POFile.arrayBuffer().then((buffer) => { arrayBuffer = buffer })
    var data = new Uint8Array(arrayBuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, { type: "binary" });
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    console.log(worksheet)
    return worksheet
  }

  GetPrdocutDetailsRowNumbers(Worksheet: XLSX.WorkSheet) {
    let QTY: string = ''
    let CellIndex: number = 18;
    while (QTY != null) {
      QTY = Worksheet['A' + CellIndex.toString()] ? Worksheet['A' + CellIndex.toString()] : null
      CellIndex += 1;
    }
    return CellIndex - 3
  }
  async GetProductDetailsFromPoFile(WorkSheet: XLSX.WorkSheet) {
    let CellIndexEnd = this.GetPrdocutDetailsRowNumbers(WorkSheet)
    let CellIndex: number = 18
    while (CellIndex <= CellIndexEnd) {
      let PSD = new ProductShippingDetails();

      PSD.QTY = WorkSheet['A' + CellIndex.toString()].v
      PSD.PRODUCT_CODE = WorkSheet['D' + CellIndex.toString()].v
      PSD.PRODUCT = WorkSheet['E' + CellIndex.toString()].v
      PSD.Po = WorkSheet['P5'].v

      if(!this.CheckPoInPoList(PSD.Po)) this.POs.push(PSD.Po)

      this.PS_Details.push(PSD)

      CellIndex += 1;
    }
  }
  async GetCustomerAddress(WorkSheet: XLSX.WorkSheet) {
    this.CostumerAddressPart1 = WorkSheet['L10'].v
    this.CostumerAddressPart2 = WorkSheet['L11'].v
    this.CostumerAddressPart3 = WorkSheet['L12'].v
  }
  CheckPoInPoList(Po: string){
    return this.POs.includes(Po)
  }

  async EditeProductDetails(CommercialInvoiceRow: ProductShippingDetails) {
    await this.dialog.open(PrdouctShippingDetailsComponent, {
      height: '60rem',
      width: '60rem',
      data: CommercialInvoiceRow
    }).afterClosed().toPromise().then((PS_Details: any) => {
      this.PS_Details[this.PS_Details.indexOf(CommercialInvoiceRow)] = PS_Details.data as ProductShippingDetails;
    })
    this.CalculateTotals(this.PS_Details);
  }
  CalculateTotals(PS_Details: ProductShippingDetails[]) {
    this.ZeroTotals()
    PS_Details.forEach(PS_D => {
      this.TotalQuantity += PS_D.QTY;
      this.TotalPacks += PS_D.TOTAL_PACKS
      this.TotalKG += PS_D.TOTAL_KG
      this.TotalCUBM += PS_D.TOTAL_CUBM;
      this.TotalPrice += PS_D.TOTAL_PRICE
    })
  }
  ZeroTotals() {
    this.TotalQuantity = 0;
    this.TotalPacks = 0;
    this.TotalKG = 0;
    this.TotalCUBM = 0;
    this.TotalPrice = 0;
  }
  AssignFreightPrice(event: any) {
    this.FreightPrice = event.target.value
    this.GrantTotal = parseFloat(this.FreightPrice.toString()) + parseFloat(this.TotalPrice.toString())

  }
  GenerateInvoice() {
    this.AdjustHtmlPageForFileDisplay();
    let HtmlPage = document.getElementById("PDF")
    if (HtmlPage) html2canvas(HtmlPage).then(canvas => {

      var pdf = new jsPDF('p', 'pt', [1600, 1600]);

      pdf.html(HtmlPage ? HtmlPage : '', {
        callback: function () {
          pdf.save('CommercialInvoice.pdf');
        }
      });
    });
    this.GenerateISF();
  }
  AdjustHtmlPageForFileDisplay() {
    Array.from(document.getElementsByClassName('Draft')).forEach(DraftElement => {
      if (DraftElement.tagName == 'INPUT' || DraftElement.tagName == 'SELECT') {
        (DraftElement as HTMLElement).style.borderColor = '0';
        (DraftElement as HTMLElement).style.borderWidth = '0px';
      } else {
        DraftElement.remove();
      }
    })
  }

  AddHeaderToISFSheet(sheet: ExcelJS.Worksheet) {
    sheet.columns = [
      { header: 'Shipment Header', key: 'Key', width: 40 },
      { header: '', key: 'Value', width: 40 },
    ]
  }
  AddISFKeysAndValues(sheet: ExcelJS.Worksheet) {
    sheet.addRows([
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '1. SELLERS NAME\n ' },
            { 'font': { 'color': { 'theme': 0 } }, 'text': 'Party that - according to commercial invoice - is seller of the shipped goods. ' },
          ]
        },
        Value: "ALFEMO MOBILYA SAN.TIC.AS\n" +
          "YEDI EYLUL MAH. CELAL UMUR CAD. NO:12 TORBALI IZMIR TURKEY\n" +
          "TEL:090 232 999 3000 FAX:090 232 853 1075"
      },
      {
        Key:
        {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '2. BUYERS NAME AND ADDRESS\n' },
            { 'font': { 'color': { 'theme': 0 } }, 'text': 'Party in US that - according to commercial invoice - is buyer of the shipped goods.' },
          ]
        },
        Value: "MACKS FURNITURE WAREHOUSE\n" +
          "1809 DICKINSON AVENUE,GREENVILLE,NC 27858\n" +
          "TEL: 252-329-0837"
      },
      {
        Key:
        {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '3. MANUFACTURER/SUPPLIER\n' },
            {
              'font': { 'color': { 'theme': 0 } }, 'text': "Party that produced, assembled or cultivated\n" +
                "the shipped goods (manufacturer) or company\n" +
                "that supplied the goods as they are (supplier)."
            },
          ]
        },
        Value: "ALFEMO MOBILYA SAN.TIC.AS\n" +
          "YEDI EYLUL MAH. CELAL UMUR CAD. NO:12 TORBALI IZMIR TURKEY\n" +
          "TEL:090 232 999 3000 FAX:090 232 853 1075"
      },
      {
        Key:
        {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '4. SHIP TO PARTY\n' },
            {
              'font': { 'color': { 'theme': 0 } }, 'text': "Party in the USA that actually receives the \n" +
                "shipped goods - can be a different party from\n" +
                " buyer.."
            },
          ]
        },
        Value: this.CostumerAddressPart1 + this.CostumerAddressPart2 + this.CostumerAddressPart3
      },
      {
        Key:
        {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '5. COUNTRY OF ORIGIN\n' }]
        },
        Value: "TURKEY"
      },
      {
        Key:
        {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '6. HTS NUMBER(S)\n' }]
        },

        Value: "940161"
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '7. CONTAINER STUFFING LOCATION AND ADDRESS\n' }]
        },

        Value: "ALFEMO MOBILYA SAN.TIC.AS\n" +
          "YEDI EYLUL MAH. CELAL UMUR CAD. NO:12 TORBALI IZMIR TURKEY"
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': '8. CONSOLIDATOR NAME AND ADDRESS\n' }]
        },

        Value: ""
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'MB/L # (incl. SCAC)\n' }]
        },

        Value: ""
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'AMS-HB/L # (incl. SCAC)\n' }]
        },

        Value: ""
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'VESSEL NAME AND VOYAGE (mother vessel to US)\n' }]
        },

        Value: ""
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'ETD\n' }]
        },

        Value: ""
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'ETA\n' }]
        },

        Value: ""
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'PORT OF DISCHARGE IN US\n' }]
        },

        Value: this.Port
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'CONTAINER NO(S)\n' }]
        },

        Value: ''
      },
      {
        Key: {
          'richText': [
            { 'font': { 'color': { 'theme': 0 }, 'bold': 'true' }, 'text': 'PO NO.\n' }]
        },
        Value: this.CombinePosToString()
      },
    ])
  }
  CombinePosToString(){
    let StringOfAllPos: string = ""; 
    this.POs.forEach(Po => StringOfAllPos += ' ' + Po)
    return StringOfAllPos
  }
  StyleISF(sheet: ExcelJS.Worksheet) {
    sheet.getRows(2, 12)?.forEach(row => row.height = 90)
    sheet.getRows(2, 16)?.forEach(row => {
      this.SetupISFAlignment(row);
      this.SetupISFHeaderStyle(row);
      this.SetUpISFBorder(row);
    })
  }

  SetupISFHeaderStyle(row: ExcelJS.Row) {
    row.getCell('A').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c0504d' }
    };
    row.getCell('A').font = {
      color: { argb: 'FFFFFF' }
    }
  }
  SetupISFAlignment(row: ExcelJS.Row) {
    row.getCell('B').alignment = { wrapText: true, vertical: 'middle' };
    row.getCell('A').alignment = { wrapText: true, vertical: 'middle' };
  }
  SetUpISFBorder(row: ExcelJS.Row) {
    row.getCell('A').border = row.getCell('B').border = {
      top: { style: 'thick' },
      left: { style: 'thick' },
      bottom: { style: 'thick' },
      right: { style: 'thick' }
    }
  }

  async GenerateISF() {
    let workbook = new ExcelJS.Workbook();

    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Me';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

    let sheet = workbook.addWorksheet('ISF');
    this.AddHeaderToISFSheet(sheet);
    this.AddISFKeysAndValues(sheet)
    this.StyleISF(sheet)
    workbook.xlsx.writeBuffer()
      .then(buffer => FileSaver.saveAs(new Blob([buffer]), 'ISF.xlsx'))


  }
}
