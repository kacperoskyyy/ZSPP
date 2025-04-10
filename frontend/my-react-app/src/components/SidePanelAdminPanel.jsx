import { FaChartPie, FaClipboardList, FaUsers, FaToolbox, FaMapMarkedAlt, FaHeadset } from 'react-icons/fa';

const menuItems = [
  { icon: <FaChartPie />, label: 'Panel raportowy' },
  { icon: <FaClipboardList />, label: 'Lista wypożyczeń' },
  { icon: <FaUsers />, label: 'Użytkownicy' },
  { icon: <FaToolbox />, label: 'Zarządzanie sprzętem' },
  { icon: <FaMapMarkedAlt />, label: 'Zarządzanie lokalizacjami' },
  { icon: <FaHeadset />, label: 'Support klienta' },
];

export default function SidebarAdminPanel() {
  return (
    <aside className="bg-white w-60 h-full shadow-md p-4 flex flex-col gap-6">
      <h2 className="text-xl font-bold">
        WSS<span className="text-sm align-super">Admin</span>
      </h2>
      <nav className="flex flex-col gap-4">
        {menuItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
            <div className="text-green-500 text-lg">{item.icon}</div>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
