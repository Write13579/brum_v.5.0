"use server";

import fs from "fs";
import path from "path";

export async function uploadImage(base64Image: string) {
  try {
    if (!base64Image) {
      throw new Error("Brak danych obrazu");
    }

    // Dekodowanie Base64
    const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Ścieżka do zapisu
    const fileName = `image-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // Zapisywanie pliku na serwerze
    fs.writeFileSync(filePath, buffer);

    return { success: true, filePath: `/uploads/${fileName}` };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function ocrSpaceReader(zdjecieBase64: Base64URLString) {
  const { ocrSpace } = require("ocr-space-api-wrapper");

  try {
    // Using your personal API key + base64 image + custom language
    const res3 = await ocrSpace(zdjecieBase64, {
      apiKey: "K81942068588957",
      language: "pol",
    });

    console.log(res3);

    return res3;
  } catch (error) {
    console.error(error);
  }
}

export type OcrSpaceReaderType = {
  ParsedResults: [
    {
      TextOverlay: {
        Lines: [];
        HasOverlay: boolean;
        Message: string;
      };
      TextOrientation: string;
      FileParseExitCode: number;
      ParsedText: string;
      ErrorMessage: string;
      ErrorDetails: string;
    }
  ];
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ProcessingTimeInMilliseconds: number;
  SearchablePDFURL: string | number;
};
