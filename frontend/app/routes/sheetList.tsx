import { useState, useEffect } from "react";
import { redirect, useNavigate, type ClientLoaderFunctionArgs, type LoaderFunctionArgs } from "react-router";

type Sheet = {
  _id: string;
  sheetName: string;
  description: string;
  rate: string;
  minutesEntries: { date: string; minutes: number }[];
  totalMinutes: number;
  totalCost: string;
};

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(apiUrl + "/protected", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    throw redirect("/");
  }
  const data = await response.json();
  return data.user || "No user found in cookie";
}

export default function SheetList() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSheetName, setNewSheetName] = useState("");
  const navigate = useNavigate();

  // Fetch list of sheets from backend
  useEffect(() => {
    async function fetchSheets() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(apiUrl + "/sheets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setSheets(data.sheets);
        } else {
          console.error("Failed to fetch sheets");
        }
      } catch (error) {
        console.error("Error fetching sheets", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSheets();
  }, []);

  // Handle creation of a new sheet via modal
  const handleCreateNewSheet = async () => {
    if (!newSheetName.trim()) {
      alert("Please enter a valid sheet name.");
      return;
    }
    try {
      const defaultMinutesEntry = {
        date: new Date().toISOString().slice(0, 10),
        minutes: 0,
      };
      // Create an empty sheet on the backend with the given name.
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(apiUrl + "/sheets", {
        method: "POST",
        body: JSON.stringify({
          sheetName: newSheetName,
          description: "",
          rate: "",
          minutesEntries: [defaultMinutesEntry],
          totalMinutes: 0,
          totalCost: "0.00",
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Navigate to the Sheet page to start editing
        navigate("/sheet", {
          state: {
            sheet: {
              _id: data.sheetId,
              sheetName: newSheetName,
              minutesEntries: [defaultMinutesEntry],
            },
          },
        });
      } else {
        const { message } = await response.json();
        alert(message || "Failed to create sheet");
      }
    } catch (error) {
      console.error("Error creating sheet", error);
    }
    setModalOpen(false);
    setNewSheetName("");
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
      <div className="flex justify-end mr-4 mt-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">My Sheets</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
        >
          Create New Sheet
        </button>
        {loading ? (
          <div>Loading sheets...</div>
        ) : sheets.length === 0 ? (
          <div>No sheets found.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {sheets.map((sheet) => (
              <div
                key={sheet._id}
                onClick={() =>
                  navigate("/sheet", {
                    state: { sheetName: sheet.sheetName, sheet },
                  })
                }
                className="p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
              >
                {sheet.sheetName}
              </div>
            ))}
          </div>
        )}
        {/* Modal for creating new sheet */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="bg-white p-4 rounded w-80">
              <h2 className="text-xl font-semibold mb-4">Create New Sheet</h2>
              <input
                type="text"
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                placeholder="Enter sheet name"
                className="border border-gray-300 p-2 w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setNewSheetName("");
                  }}
                  className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewSheet}
                  className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
