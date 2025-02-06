"use client";

import { useEffect, useState } from "react";
import { ocrSpaceReader, OcrSpaceReaderType } from "./actions";

export default function OcrSpaceReader({
  zdjecieBase64,
}: {
  zdjecieBase64: Base64URLString;
}) {
  const [res, setRes] = useState<OcrSpaceReaderType | null | undefined>(null);
  const [selectedImage, setSelectedImage] = useState<
    File | Base64URLString | null
  >(null);

  const [ParsedText, setParsedText] = useState<string>("NOTHING");

  useEffect(() => {
    const fetchOCR = async () => {
      try {
        const result: OcrSpaceReaderType = await ocrSpaceReader(zdjecieBase64);
        console.log("result:    " + JSON.stringify(result, null, 2));
        //console.log("zdjeciebase64:  " + zdjecieBase64);

        // setRes(result); // Aktualizacja stanu
        setRes(result);
        setParsedText(result.ParsedResults[0].ParsedText || "");
        console.log(result.ParsedResults[0].ParsedText);
      } catch (error) {
        console.error("Błąd OCR:", error);
      }
    };

    fetchOCR();
  }, [zdjecieBase64, selectedImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      //   setOcrResult(""); // Reset OCR result
      //   setOcrStatus(""); // Reset status
    }
  };

  return (
    <div id="alles">
      {" "}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div>Wynik OCR:</div>
      {res && res.ParsedResults && (
        <div>
          <div>{ParsedText}</div>
        </div>
      )}
    </div>
  );
}
