import React, { useState, useRef, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Button, Card, Typography, App } from "antd";
import { EVENT_TRACK } from "../../api";
import { useApiMutation } from "../../hooks/useApiMutation";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

const EventMidScanner = ({ eventId, setOpenQrDialog }) => {
  const { message } = App.useApp();
  console.log(eventId, "eventId");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const timeoutRef = useRef(null);
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleScan = async (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const scannedValue = detectedCodes[0].rawValue;
      setScanResult(scannedValue);

      if (scannedValue.includes("mid=")) {
        const midMatch = scannedValue.match(/mid=([^&\s]+)/);
        const midValue = midMatch ? midMatch[1] : null;

        if (!midValue) {
          message.error("MID not found in scanned data.");
          return;
        }

        const payload = {
          event_no_of_people: 1,
          event_id: eventId || 1,
          event_member_mid: midValue,
          event_entry_date: dayjs().format("YYYY-MM-DD"),
        };

        try {
          const res = await submitTrigger({
            url: EVENT_TRACK,
            method: "post",
            data: payload,
          });

          if (res.code === 201) {
            message.success(res.message || "Event saved!");
            setOpenQrDialog(false);
            fetchEvents();
          } else {
            message.error(res.message || "Failed to save event.");
          }
        } catch (error) {
          message.error(
            error.response.data.message || "Error submitting event."
          );
          console.error(error);
        }

        setScanning(false);
      } else {
        message.error("MID not found in scanned code.");
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setScanResult("");
      }, 3000);
    }
  };

  const handleError = (err) => {
    console.error("Scan error:", err);
    message.error("Error scanning QR code");
  };

  return (
    <Card style={{ maxWidth: 400, margin: "20px auto", textAlign: "center" }}>
      <Title level={4}>Scan MID QR Code</Title>
      {!scanning && (
        <Button type="primary" onClick={() => setScanning(true)}>
          Start Scan
        </Button>
      )}

      {scanning && (
        <>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            className="scanner"
            styles={{
              container: { width: "100%", maxWidth: "400px", margin: "auto" },
              video: { width: "100%", height: "auto" },
            }}
          />
          <Button style={{ marginTop: 10 }} onClick={() => setScanning(false)}>
            Stop Scan
          </Button>
        </>
      )}
      {submitLoading && <h1>loading</h1>}
    </Card>
  );
};

export default EventMidScanner;
