import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Image,
  Input,
  Select,
  Upload,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGESTRATION_OUT } from "../../api";
import bgSignin from "../../assets/bg-sigin.png";
import AvatarCell from "../../components/common/AvatarCell";
import CropImageModal from "../../components/common/CropImageModal";
import useFinalUserImage from "../../components/common/Logo";
import membershipTypes from "../../components/json/membershipTypes.json";
import categoryTypes from "../../components/json/samaj.json";
import { useApiMutation } from "../../hooks/useApiMutation";

const NewRegisterationOut = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const selectedUserType = Form.useWatch("user_type", form);
  const isCouple = selectedUserType == "Couple Membership";
  const finalUserImage = useFinalUserImage();

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

      if (userImageInfo.file) {
        formData.append("user_image", userImageInfo.file);
      }

      if (spouseImageInfo.file) {
        formData.append("spouse_image", spouseImageInfo.file);
      }
      const res = await submitTrigger({
        url: REGESTRATION_OUT,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.code == 201) {
        message.success(res.message || "Registration Updated!");
        form.resetFields();

        setUserImageInfo({ preview: null, file: null });
        setSpouseImageInfo({ preview: null, file: null });

        navigate("/thank-you");
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
  const styledata =
    "!rounded-lg !border-orange-300 focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-300";

  return (
    <Form
      form={form}
      // initialValues={initialData}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative bg-pattern">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="!w-full !max-w-6xl">
          <div className="bg-gradient-to-br from-orange-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-orange-100">
            <div className="flex flex-col items-center py-2 gap-2">
              <img src={finalUserImage || ""} alt="Logo" className="h-20" />
              <h2 className="text-2xl font-bold text-gray-800 m-0 text-center">
                New Member Registration
              </h2>
            </div>
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
                  size="large"
                  className={styledata}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span className="!font-medium !text-gray-700">
                    Full Name<span className="text-red-500">*</span>
                  </span>
                }
                name="user_full_name"
                rules={[{ required: true, message: "Please enter full name" }]}
              >
                <Input
                  maxLength={20}
                  placeholder="Enter full name"
                  className={styledata}
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
                  className={`!w-full !rounded-lg ${styledata}`}
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
                  className={styledata}
                  size="large"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                />
              </Form.Item>
            </div>

            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-4">
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
                  className={styledata}
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
                  className={styledata}
                  size="large"
                />
              </Form.Item>
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
                  className="purple-select"
                  size="large"
                  options={membershipTypes}
                  showSearch
                  allowClear
                />
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
                <Select
                  placeholder="Select category"
                  className="purple-select"
                  size="large"
                  options={categoryTypes}
                  showSearch
                  allowClear
                />
              </Form.Item>
            </div>

            {isCouple && (
              <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
                <Form.Item
                  label={
                    <span className="!font-medium !text-gray-700">
                      Spouse Name <span className="text-red-500">*</span>
                    </span>
                  }
                  name="user_spouse_name"
                  rules={
                    isCouple
                      ? [
                          {
                            required: true,
                            message: "Spouse Name is required",
                          },
                        ]
                      : []
                  }
                >
                  <Input
                    maxLength={50}
                    placeholder="Enter spouse name"
                    className={styledata}
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
                    className={styledata}
                    size="large"
                    onKeyPress={(e) =>
                      !/[0-9]/.test(e.key) && e.preventDefault()
                    }
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
                    className={`!w-full !rounded-lg ${styledata}`}
                    format="DD-MM-YYYY"
                    placeholder="Select date"
                    size="large"
                  />
                </Form.Item>
              </div>
            )}

            <div
              className={`!grid !grid-cols-1 ${
                isCouple ? "md:!grid-cols-2" : "md:!grid-cols-1"
              } !gap-6`}
            >
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
                <div className="!flex !items-center !gap-4">
                  {userImageInfo.preview && (
                    <div className="relative w-[70px] h-[70px]">
                      <Image
                        src={userImageInfo.preview}
                        width={70}
                        height={70}
                        style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                        alt="User"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUserImageInfo({ preview: null, file: null });
                          form.setFieldValue("user_image", "");
                        }}
                        className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="!flex-1 !flex !items-center !p-4 !border-2 !border-dashed !border-orange-300 !rounded-xl !transition-colors focus-within:!border-orange-500 focus-within:!ring-2 focus-within:!ring-orange-300">
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
                        className="!w-full !text-white !bg-orange-600 hover:!bg-orange-700 !border-0 !rounded-lg !transition-all"
                        style={{ display: "block", width: "100%" }}
                      >
                        Upload Image
                      </Button>
                    </Upload>
                  </div>
                </div>
              </Form.Item>
              {isCouple && (
                <Form.Item
                  name="spouse_image"
                  label={
                    <span className="!font-medium !text-gray-700">
                      Spouse Image <span className="text-red-500">*</span>
                    </span>
                  }
                  rules={
                    isCouple
                      ? [
                          {
                            required: true,
                            message: "Spouse Image is required",
                          },
                        ]
                      : []
                  }
                >
                  <div className="!flex !items-center !gap-4">
                    {spouseImageInfo.preview && (
                      <div className="relative w-[70px] h-[70px]">
                        <Image
                          src={spouseImageInfo.preview}
                          width={70} // sets the width
                          height={70} // sets the height
                          style={{ objectFit: "cover", borderRadius: "0.5rem" }} // square with slightly rounded corners
                          alt="Spouse"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSpouseImageInfo({ preview: null, file: null });
                            form.setFieldValue("spouse_image", "");
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    <div className="!flex-1 !flex !items-center !p-4 !border-2 !border-dashed !border-orange-300 !rounded-xl !transition-colors focus-within:!border-orange-500 focus-within:!ring-2 focus-within:!ring-orange-300">
                      <Upload
                        showUploadList={false}
                        accept="image/*"
                        beforeUpload={(file) => {
                          openCropper(file, "spouse");
                          return false;
                        }}
                        className="w-full"
                      >
                        <Button
                          icon={<UploadOutlined />}
                          className="!w-full !text-white !bg-orange-600 hover:!bg-orange-700 !border-0 !rounded-lg !transition-all"
                        >
                          Upload Image
                        </Button>
                      </Upload>
                    </div>
                  </div>
                </Form.Item>
              )}
            </div>

            <div>
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
                  className={styledata}
                />
              </Form.Item>
            </div>

            <Form.Item className="!text-center !mt-8 !mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitLoading}
                className="h-12 rounded-xl font-semibold  border-0 hover:shadow-lg transition-all shadow-md"
              >
                Register Member
              </Button>
            </Form.Item>
          </div>
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
        </div>
      </div>
    </Form>
  );
};

export default NewRegisterationOut;
