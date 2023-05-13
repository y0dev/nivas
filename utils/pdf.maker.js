const fs = require("fs");
const path = require("path");
const pdfMake = require("pdfmake");

const fontsBaseDir = path.join(__dirname, "/fonts");
const pdfDirectory = path.join(__dirname, "../pdf");

// Define fonts to be used in the document
const fonts = {
  Roboto: {
    normal: `${fontsBaseDir}/Roboto-Regular.ttf`,
    bold: `${fontsBaseDir}/Roboto-Bold.ttf`,
    italics: `${fontsBaseDir}/Roboto-Italic.ttf`,
    bolditalics: `${fontsBaseDir}/Roboto-BoldItalic.ttf`,
  },
};

exports.createTablePdf = (documentName, searchResults) => {
  if (documentName === "") {
    return null;
  }

  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory);
    console.log(`${pdfDirectory} created successfully.`);
  } else {
    console.log(`${pdfDirectory} already exists.`);
  }
  const filePath = path.join(pdfDirectory, documentName);
  const date = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleString("en-US", options);
  //   console.log(searchResults);
  // Define the columns for the PDF table
  const tableColumns = [
    {
      text: "ZPID",
      style: { fillColor: "#CCCCCC", color: "#333333", bold: true },
    },
    {
      text: "Address",
      style: { fillColor: "#CCCCCC", color: "#333333", bold: true },
    },
    {
      text: "Beds",
      style: { fillColor: "#CCCCCC", color: "#333333", bold: true },
    },
    {
      text: "Baths",
      style: { fillColor: "#CCCCCC", color: "#333333", bold: true },
    },
    {
      text: "Price",
      style: { fillColor: "#CCCCCC", color: "#333333", bold: true },
    },
  ];
  let body = [tableColumns];
  const tableIdx = 3;
  // Define the PDF document definition
  const docDefinition = {
    // pageOrientation: "landscape",
    // pageSize: "A4",
    // pageMargins: [40, 60, 40, 60], // left, top, right, bottom
    content: [
      {
        text: ["Urban Insight Inc\n", "123 First Ave\n", formattedDate],
        lineHeight: 2,
        alignment: "right",
        fontSize: 12,
        margin: [0, 20],
      },
      {
        text: "Search Results",
        alignment: "center",
        fontSize: 20,
        margin: [0, 20],
      },
      {
        text: `Search: ${searchResults["search-term"]}`,
        style: "header",
        lineHeight: 2,
      },
      { table: { headerRows: 1, body: body } },
    ],
    defaultStyle: {
      font: "Roboto",
    },
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
    },
    defaultStyle: {
      footer: {
        text: "Urban Insight Inc",
        alignment: "center",
        fontSize: 10,
      },
    },
  };
  searchResults["listings"].forEach((item) => {
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

  // To return just get filepath
};
