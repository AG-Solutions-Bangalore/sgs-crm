import { UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Space,
  Switch,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MEMBER_DATA } from "../../api";
import usetoken from "../../api/usetoken";
import AvatarCell from "../../components/common/AvatarCell";
import CropImageModal from "../../components/common/CropImageModal";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useParams } from "react-router-dom";
import { Select } from "antd";
const MemberForm = () => {
  const { memberId } = useParams();
  const { message } = App.useApp();
  const token = usetoken();
  const [form] = Form.useForm();
  const [initialData, setInitialData] = useState({});
  const { trigger: fetchTrigger } = useApiMutation();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

  const [imageInfo, setImageInfo] = useState({ file: null, preview: "" });
  const [cropState, setCropState] = useState({
    modalVisible: false,
    imageSrc: null,
    tempFileName: "",
  });

  const isEditMode = Boolean(memberId);

  const fetchMember = async () => {
    try {
      const res = await fetchTrigger({
        url: `${MEMBER_DATA}/${memberId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res?.data) return;
      const member = res.data;
      setInitialData(member);

      const imageBase = res.image_url?.find(
        (img) => img.image_for == "User"
      )?.image_url;
      if (member.user_image && imageBase) {
        setImageInfo({
          file: null,
          preview: `${imageBase}${member.user_image}`,
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
      message.error("Failed to load member.");
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchMember();
    } else {
      form.resetFields();
      setImageInfo({ file: null, preview: "" });
    }
  }, [memberId]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("user_full_name", values.user_full_name || "");
      formData.append(
        "user_dob",
        values.user_dob ? values.user_dob.format("YYYY-MM-DD") : ""
      );
      formData.append("user_mobile", values.user_mobile || "");
      formData.append("user_whatsapp", values.user_whatsapp || "");
      formData.append("user_email", values.user_email || "");
      formData.append("user_add", values.user_add || "");
      formData.append("user_spouse_name", values.user_spouse_name || "");
      formData.append("user_spouse_mobile", values.user_spouse_mobile || "");
      formData.append(
        "user_spouse_dob",
        values.user_spouse_dob
          ? values.user_spouse_dob.format("YYYY-MM-DD")
          : ""
      );
      formData.append("user_type", values.user_type || "");
      formData.append("user_cat", values.user_cat || "");
      formData.append("user_status", values.user_status || "");
      formData.append("spouse_image", values.spouse_image || "");
      formData.append("is_active", values.is_active ? "true" : "false");

      if (imageInfo.file) {
        formData.append("user_image", imageInfo.file);
      } else {
        formData.append("user_image", "");
      }

      const res = await submitTrigger({
        url: isEditMode
          ? `${MEMBER_DATA}/${memberId}?_method=PUT`
          : MEMBER_DATA,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.code == 201) {
        message.success(res.message || "Member saved!");
        onFinishForm?.();
        fetchMembers?.();
      } else {
        message.error(res.message || "Failed to save member.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      message.error("Something went wrong.");
    }
  };

  const openCropper = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({
        modalVisible: true,
        imageSrc: reader.result,
        tempFileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = ({ blob, fileUrl }) => {
    setImageInfo({ file: blob, preview: fileUrl });
    setCropState({ modalVisible: false, imageSrc: null, tempFileName: "" });
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {isEditMode ? "Update Member" : "Create Member"}
      </h2>
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
        <Space className="mb-4 w-full justify-between" direction="horizontal">
          <>
            <div className="flex flex-col items-center gap-2">
              <AvatarCell imageSrc={imageInfo.preview} />

              <input
                id="member-image-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) openCropper(file);
                }}
              />

              <Button
                icon={<UploadOutlined />}
                onClick={() => {
                  document.getElementById("member-image-upload")?.click();
                }}
              >
                Upload Image
              </Button>
            </div>

            <Form.Item
              label="Active"
              name="user_status"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        </Space>

        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label="Full Name"
            name="user_full_name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Date of Birth" name="user_dob">
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item
            label="Mobile Number"
            name="user_mobile"
            rules={[
              { required: true, message: "Please enter mobile number" },
              {
                pattern: /^\d{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            ]}
          >
            <Input
              maxLength={10}
              inputMode="numeric"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item
            label="Whatsapp Mobile"
            name="user_whatsapp"
            rules={[
              {
                pattern: /^\d{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            ]}
          >
            <Input
              maxLength={10}
              inputMode="numeric"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item label="Email" name="user_email">
            <Input />
          </Form.Item>

          <Form.Item label="Spouse Name" name="user_spouse_name">
            <Input />
          </Form.Item>
          <Form.Item
            label="Spouse Mobile"
            name="user_spouse_mobile"
            rules={[
              {
                pattern: /^\d{10}$/,
                message: "Mobile number must be exactly 10 digits",
              },
            ]}
          >
            <Input
              maxLength={10}
              inputMode="numeric"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item label="Spouse DOB" name="user_spouse_dob">
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item label="User Type" name="user_type">
            <Input />
          </Form.Item>
          <Form.Item label="User Category" name="user_cat">
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="user_add" className="col-span-2">
            <Input.TextArea rows={4} />
          </Form.Item>
        </div>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            Update
          </Button>
        </Form.Item>
      </Form>

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
  );
};

export default MemberForm;
