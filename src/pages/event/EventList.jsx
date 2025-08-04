import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Input, Spin } from "antd";
import { useEffect, useState } from "react";
import { EVENT_DATA } from "../../api";
import usetoken from "../../api/usetoken";
import EventTable from "../../components/event/EventTable";
import { useApiMutation } from "../../hooks/useApiMutation";
import EventForm from "./EventForm";

const { Search } = Input;
const EvenList = () => {
  const token = usetoken();
  const [openDialog, setOpenDialog] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { trigger, loading: isMutating } = useApiMutation();
  const [users, setUsers] = useState([]);
  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const fetchUser = async () => {
    const res = await trigger({
      url: EVENT_DATA,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(res.data)) {
      setUsers(res.data);
      const userImageObj = res.image_url?.find(
        (img) => img.image_for === "Event"
      );

      const noImageObj = res.image_url?.find(
        (img) => img.image_for === "No Image"
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
    setEventId(user.id);
    setOpenDialog(true);
  };

  const handleAddUser = () => {
    setEventId(null);
    setOpenDialog(true);
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
        <h2 className="text-2xl font-bold text-blue-500">Event List</h2>

        <div className="flex-1 flex gap-4 sm:justify-end">
          <Search
            placeholder="Search event"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            className="max-w-sm"
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Add Event
          </Button>
        </div>
      </div>
      <div className="min-h-[26rem]">
        {isMutating ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <EventTable
            imageUrls={imageUrls}
            users={filteredUsers}
            onEdit={handleEdit}
          />
        ) : (
          <div className="text-center text-gray-500 py-20">No data found.</div>
        )}
      </div>
      <EventForm
        open={openDialog}
        setOpenDialog={setOpenDialog}
        eventId={eventId}
        fetchEvents={fetchUser}
      />
    </Card>
  );
};

export default EvenList;
