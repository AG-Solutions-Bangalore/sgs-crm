// import { useEffect, useState } from "react";
// import { Drawer, ConfigProvider } from "antd";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// export default function Layout({ children }) {
//   const [isMobile, setIsMobile] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   // const userMobile = useSelector((state) => state.auth?.user?.mobile);

//   return (
//     <div className="flex h-screen overflow-hidden">
//       {!isMobile && <Sidebar collapsed={collapsed} isMobile={isMobile} />}

//       {isMobile && (
//         <Drawer
//           placement="left"
//           closable={false}
//           onClose={() => setDrawerOpen(false)}
//           open={drawerOpen}
//           styles={{ body: { padding: 0 } }}
//           width={256}
//         >
//           <Sidebar
//             collapsed={false}
//             onClose={() => setDrawerOpen(false)}
//             isMobile={true}
//           />
//         </Drawer>
//       )}

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar
//           collapsed={collapsed}
//           onToggle={() => {
//             if (isMobile) {
//               setDrawerOpen(true);
//             } else {
//               setCollapsed(!collapsed);
//             }
//           }}
//         />
//         <main className="flex-1 overflow-auto p-4 bg-gray-100">{children}</main>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { Button, Drawer, Tabs } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const userMobile = useSelector((state) => state.auth?.user?.mobile);
  const allowedMobile = "8867171060";
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const show = userMobile == allowedMobile;
  const showSidebar = userMobile !== allowedMobile;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {showSidebar && !isMobile && (
        <Sidebar collapsed={collapsed} isMobile={isMobile} />
      )}
      {showSidebar && isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          bodyStyle={{ padding: 0 }}
          width={256}
        >
          <Sidebar
            collapsed={false}
            onClose={() => setDrawerOpen(false)}
            isMobile={true}
          />
        </Drawer>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          collapsed={collapsed}
          show={show}
          showSidebar={showSidebar}
          onToggle={() => {
            if (isMobile) {
              setDrawerOpen(true);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        />

        <main className="flex-1 overflow-auto p-4 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
