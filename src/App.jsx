import { Route, Routes } from "react-router-dom";
import AppInitializer from "./components/AppInitializer";
import MaintenancePage from "./components/common/MaintenancePage";
import ProtectedLayout from "./components/ProtectedLayout";
import VersionCheck from "./components/VersionCheck";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SignIn from "./pages/auth/SignIn";
import DeliveryList from "./pages/delivery/DeliveryList";
import EvenList from "./pages/event/EventList";
import GuestUserList from "./pages/guestuser/GuestUserList";
import GuestUserOrderForm from "./pages/guestuserorder/GuestUserOrderForm";
import GuestUserOrderList from "./pages/guestuserorder/GuestUserOrderList";
import Dashbord from "./pages/home/dashbord";
import LifeMembersPage from "./pages/member/LifeMembersPage";
import Notification from "./pages/notification/Notification";
import OrderForm from "./pages/order/OrderForm";
import OrderList from "./pages/order/OrderList";
import ProductForm from "./pages/product/ProductForm";
import ProductList from "./pages/product/ProductList";
import UserPage from "./pages/profile/Profile";
import CategoryReport from "./pages/report/CategoryReport/CategoryReport";
import OrderProductReport from "./pages/report/OrderProductReport/OrderProductReport";
import OrderReport from "./pages/report/Orderreport/Orderreport";
import ProductCategoryReport from "./pages/report/ProductCategoryReport/ProductCategoryReport";
import ProductReport from "./pages/report/ProductReport/ProductReport";
import SecurityList from "./pages/security/SecurityList";
import SliderList from "./pages/slider/SliderList";
import StaffList from "./pages/staff/StaffList";
import UserForm from "./pages/user/UserForm";
import UserList from "./pages/user/UserList";
import WebsiteEnquiry from "./pages/websiteenquiry/WebsiteEnquiry";
import MemberForm from "./components/MemberList/MemberForm";

function App() {
  return (
    <AppInitializer>
      <VersionCheck />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/maintenance" element={<MaintenancePage />} />

        {/* Protected Routes: All other paths */}
        <Route
          path="*"
          element={
            <ProtectedLayout>
              <Routes>
                <Route path="/home" element={<Dashbord />} />
                <Route path="/event" element={<EvenList />} />
                <Route path="/life-member" element={<LifeMembersPage />} />
                <Route
                  path="/members/edit/:memberId"
                  element={<MemberForm />}
                />

                <Route path="/user-form" element={<UserPage />} />
                <Route path="/user-create" element={<UserForm />} />
                <Route path="/user-edit/:id" element={<UserForm />} />
                <Route path="/user" element={<UserList />} />
                <Route path="/security" element={<SecurityList />} />
                <Route path="/staff" element={<StaffList />} />
                <Route path="/delivery" element={<DeliveryList />} />
                <Route path="/slider" element={<SliderList />} />
                <Route path="/notification" element={<Notification />} />
                <Route path="/order" element={<OrderList />} />
                <Route path="/order-form" element={<OrderForm />} />
                <Route path="/order-form/:id" element={<OrderForm />} />
                <Route path="/guest-user" element={<GuestUserList />} />
                <Route
                  path="/guest-user-order"
                  element={<GuestUserOrderList />}
                />
                <Route
                  path="/guest-order-form"
                  element={<GuestUserOrderForm />}
                />
                <Route
                  path="/guest-order-form/:id"
                  element={<GuestUserOrderForm />}
                />

                <Route path="/product" element={<ProductList />} />
                <Route path="/product-create" element={<ProductForm />} />
                <Route path="/product-edit/:id" element={<ProductForm />} />
                <Route path="/website-enquiry" element={<WebsiteEnquiry />} />
                <Route path="/report-order" element={<OrderReport />} />
                <Route
                  path="/report-order-product"
                  element={<OrderProductReport />}
                />
                <Route path="/report-category" element={<CategoryReport />} />
                <Route path="/report-product" element={<ProductReport />} />
                <Route
                  path="/report-product-category"
                  element={<ProductCategoryReport />}
                />

                {/* Add more protected routes here */}
              </Routes>
            </ProtectedLayout>
          }
        />
      </Routes>
    </AppInitializer>
  );
}
export default App;
