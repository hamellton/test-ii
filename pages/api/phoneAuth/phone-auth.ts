import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../twilio.config";

const sendVerificationCode = async (phoneNumber: string) => {
  try {
    const verification = await client.verify.v2.services("VAc4d305ee361b92fca231e0e6422bb80b")
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });
    return { verificationSid: verification.sid };
  } catch (error) {
    throw new Error((error as any).message);
  }
};

const verifyCode = async (phoneNumber: string, verificationCode: string) => {
  try {
    const verificationCheck = await client.verify.v2.services("VAc4d305ee361b92fca231e0e6422bb80b")
      .verificationChecks.create({
        to: phoneNumber,
        code: verificationCode,
      });

    if (verificationCheck.status === "approved") {
      return { message: "Phone number verified successfully!" };
    } else {
      throw new Error("Invalid verification code.");
    }
  } catch (error) {
    throw new Error((error as any).message);
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { phoneNumber, verificationCode } = req.body;

  try {
    if (verificationCode) {
      const result = await verifyCode(phoneNumber, verificationCode);
      return res.status(200).json(result);
    } else {
      const result = await sendVerificationCode(phoneNumber);
      return res.json(result);
    }
  } catch (error) {
    console.log("🚀 ~ handler ~ error:", error)
    return res.status(500).json({ error: (error as { message: string }).message });
  }
};

export default handler;
