import React from "react";

const NotificationPopup = ({ message, isVisible, type }) => {
  if (!isVisible) return null;

  // Background color and text color based on the type
  const bgColor = "bg-white"; // White background
  const textColor = type === "success" ? "text-black" : "text-gray-500"; // Dark text for success, gray for others

  // White SVG checkmark icon
  const icon = (
    <div className="flex justify-center items-center w-6 h-6 bg-black rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-md shadow-md flex items-center ${bgColor} ${textColor} z-50`}
      style={{
        width: "fit-content",
        minWidth: "300px",
        border: "1px solid #E5E4E2", // This forces the gray border
      }}
    >
      <span className="mr-3">{icon}</span>
      {message}
    </div>
  );
};

export default NotificationPopup;
