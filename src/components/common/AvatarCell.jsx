import { UserOutlined } from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import { useState } from "react";

const AvatarCell = ({ imageSrc }) => {
    const [loading, setLoading] = useState(true);
  
    return (
      <div
        className="flex justify-center items-center"
        style={{ width: 40, height: 40 }}
      >
        {loading && <Spin size="small" />}
        <Avatar
          size={38}
          src={imageSrc}
          icon={<UserOutlined />}
          style={loading ? { display: "none" } : {}}
          onLoad={() => setLoading(false)}
        />
      </div>
    );
  };
  export default AvatarCell