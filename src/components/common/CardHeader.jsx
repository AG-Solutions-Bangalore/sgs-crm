import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CardHeader = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftOutlined style={{ color: "#175efd", fontSize: 18 }} />
      </div>
      <h2 className="text-xl font-bold text-blue-500">{title}</h2>
    </div>
  );
};

export default CardHeader;
