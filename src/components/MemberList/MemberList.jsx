import { App, Card, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MEMBER_DATA } from "../../api";
import usetoken from "../../api/usetoken";
import { useApiMutation } from "../../hooks/useApiMutation";
import MemberTable from "./MemberTable";

const { Search } = Input;

const MemberList = ({ title, userTypeFilter }) => {
  const token = usetoken();
  const { message } = App.useApp();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const handleToggleStatus = async (user) => {
    console.log(user, "user");
    try {
      const newStatus =
        user.user_status == "active" || user.user_status == true
          ? "false"
          : "true";
      console.log(newStatus);
      const res = await trigger({
        url: `${MEMBER_DATA}/${user.id}/status`,
        method: "patch",
        data: { user_status: newStatus },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res?.code === 200 || res?.code === 201) {
        const updatedUsers = users.map((u) =>
          u.id === user.id ? { ...u, user_status: newStatus } : u
        );
        setUsers(updatedUsers);
        message.success(
          `User marked as ${newStatus == "active" ? "Active" : "Inactive"}`
        );
      } else {
        message.error("Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(error.message || "Error updating user status.");
    }
  };
  const fetchUser = async () => {
    const res = await trigger({
      url: MEMBER_DATA,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      const filtered = res.data.filter(
        (user) => user.user_type == userTypeFilter
      );
      setUsers(filtered);

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
  }, [userTypeFilter]);

  const handleEdit = (user) => {
    navigate(`/members/edit/${user.id}`);
  };

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
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-500">{title}</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search member"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="min-h-[27rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <MemberTable
            imageUrls={imageUrls}
            users={filteredUsers}
            onEdit={handleEdit}
            handleToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
    </Card>
  );
};

export default MemberList;
