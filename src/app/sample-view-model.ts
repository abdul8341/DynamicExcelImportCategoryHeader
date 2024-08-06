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
