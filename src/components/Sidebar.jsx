import {
  ArrowRightOutlined,
  BarChartOutlined,
  CarOutlined,
  CloseOutlined,
  HomeOutlined,
  LockOutlined,
  MailOutlined,
  ProfileOutlined,
  SolutionOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Alert, Menu } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo1 from "../assets/logo-1.png";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import useFinalUserImage from "./common/Logo";

const getMenuItems = (collapsed) => {
  const dashboardItems = [
    { key: "/home", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "/event", icon: <TagsOutlined />, label: "Event" },
  ];

  const managementChildren = [
    { key: "/life-member", icon: <LockOutlined />, label: "Life Membership" },
    {
      key: "/couple-member",
      icon: <SolutionOutlined />,
      label: "Couple Membership",
    },
    { key: "/", icon: <CarOutlined />, label: "Trust" },
  ];
  const reportItemsChildren = [
    {
      key: "sales-submenu",
      icon: <ProfileOutlined />,
      label: "Member",
      children: [
        {
          key: "/member",
          icon: <ProfileOutlined />,
          label: "Life Membership",
        },
        {
          key: "/couple-member",
          icon: <ProfileOutlined />,
          label: "Couple Membership",
        },
        {
          key: "/",
          icon: <ProfileOutlined />,
          label: "Trust",
        },
      ],
    },
  ];

  if (collapsed) {
    return [
      ...dashboardItems,
      {
        key: "sub1",
        icon: <MailOutlined />,
        label: "Management",
        children: managementChildren,
      },
      {
        key: "sub2",
        icon: <BarChartOutlined />,
        label: "Report",
        children: reportItemsChildren,
      },
    ];
  }

  return [
    {
      type: "group",
      label: "Dashboard",
      children: dashboardItems,
    },
    {
      type: "group",
      label: "Member",
      children: [
        {
          key: "sub1",
          icon: <MailOutlined />,
          label: "Member",
          children: managementChildren,
        },
      ],
    },
    {
      type: "group",
      label: "Report",
      children: [
        {
          key: "sub2",
          icon: <BarChartOutlined />,
          label: "Report",
          children: reportItemsChildren,
        },
      ],
    },
  ];
};

export default function Sidebar({ collapsed, isMobile = false, onClose }) {
  const [selectedKeys, setSelectedKeys] = useState([""]);
  const [openKeys, setOpenKeys] = useState([""]);
  const naviagte = useNavigate();
  const items = getMenuItems(collapsed);
  const dispatch = useDispatch();
  const finalUserImage = useFinalUserImage();
  const [delayedCollapse, setDelayedCollapse] = useState(collapsed);
  const localVersion = useSelector((state) => state.auth?.version);
  const serverVersion = useSelector((state) => state?.version?.version);
  const showDialog = localVersion !== serverVersion ? true : false;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedCollapse(collapsed);
    }, 150);

    return () => clearTimeout(timeout);
  }, [collapsed]);

  const handleOpenDialog = () => {
    dispatch(
      setShowUpdateDialog({
        showUpdateDialog: true,
        version: serverVersion,
      })
    );
  };
  const rootSubmenuKeys = ["sub1", "sub2"];

  return (
    <motion.aside
      initial={{ width: collapsed ? 95 : 260 }}
      animate={{ width: collapsed ? 95 : 260 }}
      transition={{ duration: 0.3 }}
      className={`h-full bg-white shadow-xl rounded-r-2xl overflow-hidden flex flex-col font-[Inter] transition-all duration-300
        ${isMobile ? "fixed z-50 h-screen" : "relative"}`}
    >
      {/* Header bg-[#006666]*/}
      <div className="flex items-center justify-center h-14 px-4 bg-blue-50">
        <motion.img
          src={collapsed ? finalUserImage : finalUserImage}
          alt="Logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`object-contain transition-all duration-300 ${
            collapsed ? "w-8" : "w-28 h-12"
          }`}
        />

        {isMobile && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors"
          >
            <CloseOutlined className="text-xl" />
          </motion.button>
        )}
      </div>

      <div className="flex-1  py-2 scrollbar-custom">
        <Menu
          mode="inline"
          inlineCollapsed={delayedCollapse}
          items={items}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          // onOpenChange={(keys) => setOpenKeys(keys)}
          onOpenChange={(keys) => {
            const latestOpenKey = keys.find(
              (key) => openKeys.indexOf(key) === -1
            );
            if (rootSubmenuKeys.includes(latestOpenKey)) {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            } else {
              setOpenKeys(keys);
            }
          }}
          onClick={({ key, keyPath }) => {
            setSelectedKeys([key]);
            if (isMobile && onClose) {
              onClose();
            }
            if (keyPath.length === 1) {
              setOpenKeys([]);
            }

            naviagte(key);
          }}
          className="custom-menu"
        />
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500  text-center border-t border-blue-600 bg-blue-50"
        >
          {showDialog ? (
            <div
              className="w-full cursor-pointer animate-pulse"
              onClick={handleOpenDialog}
            >
              <Alert
                message={
                  <div className="flex items-center justify-center text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      New Updated: V{localVersion}
                      <ArrowRightOutlined />V{serverVersion}
                    </span>
                  </div>
                }
                type="info"
                showIcon={false}
                banner
                className="rounded-md bg-blue-50 text-blue-800 border-blue-100 px-4 py-1 text-center"
              />
            </div>
          ) : (
            <Alert
              message={
                <div className="flex flex-col items-center text-center text-xs font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1">
                      Version: {localVersion}
                    </span>
                  </div>
                  <div className="text-[11px] font-normal text-gray-500 mt-1">
                    Updated on: 05-08-2025
                  </div>
                </div>
              }
              type="info"
              showIcon={false}
              banner
              className="rounded-md bg-blue-50 text-blue-800 border-blue-100 px-4 py-1"
            />
          )}
        </motion.div>
      )}
    </motion.aside>
  );
}
