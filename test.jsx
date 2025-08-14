// import { Scanner } from "@yudiel/react-qr-scanner";
// import { App, Card, Spin } from "antd";
// import dayjs from "dayjs";
// import { useEffect, useRef, useState } from "react";
// import { EVENT_TRACK } from "../../api";
// import { useApiMutation } from "../../hooks/useApiMutation";

// const EventMidScanner = ({
//   eventId,
//   setOpenQrDialog,
//   scanning,
//   NoofMember,
// }) => {
//   const { message } = App.useApp();
//   console.log(NoofMember, "NoofMember");

//   const [scanResult, setScanResult] = useState("");
//   const timeoutRef = useRef(null);
//   const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, []);
//   const handleScan = async (detectedCodes) => {
//     if (detectedCodes && detectedCodes.length > 0) {
//       const scannedValue = detectedCodes[0].rawValue;
//       setScanResult(scannedValue);

//       if (scannedValue.includes("mid=")) {
//         const midMatch = scannedValue.match(/mid=([^&\s]+)/);
//         const midValue = midMatch ? midMatch[1] : null;

//         if (!midValue) {
//           message.error("MID not found in scanned data.");
//           return;
//         }

//         const payload = {
//           NoofMember if in this one member set the no of people sdeafuly 1 if it is  One Card Multi Member make another dialog show one input number field after enter that show one button submit and then it ineed to submit 
//             { label: "One Card One Member", value: "One Card One Member" },
//   { label: "One Card Multi Member", value: "One Card Multi Member" },
//           event_no_of_people: 1,
//           event_id: eventId || 1,
//           event_member_mid: midValue,
//           event_entry_date: dayjs().format("YYYY-MM-DD"),
//         };

//         try {
//           const res = await submitTrigger({
//             url: EVENT_TRACK,
//             method: "post",
//             data: payload,
//           });

//           if (res.code === 201) {
//             message.success(res.message || "Event saved!");
//             setOpenQrDialog(false);
//             fetchEvents();
//           } else {
//             message.error(res.message || "Failed to save event.");
//           }
//         } catch (error) {
//           message.error(
//             error.response.data.message || "Error submitting event."
//           );
//           console.error(error);
//         }
//       } else {
//         message.error("MID not found in scanned code.");
//       }

//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       timeoutRef.current = setTimeout(() => {
//         setScanResult("");
//       }, 3000);
//     }
//   };

//   const handleError = (err) => {
//     console.error("Scan error:", err);
//     message.error("Error scanning QR code");
//   };

//   return (
//     <>
//       {submitLoading ? (
//         <Card
//           style={{
//             maxWidth: 400,
//             minHeight: 260,
//             margin: "20px auto",
//             textAlign: "center",
//             display: "flex", // ✅ make Card itself flex
//             alignItems: "center", // ✅ vertical center
//             justifyContent: "center", // ✅ horizontal center
//           }}
//         >
//           <Spin />
//         </Card>
//       ) : (
//         <>
//           {scanning && (
//             <Scanner
//               onScan={handleScan}
//               onError={handleError}
//               className="scanner"
//               styles={{
//                 container: { width: "100%", maxWidth: "400px", margin: "auto" },
//                 video: { width: "100%", height: "auto" },
//               }}
//             />
//           )}
//         </>
//       )}
//     </>
//     // <div style={{ position: "relative", maxWidth: 400, margin: "20px auto" }}>
//     //   {scanning && (
//     //     <Scanner
//     //       onScan={handleScan}
//     //       onError={handleError}
//     //       className="scanner"
//     //       styles={{
//     //         container: { width: "100%", maxWidth: "400px", margin: "auto" },
//     //         video: { width: "100%", height: "auto" },
//     //       }}
//     //     />
//     //   )}

//     //   {submitLoading && (
//     //     <div
//     //       style={{
//     //         position: "absolute",
//     //         top: 0,
//     //         left: 0,
//     //         width: "100%",
//     //         height: "100%",
//     //         background: "rgba(255, 255, 255, 0.6)",
//     //         display: "flex",
//     //         alignItems: "center",
//     //         justifyContent: "center",
//     //         zIndex: 2,
//     //       }}
//     //     >
//     //       <Spin size="large" />
//     //     </div>
//     //   )}
//     // </div>
//   );
// };

// export default EventMidScanner;
