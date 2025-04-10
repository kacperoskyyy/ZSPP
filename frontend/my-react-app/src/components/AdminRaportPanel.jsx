import AdminPanelButton from './AdminPanelButton';
import { FaDollarSign, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export default function AdminRaportPanel() {
  return (
    <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
      <section>
        <h3 className="text-lg font-bold mb-4">Raporty ogólne</h3>
        <div className="flex flex-wrap gap-6">
          <AdminPanelButton icon={<FaDollarSign />} text="Wygeneruj pełny raport finansowy" />
          <AdminPanelButton icon={<FaMapMarkerAlt />} text="Wygeneruj pełny raport z podsumowaniem każdej lokalizacji" />
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-4">Raporty dla lokalizacji</h3>
        <div className="flex flex-wrap gap-6">
          <AdminPanelButton icon={<FaDollarSign />} text="Wygeneruj raport finansowy dla lokalizacji" />
          <AdminPanelButton icon={<FaMapMarkerAlt />} text="Wygeneruj raport wypożyczeń dla lokalizacji" />
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-4">Raporty użytkowników</h3>
        <div className="flex flex-wrap gap-6">
          <AdminPanelButton icon={<FaUser />} text="Wygeneruj raport wypożyczeń użytkowników" />
          <AdminPanelButton icon={<FaUser />} text="Wygeneruj raport pracowników" />
        </div>
      </section>
    </main>
  );
}
