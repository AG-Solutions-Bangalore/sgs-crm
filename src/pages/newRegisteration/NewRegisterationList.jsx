import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CONVERT_NEW_REGISTRATION_TO_MEMEBER,
  GET_MEMBER_BY_ID,
  REGESTRATION_DATA,
} from "../../api";
import AvatarCell from "../../components/common/AvatarCell";
import SGSTable from "../../components/STTable/STTable";
import { useApiMutation } from "../../hooks/useApiMutation";
import { useSelector } from "react-redux";
import MemberDetails from "../../components/common/MemberDetails";

const { Search } = Input;

const highlightMatch = (text, match) => {
  if (!match || !text) return text;
  const regex = new RegExp(`(${match})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === match.toLowerCase() ? (
      <mark
        key={index}
        style={{
          backgroundColor: "#3B82F6",
          color: "#fff",
          padding: "0 2px",
          borderRadius: "4px",
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const NewRegisterationList = () => {
  const userType = useSelector((state) => state.auth?.user?.user_type);
  const { message } = App.useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const { trigger: fetchTrigger } = useApiMutation();
  const [viewMode, setViewMode] = useState("table");
  const [selectedMember, setSelectedMember] = useState(null);
  const navigate = useNavigate();
  const memberImageSrc = selectedMember?.user_image
    ? `${imageUrls.userImageBase}${selectedMember.user_image}`
    : imageUrls.noImage;
  const fetchUser = async () => {
    const res = await trigger({
      url: REGESTRATION_DATA,
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for == "User"
      );
      const noImageObj = res.image_url?.find(
        (img) => img.image_for == "No Image"
      );
      console.log(userImageObj, "userImageObj");
      setImageUrls({
        userImageBase: userImageObj?.image_url || "",
        noImage: noImageObj?.image_url || "",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = (user) => {
    navigate(`/new-registration-form/${user.id}`);
  };
  const handleViewMember = async (id) => {
    try {
      const res = await fetchTrigger({
        url: `${REGESTRATION_DATA}/${id}`,
      });
      if (!res?.data) return;
      setSelectedMember(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch member details.");
    }
  };
  const handleToggleStatus = async (user) => {
    try {
      const newStatus =
        user.user_status == "active" || user.user_status == true
          ? "inactive"
          : "active";
      const res = await trigger({
        url: `${REGESTRATION_DATA}s/${user.id}/status`,
        method: "patch",
        data: { user_status: newStatus },
      });

      if (res?.code === 201) {
        message.success(
          res.message ||
            `User marked as ${newStatus == "active" ? "Active" : "Inactive"}`
        );
        fetchUser();
      } else {
        message.error(res.message || "Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error.message || "Error updating user status.");
    }
  };
  const handleDelete = async (user) => {
    try {
      const res = await trigger({
        url: `${REGESTRATION_DATA}/${user.id}`,
        method: "delete",
      });

      if (res?.code === 201) {
        message.success(res.message || "Deleted user successfully.");
        fetchUser();
      } else {
        message.error(res.message || "Failed to deleted user status.");
      }
    } catch (error) {
      message.error(error.message || "Error deleted user status.");
    }
  };
  const handleConvert = async (user) => {
    try {
      const res = await trigger({
        url: CONVERT_NEW_REGISTRATION_TO_MEMEBER,
        method: "post",
        data: { member_id: user.id },
      });

      if (res?.code === 201) {
        message.success(res.message || "Convert user successfully.");
      } else {
        message.error(res.message || "Failed to convert.");
      }
    } catch (error) {
      message.error(error.message || "Error converting ");
    }
  };
  const columns = [
    {
      title: "",
      key: "member_images",
      width: 180,
      render: (_, user) => (
        <div className="flex justify-center gap-2">
          <AvatarCell
            imageSrc={
              user.user_image
                ? `${imageUrls.userImageBase}${
                    user.user_image
                  }?v=${Math.random()}`
                : imageUrls.noImage
            }
          />
          {user.user_type == "Couple Membership" && (
            <AvatarCell
              size={38}
              imageSrc={
                user.spouse_image
                  ? `${imageUrls.userImageBase}${
                      user.spouse_image
                    }?v=${Math.random()}`
                  : imageUrls.noImage
              }
            />
          )}
        </div>
      ),
    },
    {
      title: "MID",
      dataIndex: "user_mid",
      key: "user_mid",
      render: (_, user) => highlightMatch(user.user_mid, user._match),
    },
    {
      title: "Full Name",
      dataIndex: "user_full_name",
      key: "user_full_name",
      render: (_, user) => highlightMatch(user.user_full_name, user._match),
    },

    {
      title: "DOB",
      dataIndex: "user_dob",
      key: "user_dob",
      render: (_, user) =>
        highlightMatch(dayjs(user.user_dob).format("DD-MM-YYYY"), user._match),
    },
    {
      title: "Mobile",
      dataIndex: "user_mobile",
      key: "user_mobile",
      render: (_, user) => (
        <a href={`tel:${user.user_mobile}`} className="heading">
          {highlightMatch(user.user_mobile, user._match)}
        </a>
      ),
    },
    {
      title: "Spouse Name",
      dataIndex: "user_spouse_name",
      key: "user_spouse_name",
      render: (_, user) => highlightMatch(user.user_spouse_name, user._match),
    },
    {
      title: "Member Type",
      dataIndex: "user_type",
      key: "user_type",
      render: (_, user) => highlightMatch(user.user_type, user._match),
    },
    {
      title: "Status",
      dataIndex: "user_status",
      key: "user_status",
      render: (_, user) => {
        const isActive = user.user_status == "active";
        return (
          <Popconfirm
            title={`Mark New Registeration as ${
              isActive ? "Inactive" : "Active"
            }?`}
            onConfirm={() => handleToggleStatus(user)}
            okText="Yes"
            cancelText="No"
          >
            <Tag
              color={isActive ? "green" : "red"}
              icon={isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              className="cursor-pointer"
            >
              {isActive ? "Active" : "Inactive"}
            </Tag>
          </Popconfirm>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <Space>
          <Tooltip title="Edit New Registration ">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(user)}
            />
          </Tooltip>
          {(userType == "3" || userType == "4") && (
            <Tooltip title="Delete New Registration ">
              <Popconfirm
                title="Are you sure you want to delete this user?"
                onConfirm={() => handleDelete(user)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  type="primary"
                  danger
                />
              </Popconfirm>
            </Tooltip>
          )}
          <Tooltip title="Convert">
            <Popconfirm
              title="Are you sure you need to convert?"
              onConfirm={() => handleConvert(user)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<UserSwitchOutlined />}
                size="small"
                type="primary"
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="View">
            <Button
              size="small"
              icon={<AppstoreOutlined />}
              onClick={() => {
                setViewMode("grid");
                handleViewMember(user?.id);
              }}
            />
          </Tooltip>
        </Space>
      ),
      width: 130,
    },
  ];

  const filteredUsers = users

    .map((user) => {
      const flatString = Object.values(user)
        .filter((v) => typeof v === "string" || typeof v === "number")
        .join(" ")
        .toLowerCase();

      const matched = flatString.includes(searchTerm.toLowerCase());
      return matched ? { ...user, _match: searchTerm } : null;
    })
    .filter(Boolean);

  return (
    <Card
      title={
        <h2 className="text-2xl font-bold text-gray-800">
          New Registration List
        </h2>
      }
      extra={
        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
        </div>
      }
    >
      {viewMode == "grid" ? (
        <div className="grid grid-cols-12 gap-4">
          {/* Left: Table */}
          <div className="col-span-12 md:col-span-8">
            <SGSTable data={filteredUsers} columns={columns} />
          </div>

          {/* Right: Selected Member */}
          <div className="col-span-12 md:col-span-4 space-y-4">
            <MemberDetails
              selectedMember={selectedMember}
              memberImageSrc={memberImageSrc}
              imageUrls={imageUrls}
              onClose={() => {
                setSelectedMember(null);
                setViewMode("table");
              }}
            />
          </div>
        </div>
      ) : (
        <div className="min-h-[26rem]">
          {isMutating ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <SGSTable data={filteredUsers} columns={columns} />
          ) : (
            <div className="text-center text-gray-500 py-20">
              No data found.
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default NewRegisterationList;
