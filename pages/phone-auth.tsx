import { useState } from "react";
import axios from "axios";

const PhoneAuthPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSid, setVerificationSid] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/phoneAuth/phone-auth", { phoneNumber });
      const { verificationSid } = response.data;
      setVerificationSid(verificationSid);
    } catch (error) {
      setError((error as any).message);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/phoneAuth/phone-auth", { phoneNumber, verificationCode });
      setSuccess(true);
      console.log("Verification successful!");
    } catch (error) {
      setError((error as any).message);
    }
  };

  return (
    <div>
      <h1>Phone Authentication</h1>
      
      {!verificationSid && (
        <form onSubmit={handlePhoneAuth}>
          <label>Phone Number:</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <button type="submit">Send Verification Code</button>
        </form>
      )}

      {verificationSid && (
        <form onSubmit={handleVerifyCode}>
          <label>Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit">Verify Code</button>
        </form>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Phone number verified successfully!</div>}
    </div>
  );
};

export default PhoneAuthPage;
