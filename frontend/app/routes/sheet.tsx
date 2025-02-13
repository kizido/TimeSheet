import { useState, type ChangeEvent } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import type { LoaderFunctionArgs } from "react-router";
import { requireAuthCookie } from "~/auth";

type MinutesEntry = {
  date: Date;
  minutes: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
    let userId = await requireAuthCookie(request);
}

export default function Sheet() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [minutesEntries, setMinutesEntries] = useState<MinutesEntry[]>([
    { date: new Date(), minutes: 0 },
  ]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only change value to valid decimal number
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setRate(value);
    }
  };

  const handleAddEntry = () => {
    setMinutesEntries([...minutesEntries, { date: new Date(), minutes: 0 }]);
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

  const calculateCost = () => {
    const cost = (((parseFloat(rate) || 0) * totalMinutes) / 60).toFixed(2);

    return cost;
  };

  const totalMinutes = minutesEntries.reduce(
    (sum, entry) => sum + entry.minutes,
    0
  );

  return (
    <div>
      <div className="flex justify-end">
        <div className="flex flex-col gap-2 m-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
            Save & Exit Sheet
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
            Logout
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4 mt-8">
        <div className="w-full flex justify-center items-center relative">
          <h1 className="text-3xl font-semibold">Placeholder Sheet Title</h1>
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
            onChange={handleChange}
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
            {/* <DatePicker
              className="text-center border border-black w-32 outline-none"
              selected={entry.date}
              onChange={(newDate) => handleUpdateEntry(index, "date", newDate)}
            /> */}
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

        {/* Add Entry Button */}
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
