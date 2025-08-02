import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";
import CropImageModal from "../../components/common/CropImageModal";
import { EVENT_DATA } from "../../api";
import dayjs from "dayjs";
import AvatarCell from "../../components/common/AvatarCell";

const EventForm = ({ open, setOpenDialog, eventId, fetchEvents }) => {
  console.log(eventId);
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

  const isEditMode = Boolean(eventId);

  const fetchEvent = async () => {
    try {
      const res = await fetchTrigger({
        url: `${EVENT_DATA}/${eventId}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res?.data) return;
      const event = res.data;
      setInitialData(event);
      const imageBase = res.image_url?.find(
        (img) => img.image_for == "Event"
      )?.image_url;
      console.log(imageBase, "imageBase");
      if (event.event_image && imageBase) {
        setImageInfo({
          file: null,
          preview: `${imageBase}${event.event_image}`,
        });
      }
      form.setFieldsValue({
        event_name: event.event_name,
        event_description: event.event_description,
        event_from_date: event.event_from_date
          ? dayjs(event.event_from_date)
          : null,
        event_to_date: event.event_to_date ? dayjs(event.event_to_date) : null,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Failed to load event.");
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchEvent();
    } else {
      form.resetFields();
      setImageInfo({ file: null, preview: "" });
    }
  }, [eventId]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("event_name", values.event_name || "");
      formData.append("event_description", values.event_description || "");
      formData.append(
        "event_from_date",
        values.event_from_date?.format("YYYY-MM-DD") || ""
      );
      formData.append(
        "event_to_date",
        values.event_to_date?.format("YYYY-MM-DD") || ""
      );
      if (imageInfo.file) {
        formData.append("event_image", imageInfo.file);
      }

      const res = await submitTrigger({
        url: isEditMode ? `${EVENT_DATA}/${eventId}?_method=PUT` : EVENT_DATA,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.code == 201) {
        message.success(res.message || "Event saved!");
        setOpenDialog(false);
        fetchEvents();
      } else {
        message.error(res.message || "Failed to save event.");
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
  console.log(imageInfo.preview, "imageInfo.preview");
  const handleCroppedImage = ({ blob, fileUrl }) => {
    setImageInfo({ file: blob, preview: fileUrl });
    setCropState({ modalVisible: false, imageSrc: null, tempFileName: "" });
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpenDialog(false)}
      footer={null}
      centered
      maskClosable={false}
      width={700}
    >
      <h2 className="text-2xl font-bold text-blue-600">
        {isEditMode ? "Update Event" : "Create Event"}
      </h2>

      <Card>
        <Form
          form={form}
          initialValues={initialData}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label={
                <span>
                  Event Name <span className="text-red-500">*</span>
                </span>
              }
              name="event_name"
              rules={[{ required: true, message: "Event name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Event Image" className="w-full">
              <div className="flex items-center gap-4">
                <AvatarCell imageSrc={imageInfo.preview} />

                <input
                  id="event-image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    console.log("File selected:", file);
                    if (file) openCropper(file);
                  }}
                />

                <Button
                  icon={<UploadOutlined />}
                  block
                  onClick={() => {
                    document.getElementById("event-image-upload")?.click();
                  }}
                >
                  Upload Event Image
                </Button>
              </div>
            </Form.Item>

            <Form.Item
              label={
                <span>
                  From Date <span className="text-red-500">*</span>
                </span>
              }
              name="event_from_date"
              rules={[{ required: true, message: "From date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  To Date <span className="text-red-500">*</span>
                </span>
              }
              name="event_to_date"
              rules={[{ required: true, message: "To date is required" }]}
            >
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Description <span className="text-red-500">*</span>
                </span>
              }
              name="event_description"
              rules={[{ required: true, message: "Description is required" }]}
              className="col-span-2"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>

          <Form.Item className="text-center mt-6">
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <CropImageModal
        open={cropState.modalVisible}
        imageSrc={cropState.imageSrc}
        onCancel={() =>
          setCropState((prev) => ({ ...prev, modalVisible: false }))
        }
        onCropComplete={handleCroppedImage}
        maxCropSize={{ width: 400, height: 400 }}
        title="Crop Event Image"
        cropstucture={true}
      />
    </Modal>
  );
};

export default EventForm;
