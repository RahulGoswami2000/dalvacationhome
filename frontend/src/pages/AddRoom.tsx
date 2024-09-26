/* eslint-disable */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, { OptionsOrGroups, MultiValue } from "react-select";
import { Accountcontext } from "../context/Account";

const roomTypes = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "queen", label: "Queen" },
  { value: "king", label: "King" },
  { value: "suite", label: "Suite" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
];

type OptionType = { value: string; label: string };

const featureOptions = [
  { value: "WiFi", label: "WiFi" },
  { value: "TV", label: "TV" },
  { value: "Air Conditioning", label: "Air Conditioning" },
  { value: "Heater", label: "Heater" },
  { value: "Fridge", label: "Fridge" },
];

function AddRoom() {
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [features, setFeatures] = useState<OptionType[]>([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [formData, setFormData] = useState({
    roomType: "",
    roomPrice: "",
    roomFeatures: [] as any[],
    roomId: "",
  });
  const [currentUserDetails, setCurrentUserDetails] = useState<any>("");

  const context = useContext(Accountcontext);
  const navigate = useNavigate();

  const { getSession, getCurrentUserDetails } = context;

  const getCurrentUser = async () => {
    const currentUser = (await getSession()).getAccessToken().payload;
    const userDetail = await getCurrentUserDetails(currentUser.sub);

    setCurrentUserDetails(userDetail);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      roomType: roomType,
      roomPrice: price,
      roomFeatures: features.map((feature: any) => feature.value) as any[],
      roomId: roomNumber,
    }));
  }, [roomType, price, features, roomNumber]);

  const validateForm = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!formData.roomType) {
      newErrors.roomType = "Type is required";
      isValid = false;
    }
    if (!formData.roomPrice) {
      newErrors.roomPrice = "Price is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.roomPrice)) {
      newErrors.roomPrice = "Price should only contain digits";
      isValid = false;
    }

    return isValid;
  };

  const handleFeatureChanges = (newValue: MultiValue<OptionType>) => {
    setFeatures(newValue as OptionType[]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataToSend = formData;
        console.log(formDataToSend);

        await axios.post(
          `https://a4jyx77ow6zsku6ur4sn7ejdzi0mitfi.lambda-url.us-east-1.on.aws/`,
          formDataToSend
        );
        navigate("/rooms");
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <>
    {currentUserDetails.role === "property_agent" ? (
      <div className="mx-auto max-w-lg mt-16 p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Add Room
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Room Type
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="" disabled>
                Select Room Type
              </option>
              {roomTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Room Number
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Features
            </label>
            <Select
              isMulti
              options={featureOptions as OptionsOrGroups<OptionType, never>}
              value={features}
              onChange={handleFeatureChanges}
              className="w-full mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Add Room
          </button>
        </form>
      </div>
    ) : (
      <div className="mx-auto max-w-lg mt-16 p-8 bg-white shadow-lg rounded-lg border border-gray-200 text-center text-gray-700">
        Access Denied
      </div>
    )}
  </>
  
  
  );
}

export default AddRoom;
