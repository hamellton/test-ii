
// import { useState } from "react";
// import GradientButton from "@components/Common/CustomButton";
// import { signIn } from "next-auth/react";

// export default function PhoneLoginButton({ callbackUrl }: { callbackUrl: string }) {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [isCodeSent, setIsCodeSent] = useState(false);

//   const handleSendCode = async () => {
//     const response = await fetch("/api/phoneAuth/phone-auth", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ phoneNumber })
//     });
//     if (response.ok) {
//       setIsCodeSent(true);
//     } else {
//       alert("Failed to send verification code");
//     }
//   };

//   const handleVerifyCode = async () => {
//     signIn("phone", { phoneNumber, verificationCode, callbackUrl });
//   };

//   return (
//     <div>
//       {!isCodeSent ? (
//         <div>
//           <input
//             type="text"
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//           />
//           <GradientButton fullWidth variant="contained" onClick={handleSendCode}>
//             Send Verification Code
//           </GradientButton>
//         </div>
//       ) : (
//         <div>
//           <input
//             type="text"
//             placeholder="Verification Code"
//             value={verificationCode}
//             onChange={(e) => setVerificationCode(e.target.value)}
//           />
//           <GradientButton fullWidth variant="contained" onClick={handleVerifyCode}>
//             Verify Code
//           </GradientButton>
//         </div>
//       )}
//     </div>
//   );
// }



import { useState } from "react";
import GradientButton from "@components/Common/CustomButton";
import { signIn } from "next-auth/react";

export default function PhoneLoginButton({ callbackUrl }: { callbackUrl: string }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    const response = await fetch("/api/phoneAuth/phone-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phoneNumber })
    });
    if (response.ok) {
      setIsCodeSent(true);
    } else {
      alert("Failed to send verification code");
    }
  };

  const handleVerifyCode = async () => {
    signIn("phone", { phoneNumber, verificationCode, callbackUrl });
  };

  return (
    <div>
      {!isCodeSent ? (
        <div>
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <GradientButton fullWidth variant="contained" onClick={handleSendCode}>
            Send Verification Code
          </GradientButton>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <GradientButton fullWidth variant="contained" onClick={handleVerifyCode}>
            Verify Code
          </GradientButton>
        </div>
      )}
    </div>
  );
}
