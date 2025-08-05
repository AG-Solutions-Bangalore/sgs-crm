import { UserOutlined } from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import { useState, useMemo } from "react";

const AvatarCell = ({ imageSrc }) => {
  const [loading, setLoading] = useState(true);

  const avatarUrl = useMemo(() => {
    if (!imageSrc) return null;
    const isRemote = imageSrc.startsWith("http");
    return isRemote
      ? `${imageSrc}?rnd=${Math.floor(Math.random() * 1000000)}`
      : imageSrc;
  }, [imageSrc]);

  return (
    <div
      className="flex justify-center items-center"
      style={{ width: 40, height: 40 }}
    >
      {loading && <Spin size="small" />}
      <Avatar
        size={38}
        src={avatarUrl}
        icon={<UserOutlined />}
        style={loading ? { display: "none" } : {}}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};

export default AvatarCell;
