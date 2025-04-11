import React, { useState } from "react";

const UploadEquipmentImage = ({ equipmentId }) => {
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
      const response = await fetch(
        `/api/admin/equipment/${equipmentId}/upload-image`,
        {
          method: "POST",
          body: formData,
          // Jeśli potrzebujesz wysyłać credentials, dodaj:
          // credentials: "include"
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStatusMessage("Obraz został przesłany!");
      } else {
        const error = await response.json();
        setStatusMessage(error.detail || "Błąd podczas wysyłania obrazu.");
      }
    } catch (error) {
      console.error("Błąd:", error);
      setStatusMessage("Błąd połączenia z serwerem.");
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <h2>Upload obrazu sprzętu</h2>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Prześlij obraz</button>
      {statusMessage && <p>{statusMessage}</p>}
    </form>
  );
};

export default UploadEquipmentImage;
