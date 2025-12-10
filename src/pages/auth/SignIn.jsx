import { App, Button, Form, Input, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PANEL_LOGIN } from "../../api";
import useFinalUserImage from "../../components/common/Logo";
import { useApiMutation } from "../../hooks/useApiMutation";
import { setCredentials } from "../../store/auth/authSlice";
import { useEffect } from "react";
const { Title } = Typography;
const SignIn = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { trigger, loading } = useApiMutation();
  const token = useSelector((state) => state.auth.token);
  const finalUserImage = useFinalUserImage();

  // useEffect(() => {
  //   if (token) {
  //     navigate("/home", { replace: true });
  //   }
  // }, [token, navigate]);
  const onFinish = async (values) => {
    const { email, password } = values;

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await trigger({
        url: PANEL_LOGIN,
        method: "post",
        data: formData,
      });
      if (res.code == 200 && res.UserInfo?.token) {
        const { UserInfo, company_detils, company_image, version } = res;

        dispatch(
          setCredentials({
            token: UserInfo.token,
            tokenExpireAt: UserInfo.token_expires_at,
            user: UserInfo.user,
            userDetails: company_detils,
            userImage: company_image,
            version: version?.version_panel,
          })
        );
        console.log(email, "email");
        if (email == "8867171060") {
          navigate("/member");
        } else {
          navigate("/home");
        }
      } else {
        message.error(
          res.message || "Login Failed, Please check your credentials."
        );
      }
    } catch (err) {
      message.error(
        err.response.data.message || "An error occurred during login."
      );
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: `
      radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
      radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(to bottom right, #ff8259, #fb6332, #e54e1e)
    `,
          backgroundSize: "22px 22px, 30px 30px, 100% 100%",
          backgroundPosition: "0 0, 12px 12px, 0 0",
        }}
      >
        {/* Glass Card */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 m-2 md:p-6 md:m-4 backdrop-blur-xl bg-white/20 rounded-3xl shadow-2xl border border-white/30">
          {/* Left Side */}
          <div className="bg-white/70 backdrop-blur-lg rounded-tl-2xl rounded-bl-2xl p-8 shadow-sm border border-orange-100">
            <div className="flex flex-col justify-center md:px-4 py-6">
              {/* Logo */}
              <div className="text-center mb-6">
                <img
                  src={finalUserImage || ""}
                  alt="Logo"
                  className="h-20 mx-auto drop-shadow-md"
                />
                <Title
                  level={3}
                  className="text-gray-800 font-bold mt-2 tracking-wide"
                >
                  Sign in to your account
                </Title>
              </div>

              {/* Form */}
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="w-full"
                initialValues={{
                  email: "",
                  password: "",
                }}
                requiredMark={false}
              >
                <Form.Item
                  label={
                    <span className="font-medium text-gray-700">
                      Username <span className="text-red-500">*</span>
                    </span>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your username" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter username"
                    className="rounded-lg focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-200"
                    autoFocus
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span className="font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your password" },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Enter password"
                    className="rounded-lg focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-200"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    // className="!bg-orange-600 hover:!bg-orange-700 !border-0 !rounded-lg !py-2 !text-white !text-base transition-all shadow-md"
                  >
                    {loading ? "Checking..." : "Sign In"}
                  </Button>
                </Form.Item>

                {/* Links */}
                <div className="flex items-center justify-between w-full text-sm mt-2">
                  <Link
                    to="/register-form"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Register
                  </Link>

                  <Link
                    to="/forget-password"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </Form>
            </div>
          </div>

          {/* Right Side — Image */}
          <div className="hidden md:flex items-center justify-center">
            <img
              src="https://samyuktgujaratisamaj.com/draft1/img/about.jpg"
              alt="Login Illustration"
              className="w-full  h-full  rounded-tr-2xl rounded-br-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
