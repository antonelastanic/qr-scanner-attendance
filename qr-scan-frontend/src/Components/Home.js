import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Home.css";

const Home = () => {
  const [scannedData, setScannedData] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

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
        (decodedText) => {
          if (!sessionActive) {
            alert("Professor code scanned. Students can now check in.");
            setSessionActive(true);
          } else {
            setScannedData(decodedText);
            alert(`Student ${decodedText} scanned.`);
          }
        },
        (errorMessage) => {
          console.error(errorMessage);
        }
      );

      setScanner(newScanner);
    }
  };

  return (
    <div className="container">
      {/* Top Bar */}
      <div className="top-bar">Attendance Checker</div>
      
      {/* QR Scanner */}
      <div className="scanner-container">
        <h2 className="scanner-title">Scan QR Code</h2>
        <button className="scanner-toggle" onClick={toggleScanner}>
          {scanner ? "Stop Scanning" : "Start Scanning"}
        </button>
        <div id="qr-reader" className="qr-reader"></div>
      </div>
    </div>
  );
};

export default Home;
