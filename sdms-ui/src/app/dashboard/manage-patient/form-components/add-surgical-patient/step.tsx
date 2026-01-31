interface StepProps {
  label: string;
  active: boolean;
  completed: boolean;
  onClick: () => void;
}

export default function Step({ label, active, completed, onClick }: StepProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center transition-all duration-300
        ${active ? "text-blue-600 scale-110" : ""}
        ${completed ? "text-green-600" : ""}
        ${!active && !completed ? "text-gray-400" : ""}
      `}
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center mb-1
        ${active 
          ? "bg-blue-100 border-2 border-blue-500" 
          : completed 
            ? "bg-green-100 border-2 border-green-500" 
            : "bg-gray-100 border-2 border-gray-300"}
      `}>
        {completed ? (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <span className={`text-sm font-medium ${active ? "text-blue-600" : "text-gray-500"}`}>
            {active ? "•" : "○"}
          </span>
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}