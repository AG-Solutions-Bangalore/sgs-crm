import React from "react";
import { Card, Tag, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AvatarCell from "./AvatarCell"; // your avatar component

const MemberDetails = ({
  selectedMember,
  memberImageSrc,
  imageUrls,
  onClose,
}) => {
  if (!selectedMember) {
    return (
      <div className="text-center text-gray-500 py-10">
        Select a member to view details
      </div>
    );
  }

  return (
    <Card
      size="small"
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">
            {selectedMember.user_type} - {selectedMember.user_mid}
          </span>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </div>
      }
      className="shadow-lg"
    >
      <div className="space-y-4 max-h-[28rem] overflow-y-auto">
        {/* Member Images */}
        <div
          className={`flex ${
            selectedMember.user_type == "Couple Membership"
              ? "justify-center gap-6"
              : "justify-center"
          } pb-4 border-b border-gray-200`}
        >
          <AvatarCell imageSrc={memberImageSrc} size={120} />
          {selectedMember.user_type == "Couple Membership" && (
            <AvatarCell
              imageSrc={
                selectedMember.spouse_image
                  ? `${imageUrls.userImageBase}${selectedMember.spouse_image}`
                  : imageUrls.noImage
              }
              size={120}
            />
          )}
        </div>

        {/* Member Info */}
        <div className="space-y-2.5 text-sm">
          <DetailRow label="Name" value={selectedMember.user_full_name} />
          <DetailRow label="Mobile" value={selectedMember.user_mobile} />
          <DetailRow
            label="DOB"
            value={dayjs(selectedMember.user_dob).format("DD-MM-YYYY")}
          />

          {/* Spouse Info */}
          {selectedMember.user_type == "Couple Membership" && (
            <SectionHeader title="Spouse Details">
              {selectedMember.user_spouse_name && (
                <DetailRow
                  label="Name"
                  value={selectedMember.user_spouse_name}
                />
              )}
              {selectedMember.user_spouse_mobile && (
                <DetailRow
                  label="Mobile"
                  value={selectedMember.user_spouse_mobile}
                />
              )}
              {selectedMember.user_spouse_dob && (
                <DetailRow
                  label="DOB"
                  value={dayjs(selectedMember.user_spouse_dob).format(
                    "DD-MM-YYYY"
                  )}
                />
              )}
            </SectionHeader>
          )}

          {/* Contact Info */}
          {(selectedMember.user_email || selectedMember.user_whatsapp) && (
            <SectionHeader title="Contact Info">
              {selectedMember.user_email && (
                <DetailRow
                  label="Email"
                  value={selectedMember.user_email}
                  valueClass="text-xs break-all max-w-[60%] text-right"
                />
              )}
              {selectedMember.user_whatsapp && (
                <DetailRow
                  label="WhatsApp"
                  value={selectedMember.user_whatsapp}
                />
              )}
            </SectionHeader>
          )}

          {/* Other Info */}
          {(selectedMember.user_add || selectedMember.user_cat) && (
            <SectionHeader title="Other Details">
              {selectedMember.user_add && (
                <DetailRow
                  label="Address"
                  value={selectedMember.user_add}
                  valueClass="text-xs leading-relaxed"
                />
              )}
              {selectedMember.user_cat && (
                <DetailRow
                  label="Category"
                  value={selectedMember.user_cat}
                  valueClass="text-xs leading-relaxed"
                />
              )}
            </SectionHeader>
          )}
        </div>
      </div>
    </Card>
  );
};

// Helper components
const DetailRow = ({ label, value, valueClass, tag }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500 font-medium">{label}</span>
    {tag ? (
      <Tag color={tag} className="m-0 font-semibold">
        {value}
      </Tag>
    ) : (
      <span className={`font-semibold text-gray-900 ${valueClass || ""}`}>
        {value || "-"}
      </span>
    )}
  </div>
);

const SectionHeader = ({ title, children }) => (
  <div className="border-t border-gray-200 pt-3 mt-3">
    <div className="text-center mb-2.5">
      <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
        {title}
      </span>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

export default MemberDetails;
