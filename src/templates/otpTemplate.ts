export const otpTemplate = (otp: string) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

      <h2 style="color:#2563eb; text-align:center;">DevSync</h2>

      <h3 style="text-align:center;">Verify Your Email</h3>

      <p style="color:#555; font-size:16px;">
        Welcome to <b>DevSync</b>! Please use the OTP below to verify your email address.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <span style="
          font-size:28px;
          letter-spacing:6px;
          background:#2563eb;
          color:white;
          padding:12px 24px;
          border-radius:8px;
          font-weight:bold;
        ">
          ${otp}
        </span>
      </div>

      <p style="color:#555; font-size:14px;">
        This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.
      </p>

      <p style="color:#555; font-size:14px;">
        If you did not request this email, please ignore it.
      </p>

      <hr style="margin:30px 0;"/>

      <p style="text-align:center; font-size:12px; color:#999;">
        © ${new Date().getFullYear()} DevSync. All rights reserved.
      </p>

    </div>
  </div>
  `
}