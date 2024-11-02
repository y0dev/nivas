const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

const excelDirectory = path.join(__dirname, "../excel");

// Function to create an Excel file with search results
exports.createTableExcel = (documentName, searchResults) => {
  if (documentName === "") {
    return null;
  }

  // Ensure the directory exists
  if (!fs.existsSync(excelDirectory)) {
    fs.mkdirSync(excelDirectory);
    console.log(`${excelDirectory} created successfully.`);
  } else {
    console.log(`${excelDirectory} already exists.`);
  }

  const filePath = path.join(excelDirectory, documentName);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Search Results");

  // Add columns for the search results
  worksheet.columns = [
    { header: "ZPID", key: "zpid", width: 15 },
    { header: "Address", key: "address", width: 30 },
    { header: "Beds", key: "beds", width: 10 },
    { header: "Baths", key: "baths", width: 10 },
    { header: "Price", key: "priceStr", width: 15 },
  ];

  // Add data rows from search results
  searchResults["listings"].forEach((item) => {
    worksheet.addRow({
      zpid: item.zpid,
      address: item.address,
      beds: item.beds,
      baths: item.baths,
      priceStr: item.priceStr,
    });
  });

  // Save the workbook to the specified file path
  return workbook.xlsx.writeFile(filePath).then(() => filePath);
};
