const Loader = ({ size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className={`animate-spin ${sizeClasses[size]}`}>
        <div className="border-4 border-gray-300 border-t-blue-500 rounded-full w-full h-full"></div>
      </div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};

export default Loader;
