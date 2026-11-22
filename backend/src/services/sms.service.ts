
const sendSMS = async (
  mobileNumber: string,
  otp: string
): Promise<void> => {

  if (process.env.NODE_ENV === "development") {
    console.log("--------------------------------");
    console.log("Development SMS");
    console.log("Mobile:", mobileNumber);
    console.log("OTP:", otp);
    console.log("--------------------------------");

    return;
  }

  // Production SMS provider integration goes here.
  throw new Error("SMS provider is not configured");
};

export default sendSMS;
