import React, { useState } from "react";

const UploadProfileImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage("Wybierz plik do wysłania.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/users/me/upload-profile-image", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setStatusMessage("Zdjęcie profilowe zostało zaktualizowane!");
      } else {
        const error = await response.json();
        setStatusMessage(error.detail || "Błąd podczas wysyłania zdjęcia.");
      }
    } catch (error) {
      console.error("Błąd:", error);
      setStatusMessage("Błąd połączenia z serwerem.");
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <h2>Upload zdjęcia profilowego</h2>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Prześlij zdjęcie</button>
      {statusMessage && <p>{statusMessage}</p>}
    </form>
  );
};

export default UploadProfileImage;
