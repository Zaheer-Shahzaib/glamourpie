import { Outlet } from "react-router-dom";
import MainLayout from "./Main";

/** Single shell for authenticated app routes — keeps Navigation mounted across page changes. */
export default function AppLayoutRoute() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
