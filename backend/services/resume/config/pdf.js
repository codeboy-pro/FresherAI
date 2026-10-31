import fs from "fs";
import { PDFParse } from "pdf-parse";
const extrectedText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const pdf = new PDFParse({
    data: buffer,
  });
  const result = await pdf.getText();
  return result.text;
};

export default extrectedText;

