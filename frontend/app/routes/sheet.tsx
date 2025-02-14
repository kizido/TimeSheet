import { useState, type ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router";

type MinutesEntry = {
  date: string;
  minutes: number;
};

export default function Sheet() {
  const navigate = useNavigate();
  const location = useLocation();

  const existingSheet = location.state?.sheet;
  const initialSheetName =
    (existingSheet && existingSheet.sheetName) ||
    location.state?.sheetName ||
    "";

  const sheetId = existingSheet?._id || null;
  const [sheetName, setSheetName] = useState(initialSheetName);

  const [rate, setRate] = useState(existingSheet?.rate || "");
  const [description, setDescription] = useState(
    existingSheet?.description || ""
  );
  const [minutesEntries, setMinutesEntries] = useState<MinutesEntry[]>(
    existingSheet?.minutesEntries || [{ date: "", minutes: 0 }]
  );

  // Allow only numeric input with up to 2 decimals
  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setRate(value);
    }
  };

  const handleAddEntry = () => {
    setMinutesEntries([...minutesEntries, { date: "", minutes: 0 }]);
  };

  const handleUpdateEntry = (
    index: number,
    key: keyof MinutesEntry,
    value: any
  ) => {
    const updatedEntries = minutesEntries.map((entry, i) =>
      i === index ? { ...entry, [key]: value } : entry
    );
    setMinutesEntries(updatedEntries);
  };

  const totalMinutes = minutesEntries.reduce(
    (sum, entry) => sum + entry.minutes,
    0
  );

  const calculateCost = () => {
    const cost = (((parseFloat(rate) || 0) * totalMinutes) / 60).toFixed(2);
    return cost;
  };

  // Save the sheet by sending data to the backend.
  const handleEntriesSave = async () => {
    if (!sheetName) {
      alert("Please provide a sheet name");
      return;
    }
    const sheetData = {
      sheetName,
      description,
      rate,
      minutesEntries,
      totalMinutes,
      totalCost: calculateCost(),
    };
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(apiUrl + `/sheets/${sheetId}`, {
        method: "PUT",
        body: JSON.stringify(sheetData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const { message } = await response.json();
        alert(message || "Failed to save sheet");
      } else {
        navigate("/sheetList");
      }
    } catch (err) {
      alert("Error saving sheet");
    }
  };

  const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(apiUrl + "/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <div className="flex flex-col gap-2 m-4">
          <button
            onClick={handleEntriesSave}
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            Save & Exit Sheet
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4 mt-8">
        <div className="w-full flex justify-center items-center">
          <h1 className="text-3xl font-semibold">{sheetName || "New Sheet"}</h1>
        </div>
        <div className="flex justify-center w-full">
          <input
            type="text"
            placeholder="Sheet Name"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            className="border border-black p-1 mb-2"
          />
        </div>
        <div className="flex justify-center w-full">
          <textarea
            id="description"
            className="text-sm border border-black p-1 w-64 resize-none"
            placeholder="Enter a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <label>Rate ($/hr):</label>
          <input
            className="w-32 border border-black p-1"
            type="number"
            step="0.01"
            value={rate}
            onChange={handleRateChange}
            placeholder="Enter rate..."
          />
        </div>
        <div className="text-lg font-medium">
          Total Time: {totalMinutes} Minutes
        </div>
        <div className="text-lg font-medium">
          Total Cost: ${calculateCost()}
        </div>
      </div>

      {/* Minutes Entries */}
      <div className="w-full flex flex-col items-center gap-4 mt-8">
        {minutesEntries.map((entry, index) => (
          <div
            key={index}
            className="w-full flex justify-center items-center gap-4"
          >
            <label>Date:</label>
            <input
              type="date"
              value={entry.date}
              onChange={(e) => handleUpdateEntry(index, "date", e.target.value)}
            />
            <label>Minutes:</label>
            <input
              className="w-24 border border-black text-center"
              type="number"
              min="1"
              max="1440"
              value={entry.minutes}
              onChange={(e) =>
                handleUpdateEntry(
                  index,
                  "minutes",
                  Math.max(0, parseInt(e.target.value) || 0)
                )
              }
            />
          </div>
        ))}
        <button
          onClick={handleAddEntry}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-3xl cursor-pointer"
        >
          Add New Entry
        </button>
      </div>
    </div>
  );
}
