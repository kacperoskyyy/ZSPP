import SidebarAdminPanel from "./components/SidePanelAdminPanel";
import AdminRaportPanel from "./components/AdminRaportPanel";
import index from "./index.css";

export default function AdminPanelMain() {
    return (
        <div className="flex h-screen">
        <SidebarAdminPanel />
        <AdminRaportPanel />
        </div>
    );
}