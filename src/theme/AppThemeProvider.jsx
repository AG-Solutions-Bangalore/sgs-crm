import { ConfigProvider, App as AntdApp } from "antd";

const AppThemeProvider = ({ children }) => {

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563EB",
          // colorPrimary: "#1c8fc7",
        },
        components: {
          Menu: {
            itemSelectedBg: "#2563EB",
            itemSelectedColor: "#ffffff",
            itemHoverColor: "#2563EB",
            itemHoverBg: "#EFF6FF",
          },
        },
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};

export default AppThemeProvider;
