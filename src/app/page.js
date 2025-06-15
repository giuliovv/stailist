"use client"

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [preview, setPreview] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  function handleUpload() {
    // TODO: send `preview` or original file to your API for style suggestions
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl mb-6">Upload Your Photo</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {preview && (
        <div className="mb-4">
          <Image src={preview} alt="Preview" width={300} height={300} />
        </div>
      )}
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Get Style Suggestions
      </button>
    </div>
  );
}
