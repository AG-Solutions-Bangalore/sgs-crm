import { EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Input, Space, Spin, Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEMBER_DATA } from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";
import SGSTable from "../../components/STTable/STTable";
import dayjs from "dayjs";

const { Search } = Input;

const highlightMatch = (text, match) => {
  if (!match || !text) return text;
  const regex = new RegExp(`(${match})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === match.toLowerCase() ? (
      <mark
        key={index}
        className="bg-[#006666] text-white px-1 rounded"
        style={{ backgroundColor: "#006666", color: "white" }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};
const NewRegisterationList = () => {
  const token = usetoken();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const navigate = useNavigate();
  const fetchUser = async () => {
    const res = await trigger({
      url: MEMBER_DATA,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);

      const userImageObj = res.image_url?.find(
        (img) => img.image_for == "User"
      );
      const noImageObj = res.image_url?.find(
        (img) => img.image_for == "No Image"
      );

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
    navigate(`/new-registery-form/${user.id}`);
  };

  const handleAddUser = () => {
    navigate("/new-registery-form");
  };
  const baseColumns = [
    {
      title: "User Image",
      dataIndex: "user_image",
      key: "user_image",
      render: (_, user) => (
        <div className="flex justify-center">
          <Avatar
            size={38}
            src={
              user.user_image
                ? `${imageUrls.userImageBase}${
                    user.user_image
                  }?v=${Math.random()}`
                : imageUrls.noImage
            }
            icon={<UserOutlined />}
          />
        </div>
      ),
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
        <a href={`tel:${user.user_mobile}`}>
          {highlightMatch(user.user_mobile, user._match)}
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "user_status",
      key: "user_status",
      render: (_, user) => {
        const isActive = user.user_status == "Active";
        return (
          <div className="flex justify-center">
            <Tag color={isActive ? "green" : "red"}>{user.user_status}</Tag>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, id) => {
        return (
          <Space>
            <Tooltip title="Edit Guest Order">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEdit(id)}
              />
            </Tooltip>
          </Space>
        );
      },
      width: 130,
    },
  ];
  const hasCoupleMembers = users.some(
    (user) => user.user_type == "Couple Membership"
  );

  const columns = hasCoupleMembers
    ? [
        baseColumns[0], 
        {
          title: "Spouse Image",
          dataIndex: "spouse_image",
          key: "spouse_image",
          render: (_, user) => (
            <div className="flex justify-center">
              <Avatar
                size={38}
                src={
                  user.spouse_image
                    ? `${imageUrls.userImageBase}${
                        user.spouse_image
                      }?v=${Math.random()}`
                    : imageUrls.noImage
                }
                icon={<UserOutlined />}
              />
            </div>
          ),
        },
        ...baseColumns.slice(1),
      ]
    : baseColumns;

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
        <h2 className="text-2xl font-bold text-blue-500">New Regsitery List</h2>
      }
      extra={
        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Add New Regsitery
          </Button>
        </div>
      }
    >
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <SGSTable data={filteredUsers} columns={columns} />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default NewRegisterationList;
