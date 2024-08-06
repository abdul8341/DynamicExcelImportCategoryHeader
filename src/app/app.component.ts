import { Component, VERSION } from '@angular/core';
import * as XLSX from 'xlsx';
// import { SampleViewModel } from './sample-view-model';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Excel to ViewModel';
  viewModels: SampleViewModel[] = [];
  json: any;

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const file: File = target.files[0];
    this.readFile(file);
  }

  readFile(file: File) {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* Get the first worksheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* Convert array of arrays */
      const jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Process the data
      const categories: { [key: string]: any[] } = {};
      const categoryHeaders: string[] = [];
      const dataHeaders: string[][] = [];

      // Assuming row 1 has categories and row 2 has headers
      jsonData[0].forEach((category: string, index: number) => {
        if (category) {
          categoryHeaders.push(category);
          categories[category] = [];
          dataHeaders.push([]);
        }
      });

      // Assuming headers are in row 2
      jsonData[1].forEach((header: string, index: number) => {
        const categoryIndex = categoryHeaders.findIndex(
          (category, idx) =>
            index < (jsonData[1].length / categoryHeaders.length) * (idx + 1)
        );
        dataHeaders[categoryIndex].push(header);
      });

      // Process data rows
      for (let i = 2; i < jsonData.length; i++) {
        const rowData = jsonData[i];
        let categoryIndex = -1;

        rowData.forEach((cell: any, index: number) => {
          categoryIndex = categoryHeaders.findIndex(
            (category, idx) =>
              index < (jsonData[1].length / categoryHeaders.length) * (idx + 1)
          );
          if (categoryIndex !== -1) {
            const header =
              dataHeaders[categoryIndex][
                index % dataHeaders[categoryIndex].length
              ];
            if (!categories[categoryHeaders[categoryIndex]]) {
              categories[categoryHeaders[categoryIndex]] = [];
            }
            const lastEntry =
              categories[categoryHeaders[categoryIndex]].slice(-1)[0] || {};
            if (!lastEntry[header]) {
              const newEntry = {};
              newEntry[header] = cell;
              categories[categoryHeaders[categoryIndex]].push(newEntry);
            } else {
              lastEntry[header] = cell;
            }
          }
        });
      }

      // console.log(JSON.stringify(categories, null, 2));
      this.json = JSON.stringify(categories, null, 2);
    };

    reader.readAsBinaryString(file);
  }
}

export class SampleViewModel {
  salutation: string;
  firstName: string;
  lastName: string;
  title: string;
  supplier: string;
  emailId: string;
  contactAddress: string;
  contactAddress2: string;
  country: string;
  state: string;
  primaryNAICSCode: string;
  secondaryNAICSCode: string;
  sicCodes: string;
  unspcsCodes: string;
  htsCodes: string;
  cageCodes: string;
  productDescriptions: string;
  ethnicities?: any; // This will hold the ethnicities data as JSON

  constructor(data: any) {
    this.salutation = data['Salutation'];
    this.firstName = data['First Name'];
    this.lastName = data['Last Name'];
    this.title = data['Title'];
    this.supplier = data['Supplier'];
    this.emailId = data['Email ID'];
    this.contactAddress = data['Contact Address'];
    this.contactAddress2 = data['Contact Address2'];
    this.country = data['Country'];
    this.state = data['State'];
    this.primaryNAICSCode = data['Primary NAICS Code'];
    this.secondaryNAICSCode = data['Secondary NAICS Code'];
    this.sicCodes = data['SIC Codes'];
    this.unspcsCodes = data['UNSPSC Codes'];
    this.htsCodes = data['HTS Codes'];
    this.cageCodes = data['CAGE Codes'];
    this.productDescriptions = data['Descriptions of Product/Services'];

    // Handle Ethnicities
    if (data['Ethnicities']) {
      this.ethnicities = JSON.parse(data['Ethnicities']);
    }
  }
}
