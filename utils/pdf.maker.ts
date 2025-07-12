import fs from 'fs';
import path from 'path';
import pdfMake from 'pdfmake';

// Interfaces
interface SearchResults {
  'search-term': string;
  listings: Array<{
    zpid: string;
    address: string;
    beds: number;
    baths: number;
    priceStr: string;
  }>;
}

interface TableColumn {
  text: string;
  style: {
    fillColor: string;
    color: string;
    bold: boolean;
  };
}

interface DocDefinition {
  content: any[];
  defaultStyle: {
    font: string;
  };
  styles: {
    header: {
      fontSize: number;
      bold: boolean;
      margin: number[];
    };
  };
}

const fontsBaseDir = path.join(__dirname, '/fonts');
const pdfDirectory = path.join(__dirname, '../pdf');

// Define fonts to be used in the document
const fonts = {
  Roboto: {
    normal: `${fontsBaseDir}/Roboto-Regular.ttf`,
    bold: `${fontsBaseDir}/Roboto-Bold.ttf`,
    italics: `${fontsBaseDir}/Roboto-Italic.ttf`,
    bolditalics: `${fontsBaseDir}/Roboto-BoldItalic.ttf`,
  },
};

export const createTablePdf = (searchResults: SearchResults): string | null => {
  if (!searchResults || !searchResults['search-term']) {
    return null;
  }

  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory);
    console.log(`${pdfDirectory} created successfully.`);
  } else {
    console.log(`${pdfDirectory} already exists.`);
  }

  const documentName = `search_results_${Date.now()}.pdf`;
  const filePath = path.join(pdfDirectory, documentName);
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = date.toLocaleString('en-US', options);

  // Define the columns for the PDF table
  const tableColumns: TableColumn[] = [
    {
      text: 'ZPID',
      style: { fillColor: '#CCCCCC', color: '#333333', bold: true },
    },
    {
      text: 'Address',
      style: { fillColor: '#CCCCCC', color: '#333333', bold: true },
    },
    {
      text: 'Beds',
      style: { fillColor: '#CCCCCC', color: '#333333', bold: true },
    },
    {
      text: 'Baths',
      style: { fillColor: '#CCCCCC', color: '#333333', bold: true },
    },
    {
      text: 'Price',
      style: { fillColor: '#CCCCCC', color: '#333333', bold: true },
    },
  ];

  let body: any[] = [tableColumns];
  const tableIdx = 3;

  // Define the PDF document definition
  const docDefinition: DocDefinition = {
    content: [
      {
        text: ['Urban Insight Inc\n', '123 First Ave\n', formattedDate],
        lineHeight: 2,
        alignment: 'right',
        fontSize: 12,
        margin: [0, 20],
      },
      {
        text: 'Search Results',
        alignment: 'center',
        fontSize: 20,
        margin: [0, 20],
      },
      {
        text: `Search: ${searchResults['search-term']}`,
        style: 'header',
        lineHeight: 2,
      },
      { table: { headerRows: 1, body: body } },
    ],
    defaultStyle: {
      font: 'Roboto',
    },
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
    },
  };

  searchResults.listings.forEach((item) => {
    docDefinition.content[tableIdx].table.body.push([
      item.zpid,
      item.address,
      item.beds,
      item.baths,
      item.priceStr,
    ]);
  });

  // Generate the PDF document from the document definition
  const printer = new pdfMake(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  
  // Save the PDF to a file
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  return filePath;
}; 