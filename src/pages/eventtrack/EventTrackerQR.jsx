import React from "react";
import { Card, Typography, QRCode, Modal } from "antd";

const { Title, Paragraph } = Typography;

const EventTrackerQR = ({ openQrDialog, setOpenQrDialog }) => {
  const mockData = {
    eventId: "EVT123456",
    eventName: "Annual Tech Conference 2025",
    eventDate: "2025-12-01",
    location: "New Delhi",
  };

  // QR code encodes URL with eventId as query param
  const qrValue = `${window.location.origin}/event-details?eventId=${mockData.eventId}`;

  return (
    <Modal
      open={openQrDialog}
      onCancel={() => setOpenQrDialog(false)}
      footer={null}
      centered
      maskClosable={false}
      width={300}
    >
      <Card style={{ maxWidth: 300, margin: "40px auto", textAlign: "center" }}>
        <Title level={4}>Event Tracker QR Code</Title>
        <QRCode value={qrValue} size={200} />
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          Scan this QR code to get event details
        </Paragraph>
      </Card>
    </Modal>
  );
};

export default EventTrackerQR;
