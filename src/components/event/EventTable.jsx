import { EditOutlined } from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import dayjs from "dayjs";
import AvatarCell from "../common/AvatarCell";
import STTable from "../STTable/STTable";

const EventTable = ({ users, onEdit, imageUrls }) => {
  console.log(users, "users");
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
      title: "Avatar",
      dataIndex: "event_image",
      key: "avatar",
      render: (_, user) => {
        const imageSrc = user.event_image
          ? `${imageUrls.userImageBase}${user.event_image}?v=${Math.random()}`
          : imageUrls.noImage;

        return <AvatarCell imageSrc={imageSrc} />;
      },
    },

    {
      title: "Name",
      dataIndex: "event_name",
      key: "event_name",
      render: (_, user) => highlightMatch(user.event_name, user._match),
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

export default EventTable;
