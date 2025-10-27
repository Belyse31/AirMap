export function Slider({ min = 0, max = 100, value, onChange, label, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        aria-label={label}
      />
    </div>
  );
}
