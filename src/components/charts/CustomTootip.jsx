import React from "react";

const CustomTootip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-semibold text-purple-800 mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm font-medium text-gray-900">
          Count: <span className="">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return <div></div>;
};

export default CustomTootip;
