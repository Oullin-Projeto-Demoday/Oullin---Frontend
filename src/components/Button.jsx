export default function Button({ onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-10 py-4 bg-[#FB8500] text-white rounded-[15px] hover:bg-[#0D4889] ${className}`}
    >
      {children}
    </button>
  );
}