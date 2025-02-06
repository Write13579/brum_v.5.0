"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import OcrSpaceReader from "./ocr-space-api-wrapper";
import Image from "next/image";

export default function CameraUploader() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<Base64URLString | null>(null);
  const [visibleCamera, setVisibleCamera] = useState<boolean>(false);

  // Funkcja do uruchomienia kamery
  const startCamera = async () => {
    try {
      setVisibleCamera(true);
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

    setVisibleCamera(false);
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as Base64URLString);
      };
      reader.readAsDataURL(file); // Odczyt pliku jako Base64
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {!visibleCamera ? (
        <Button onClick={startCamera}>Włącz aparat</Button>
      ) : (
        <Button onClick={() => setVisibleCamera(false)}>Wyłącz aparat</Button>
      )}
      {visibleCamera && (
        <div className="flex flex-col items-center gap-2 justify-center">
          <video
            ref={videoRef}
            autoPlay
            className="w-full max-w-md rounded-lg shadow-md"
          />

          <button
            onClick={capturePhoto}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex justify-center items-center "
          >
            Zrób zdjęcie
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      {imageSrc && !visibleCamera && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Podgląd zdjęcia:</p>
          <Image
            src={imageSrc}
            alt="No photo / error"
            className="w-full max-w-md rounded-lg shadow-md"
            width={350}
            height={350}
          />
          <OcrSpaceReader zdjecieBase64={imageSrc} />
          {/* <OcrReader zdjecie={imageSrc} /> */}
        </div>
      )}
    </div>
  );
}
