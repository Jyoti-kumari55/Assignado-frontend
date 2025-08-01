import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6 w-full">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="w-12 h-12 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-2xl text-primary" />
          <button
            type="button"
            className="w-6 h-6 items-center justify-center bg-primary text-white rounded-full absolute -bottom-1.5 -right-1.5 cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload className="relative text-sm -right-1" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            className="w-20 h-20 rounded-full object-cover"
            alt="profile photo"
          />
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-2 -right-2"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
