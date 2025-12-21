"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function TraceQRCode({ batchNo }: { batchNo: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const origin = window.location.origin;
    setUrl(`${origin}/trace/${batchNo}`);
  }, [batchNo]);

  if (!url) {
    return <div className="w-12 h-12 bg-gray-100 animate-pulse rounded" />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
        <QRCodeSVG
          value={url}
          size={64}
          level={"M"}
          fgColor="#166534"
        />
      </div>
      <span className="text-[10px] text-gray-400 mt-1 scale-90">
        扫码分享
      </span>
    </div>
  );
}