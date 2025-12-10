import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Switch,
  Upload,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { REGESTRATION_DATA } from "../../api";
import AvatarCell from "../../components/common/AvatarCell";
import CardHeader from "../../components/common/CardHeader";
import CropImageModal from "../../components/common/CropImageModal";
import membershipTypes from "../../components/json/membershipTypes.json";
import { useApiMutation } from "../../hooks/useApiMutation";
const NewRegisterationOut = () => {
  const { newId } = useParams();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const { trigger: fetchTrigger } = useApiMutation();
  const navigate = useNavigate();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const [userImageInfo, setUserImageInfo] = useState({
    file: null,
    preview: "",
  });
  const [spouseImageInfo, setSpouseImageInfo] = useState({
    file: null,
    preview: "",
  });

  const [cropState, setCropState] = useState({
    modalVisible: false,
    imageSrc: null,
    tempFileName: "",
    target: "",
  });

  const isEditMode = Boolean(newId);

  const fetchMember = async () => {
    try {
      const res = await fetchTrigger({
        url: `${REGESTRATION_DATA}/${newId}`,
      });
      if (!res?.data) return;
      const member = res.data;
      setInitialData(member);

      const userImageBase = res.image_url?.find(
        (img) => img.image_for == "User"
      )?.image_url;

      if (member.user_image && userImageBase) {
        setUserImageInfo({
          file: null,
          preview: `${userImageBase}${member.user_image}`,
        });
      }
      if (member.spouse_image && userImageBase) {
        setSpouseImageInfo({
          file: null,
          preview: `${userImageBase}${member.spouse_image}`,
        });
      }

      form.setFieldsValue({
        ...member,
        user_dob: member.user_dob ? dayjs(member.user_dob) : null,
        user_spouse_dob: member.user_spouse_dob
          ? dayjs(member.user_spouse_dob)
          : null,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      message.error(err.response.data.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchMember();
    } else {
      form.resetFields();
    }
  }, [newId]);
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("user_mid", values.user_mid || "");
      formData.append("user_full_name", values.user_full_name?.trim() || "");
      formData.append(
        "user_dob",
        values.user_dob ? values.user_dob.format("YYYY-MM-DD") : ""
      );
      formData.append("user_mobile", values.user_mobile?.trim() || "");
      formData.append("user_whatsapp", values.user_whatsapp?.trim() || "");
      formData.append("user_email", values.user_email?.trim() || "");
      formData.append("user_add", values.user_add?.trim() || "");
      formData.append(
        "user_spouse_name",
        values.user_spouse_name?.trim() || ""
      );
      formData.append(
        "user_spouse_mobile",
        values.user_spouse_mobile?.trim() || ""
      );
      formData.append(
        "user_spouse_dob",
        values.user_spouse_dob
          ? values.user_spouse_dob.format("YYYY-MM-DD")
          : ""
      );
      formData.append("user_type", values.user_type || "");
      formData.append("user_cat", values.user_cat || "");
      formData.append(
        "user_status",
        values.user_status ? "active" : "inactive"
      );
      if (userImageInfo.file) {
        formData.append("user_image", userImageInfo.file);
      }

      if (spouseImageInfo.file) {
        formData.append("spouse_image", spouseImageInfo.file);
      }
      const res = await submitTrigger({
        url: `${REGESTRATION_DATA}/${newId}?_method=PUT`,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.code == 201) {
        message.success(res.message || "Registration Updated!");
        navigate("/new-registration-list");
      } else {
        message.error(res.message || "Failed to save registration.");
      }
    } catch (error) {
      message.error(error.response.data.message || "Something went wrong.");
    }
  };

  const openCropper = (file, target) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({
        modalVisible: true,
        imageSrc: reader.result,
        tempFileName: file.name,
        target,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = ({ blob, fileUrl }) => {
    const file = new File([blob], cropState.tempFileName || "image.jpg", {
      type: blob.type,
    });
    if (cropState.target == "user") {
      setUserImageInfo({ file, preview: fileUrl });
    } else if (cropState.target == "spouse") {
      setSpouseImageInfo({ file, preview: fileUrl });
    }

    setCropState({
      modalVisible: false,
      imageSrc: null,
      tempFileName: "",
      target: "",
    });
  };

  return (
    <Form
      form={form}
      initialValues={initialData}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <div className="!min-h-screen !bg-gradient-to-br !from-blue-50 !to-indigo-100 !p-8 !flex !items-center !justify-center">
        <div className="!w-full !max-w-6xl">
          <Card
            title={
              <div className="!text-center !py-2">
                <h2 className="!text-2xl !font-bold !text-gray-800 !m-0">
                  New Member Registration
                </h2>
                <p className="!text-sm !text-gray-500 !mt-1 !m-0">
                  Please fill in all required information
                </p>
              </div>
            }
            className="!shadow-2xl !rounded-2xl"
            bordered={false}
          >
            <div className="!mb-6">
              <Divider orientation="left" className="!border-gray-300">
                <span className="!text-base !font-semibold !text-gray-700 !flex !items-center !gap-2">
                  <UserOutlined /> Personal Information
                </span>
              </Divider>
              <div className="!grid !grid-cols-1 md:!grid-cols-4 !gap-4">
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      MID <span className="text-red-500">*</span>
                    </span>
                  }
                  name="user_mid"
                  rules={[{ required: true, message: "Please Enter MID" }]}
                >
                  <Input
                    maxLength={20}
                    placeholder="Enter mid"
                    className="!rounded-lg"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Full Name<span className="text-red-500">*</span>
                    </span>
                  }
                  name="user_full_name"
                  rules={[
                    { required: true, message: "Please enter full name" },
                  ]}
                >
                  <Input
                    maxLength={20}
                    placeholder="Enter full name"
                    className="!rounded-lg"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Date of Birth<span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[{ required: true, message: "Select DOB" }]}
                  name="user_dob"
                >
                  <DatePicker
                    className="!w-full !rounded-lg"
                    format="DD-MM-YYYY"
                    placeholder="Select date"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Mobile Number<span className="text-red-500">*</span>
                    </span>
                  }
                  name="user_mobile"
                  rules={[
                    { required: true, message: "Please enter mobile number" },
                    {
                      pattern: /^\d{10}$/,
                      message: "Must be exactly 10 digits",
                    },
                  ]}
                >
                  <Input
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="10 digit mobile number"
                    className="!rounded-lg"
                    size="large"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="!mb-6">
              <Divider orientation="left" className="!border-gray-300">
                <span className="!text-base !font-semibold !text-gray-700 !flex !items-center !gap-2">
                  <PhoneOutlined style={{ transform: "scaleX(-1)" }} />
                  Contact Information
                </span>
              </Divider>
              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      WhatsApp Number
                    </span>
                  }
                  name="user_whatsapp"
                  rules={[
                    {
                      pattern: /^\d{10}$/,
                      message: "Must be exactly 10 digits",
                    },
                  ]}
                >
                  <Input
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="WhatsApp number"
                    className="!rounded-lg"
                    size="large"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Email Address<span className="text-red-500">*</span>
                    </span>
                  }
                  name="user_email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    maxLength={50}
                    placeholder="email@example.com"
                    className="!rounded-lg"
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Spouse Information Section */}
            <div className="!mb-6">
              <Divider orientation="left" className="!border-gray-300">
                <span className="!text-base !font-semibold !text-gray-700 !flex !items-center !gap-2">
                  <TeamOutlined /> Spouse Information (Optional)
                </span>
              </Divider>
              <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Spouse Name
                    </span>
                  }
                  name="user_spouse_name"
                >
                  <Input
                    maxLength={50}
                    placeholder="Enter spouse name"
                    className="!rounded-lg"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Spouse Mobile
                    </span>
                  }
                  name="user_spouse_mobile"
                  rules={[
                    {
                      pattern: /^\d{10}$/,
                      message: "Must be exactly 10 digits",
                    },
                  ]}
                >
                  <Input
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="10 digit mobile number"
                    className="!rounded-lg"
                    size="large"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Spouse DOB
                    </span>
                  }
                  name="user_spouse_dob"
                >
                  <DatePicker
                    className="!w-full !rounded-lg"
                    format="DD-MM-YYYY"
                    placeholder="Select date"
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Membership Details Section */}
            <div className="!mb-6">
              <Divider orientation="left" className="!border-gray-300">
                <span className="!text-base !font-semibold !text-gray-700 !flex !items-center !gap-2">
                  <UserOutlined /> Membership Details
                </span>
              </Divider>
              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4">
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Membership Type<span className="text-red-500">*</span>
                    </span>
                  }
                  name="user_type"
                  rules={[
                    {
                      required: true,
                      message: "Please select membership type",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select membership type"
                    className="!rounded-lg"
                    size="large"
                  >
                    {membershipTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      User Category<span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[{ required: true, message: "Category is required" }]}
                  name="user_cat"
                >
                  <Input
                    placeholder="Enter category"
                    className="!rounded-lg"
                    size="large"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Images Section */}
            <div className="!mb-6">
              <Divider orientation="left" className="!border-gray-300">
                <span className="!text-base !font-semibold !text-gray-700 !flex !items-center !gap-2">
                  <UploadOutlined /> Profile Images
                </span>
              </Divider>
              <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                <Form.Item
                  name="user_image"
                  label={
                    <span className="!font-medium !text-gray-700">
                      Member Image <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: "Profile Image is required" },
                  ]}
                >
                  <div className="!flex !items-center !gap-4 !p-4 !border-2 !border-dashed !border-gray-300 !rounded-xl !bg-gray-50 hover:!border-blue-400 !transition-colors">
                    <AvatarCell imageSrc={userImageInfo.preview} />{" "}
                    <Upload
                      showUploadList={false}
                      accept="image/*"
                      beforeUpload={(file) => {
                        openCropper(file, "user");
                        return false;
                      }}
                      className="w-full"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        className="w-full"
                        style={{ display: "block", width: "100%" }}
                      >
                        Upload Image
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
                <Form.Item
                  name="spouse_image"
                  label={
                    <span className="!font-medium !text-gray-700">
                      Spouse Image
                    </span>
                  }
                >
                  <div className="!flex !items-center !gap-4 !p-4 !border-2 !border-dashed !border-gray-300 !rounded-xl !bg-gray-50 hover:!border-blue-400 !transition-colors">
                    <AvatarCell imageSrc={spouseImageInfo.preview} />{" "}
                    <Upload
                      showUploadList={false}
                      accept="image/*"
                      beforeUpload={(file) => {
                        openCropper(file, "spouse");
                        return false;
                      }}
                    >
                      <Button icon={<UploadOutlined />} className="w-full">
                        Upload Image
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
              </div>
            </div>

            {/* Address Section */}
            <div className="!mb-6">
              <Divider orientation="left" className="!border-gray-300">
                <span className="!text-base !font-semibold !text-gray-700 !flex !items-center !gap-2">
                  <HomeOutlined /> Address Information
                </span>
              </Divider>
              <Form.Item
                label={
                  <span className="!font-medium !text-gray-700">
                    Complete Address<span className="text-red-500">*</span>
                  </span>
                }
                name="user_add"
                rules={[{ required: true, message: "Address is required" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter complete address with pincode"
                  className="!rounded-lg"
                />
              </Form.Item>
            </div>

            {/* Submit Button */}
            <Form.Item className="!text-center !mt-8 !mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="!px-12 !h-12 !rounded-lg !font-semibold !text-base"
              >
                Register Member
              </Button>
            </Form.Item>
            <CropImageModal
              open={cropState.modalVisible}
              imageSrc={cropState.imageSrc}
              onCancel={() =>
                setCropState((prev) => ({ ...prev, modalVisible: false }))
              }
              onCropComplete={handleCroppedImage}
              maxCropSize={{ width: 400, height: 400 }}
              title="Crop Member Image"
              cropstucture={true}
            />
          </Card>
        </div>
      </div>
    </Form>
  );
};

export default NewRegisterationOut;
