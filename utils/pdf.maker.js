const fs = require("fs");
const path = require("path");
const pdfMake = require("pdfmake");

// const timesNewRomanBuffer = fs.readFileSync("../fonts/times.ttf");
// const timesNewRoman = {
//   normal: timesNewRomanBuffer,
//   bold: timesNewRomanBuffer,
//   italics: timesNewRomanBuffer,
//   bolditalics: timesNewRomanBuffer,
// };
const base = path.join(__dirname, "/fonts");
// Define fonts to be used in the document
const fonts = {
  Roboto: {
    normal: `${base}/Roboto-Regular.ttf`,
    bold: `${base}/Roboto-Bold.ttf`,
    italics: `${base}/Roboto-Italic.ttf`,
    bolditalics: `${base}/Roboto-BoldItalic.ttf`,
  },
};

exports.createTablePdf = (documentName, searchResults) => {
  //   console.log(searchResults);
  // Define the columns for the PDF table
  const tableColumns = [
    { text: "ZPID", bold: true },
    { text: "Address", bold: true },
    { text: "Beds", bold: true },
    { text: "Baths", bold: true },
    { text: "Price", bold: true },
  ];
  let body = [tableColumns];
  // Define the PDF document definition
  const docDefinition = {
    content: [
      { text: `Search: ${searchResults["search-term"]}`, style: "header" },
      { table: { headerRows: 1, body: body } },
    ],
    defaultStyle: {
      font: "Roboto",
    },
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
    },
  };
  searchResults["results"].forEach((item) => {
    // console.log([
    //   item["zpid"],
    //   item["address"],
    //   item["beds"],
    //   item["baths"],
    //   item["priceStr"],
    // ]);
    docDefinition.content[1].table.body.push([
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

  let chunks = [];
  let result;
  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  pdfDoc.on("end", function () {
    result = Buffer.concat(chunks);

    // response.contentType("application/pdf");
    // response.send(result);
  });

  // Save the PDF to a file
  //   pdfDoc.pipe(fs.createWriteStream(documentName));
  pdfDoc.end();

  return result;

  // To return just get filepath
};
