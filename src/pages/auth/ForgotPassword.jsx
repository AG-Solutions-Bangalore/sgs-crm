import { App, Button, Form, Input, Typography } from "antd";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { PANEL_SEND_PASSWORD } from "../../api";
import useFinalUserImage from "../../components/common/Logo";
import { useApiMutation } from "../../hooks/useApiMutation";
const { Title } = Typography;
import logo from "../../assets/logo-1.png";
import bgSignin from "../../assets/bg-sigin.png";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const finalUserImage = useFinalUserImage();

  const { trigger, loading } = useApiMutation();
  const token = useSelector((state) => state.auth.token);

  if (token) {
    return <Navigate to="/home" replace />;
  }
  const onFinish = async (values) => {
    const { username, email } = values;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);

    try {
      const res = await trigger({
        url: PANEL_SEND_PASSWORD,
        method: "post",
        data: formData,
      });
      if (res.code == 200) {
        message.success(res.message || "Sucess");
      } else {
        message.error(res.message || "An error occurred during send password.");
      }
    } catch {
      message.error("An error occurred during send password");
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundImage: `url(${bgSignin})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl border border-orange-200 rounded-2xl p-8 animate-fadeIn">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src={finalUserImage || ""}
              alt="Logo"
              className="h-20 mx-auto mb-3"
            />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
              Reset Your Password
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your username & email to continue
            </p>
          </div>

          {/* Form */}
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{
              username: "",
              email: "",
            }}
          >
            <Form.Item
              label={
                <span className="font-medium text-gray-700">
                  Username <span className="text-red-500">*</span>
                </span>
              }
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter username"
                className="!border-orange-300 focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-300 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </span>
              }
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input
                size="large"
                type="email"
                placeholder="Enter email"
                className="!border-orange-300 focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-300 rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="!bg-orange-500 hover:!bg-orange-600 !border-none rounded-lg font-medium"
              >
                {loading ? "Checking..." : "Reset Password"}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer link */}
          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-sm text-orange-600 hover:underline font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
