"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import OcrReader from "./tesseract";
import OcrSpaceReader from "./ocr-space-api-wrapper";

export default function CameraUploader() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<Base64URLString | null>(null);

  // Funkcja do uruchomienia kamery
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Błąd dostępu do kamery:", error);
    }
  };

  // Funkcja do robienia zdjęcia
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const imageUrl = canvasRef.current.toDataURL("image/png");
    setImageSrc(imageUrl);
  };

  //console.log(imageSrc);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={startCamera}>Open camera</Button>
      <video
        ref={videoRef}
        autoPlay
        className="w-full max-w-md rounded-lg shadow-md"
      />
      <button
        onClick={capturePhoto}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Zrób zdjęcie
      </button>

      <canvas ref={canvasRef} className="hidden" />

      {imageSrc && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Podgląd zdjęcia:</p>
          <img
            src={imageSrc}
            alt="No photo / error"
            className="w-full max-w-md rounded-lg shadow-md"
          />
          <OcrSpaceReader zdjecieBase64={imageSrc} />
          {/* <OcrReader zdjecie={imageSrc} /> */}
        </div>
      )}
    </div>
  );
}
