import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Home.css";

const Home = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [scanner, setScanner] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Load backend URL

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  // Function to send scan data to backend
  const sendScanToBackend = async (userId, subjectCode, isProfessor) => {
    const endpoint = isProfessor ? "/scan/professor" : "/scan/student";
    const requestData = { userId, subjectCode };

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        if (isProfessor) setSessionActive(!sessionActive); // Toggle session state
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  // Handle scanned QR codes
  const handleScan = (decodedText) => {
    const [userId, subjectCode, role] = decodedText.split("-"); // Example QR format: "userID-subjectCode-role"

    if (role === "professor") {
      sendScanToBackend(userId, subjectCode, true);
    } else {
      if (!sessionActive) {
        alert("No active session. Please wait for the professor to start one.");
      } else {
        sendScanToBackend(userId, subjectCode, false);
      }
    }
  };

  // Toggle QR Scanner
  const toggleScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    } else {
      const newScanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: false,
      });

      newScanner.render(
        (decodedText) => handleScan(decodedText),
        (errorMessage) => console.error(errorMessage)
      );

      setScanner(newScanner);
    }
  };

  return (
    <div className="container">
      <div className="top-bar">Attendance Checker</div>
      <div className="scanner-container">
        <h2 className="scanner-title">Scan QR Code</h2>
        <button className="scanner-toggle" onClick={toggleScanner}>
          {scanner ? "Stop Scanning" : "Start Scanning"}
        </button>
        <div id="qr-reader" className="qr-reader"></div>

        {/* University Logo */}
        <img src="/fesb.png" alt="University Logo" className="uni-logo" />
      </div>
    </div>
  );
};

export default Home;
