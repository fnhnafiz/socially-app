"use client";
import { UploadButton } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";
import React from "react";
// import "@uploadthing/react/styles.css";

interface ImageUploadPrps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

function ImageUpload({ onChange, endpoint, value }: ImageUploadPrps) {
  if (value) {
    return (
      <div className="relative size-40">
        <img src={value} className="rounded-md size-40 object-cover" />
        <button
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
          onClick={() => onChange("")}
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <UploadButton
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("Upload response:", res);
        onChange(res?.[0].url);
      }}
      onUploadError={(error) => {
        console.log(error);
      }}
    />
  );
}

export default ImageUpload;
