import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import AvatarCell from "../common/AvatarCell";
import STTable from "../STTable/STTable";

const MemberTable = ({ users, onEdit, imageUrls, handleToggleStatus }) => {
  const highlightMatch = (text, match) => {
    if (!match || !text) return text;
    const regex = new RegExp(`(${match})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <mark
          key={index}
          style={{
            backgroundColor: "#93C5FD",
            color: "#ffffff",
            padding: "0 0.25rem",
            borderRadius: "0.25rem",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "user_image",
      key: "avatar",
      render: (_, user) => {
        const imageSrc = user.user_image
          ? `${imageUrls.userImageBase}${user.user_image}?v=${Math.random()}`
          : imageUrls.noImage;

        return <AvatarCell imageSrc={imageSrc} />;
      },
    },

    {
      title: "Name",
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
      title: "Spouse Name",
      dataIndex: "user_spouse_name",
      key: "user_spouse_name",
      render: (_, user) => highlightMatch(user.user_spouse_name, user._match),
    },
    {
      title: "From Date",
      dataIndex: "event_from_date",
      key: "event_from_date",
      render: (_, user) =>
        highlightMatch(
          dayjs(user.event_from_date).format("DD-MM-YYYY"),
          user._match
        ),
    },
    {
      title: "To Date",
      dataIndex: "event_to_date",
      key: "event_to_date",
      render: (_, user) =>
        highlightMatch(
          dayjs(user.event_to_date).format("DD-MM-YYYY"),
          user._match
        ),
    },
    {
      title: "Status",
      dataIndex: "user_status",
      key: "user_status",
      render: (_, user) => {
        const isActive = user.user_status === "active";

        return (
          <div className="flex justify-center">
            <Popconfirm
              title={`Mark member as ${isActive ? "Inactive" : "Active"}?`}
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
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => {
        return (
          <Space>
            <Tooltip title="Edit User">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(user)}
              />
            </Tooltip>
          </Space>
        );
      },
      width: 130,
    },
  ];

  return <STTable data={users} columns={columns} />;
};

export default MemberTable;
