export default function AdminPanelButton({ icon, text }) {
  return (
    <div className="relative bg-gray p-4 rounded-lg shadow hover:shadow-lg cursor-pointer w-full max-w-xs">
      <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">K</div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-4xl">{icon}</div>
        <p className="text-center font-semibold">{text}</p>
      </div>
    </div>
  );
}
