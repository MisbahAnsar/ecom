import { Routes, Route } from "react-router-dom";
import { Sidenav, DashboardNavbar, Footer } from "@/widgets/layout";
import routes from "@/routes";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { useEffect } from "react";

export function AdminDashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { sidenavType } = controller;

  useEffect(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1140) {
      return setOpenSidenav(dispatch, true);
    }
  }, []);

  return (
    <div className="min-h-screen absolute top-0 left-0 w-full bg-white plus-jakarta overscroll-y-auto bg-blue-gray-50/50 z-50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        {/* <div className="text-blue-gray-600"><Footer /></div> */}
      </div>
    </div>
  );
}

export default AdminDashboard;
