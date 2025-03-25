import React, { useState } from "react";
import { IoMdPhotos } from "react-icons/io";

const ImageToBase64 = () => {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        console.log("Base64 String of the image:", base64String); // Logs Base64 string
        setImage(base64String);
      };
      reader.readAsDataURL(file); // Converts file to Base64
    }
  };

  

  return (
    <div className="flex flex-col items-center justify-center relative">
      <label
        className="flex flex-col items-center text-[30px] justify-center text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-600"
        htmlFor="file-input"
      >
        <IoMdPhotos />
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {image && (
        <div className="w-[50px] h-[50px] border rounded-lg bg-white absolute bottom-[50px] left-[90px]">
          <img
            src={image}
            alt="Uploaded Preview"
            className="w-[50px] h-[50px] rounded-2xl overflow-hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageToBase64;
