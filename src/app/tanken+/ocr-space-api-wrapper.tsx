"use client";

import { useEffect, useState } from "react";
import { ocrSpaceReader } from "./actions";
import { OcrSpaceResponse } from "ocr-space-api-wrapper";

export default function OcrSpaceReader({
  zdjecieBase64,
}: {
  zdjecieBase64: Base64URLString;
}) {
  const [res, setRes] = useState<OcrSpaceResponse | null | undefined>(null);

  const [ParsedText, setParsedText] = useState<string>("NOTHING");

  useEffect(() => {
    const fetchOCR = async () => {
      try {
        const result: OcrSpaceResponse | undefined = await ocrSpaceReader(
          zdjecieBase64
        );
        //console.log("result:    " + JSON.stringify(result, null, 2));
        //console.log("zdjeciebase64:  " + zdjecieBase64);

        // setRes(result); // Aktualizacja stanu

        if (result) {
          setRes(result);
          setParsedText(result.ParsedResults[0].ParsedText || "NIE ZNALEZIONO");
          console.log(result.ParsedResults[0].ParsedText);
        } else {
          console.log("Brak wyników");
        }
      } catch (error) {
        setParsedText("nie ma resulta");
      }
    };

    fetchOCR();
  }, [zdjecieBase64]);

  return (
    <div id="alles">
      {" "}
      <div>Wynik OCR:</div>
      {res && res.ParsedResults && (
        <div>
          <div>{ParsedText}</div>
        </div>
      )}
    </div>
  );
}
