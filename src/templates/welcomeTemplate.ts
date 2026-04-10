export const welcomeTemplate = (fullname: string) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

      <h2 style="color:#2563eb; text-align:center;">DevSync</h2>

      <h3 style="text-align:center;">🎉 Welcome to DevSync!</h3>

      <p style="color:#555; font-size:16px;">
        Hi <b>${fullname}</b>,
      </p>

      <p style="color:#555; font-size:16px;">
        Congratulations! Your account has been successfully created on 
        <b>DevSync</b>.
      </p>

      <p style="color:#555; font-size:16px;">
        DevSync helps developer teams collaborate efficiently with
        project management, task tracking, and real-time communication
        in one place.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="#" style="
          background:#2563eb;
          color:white;
          padding:12px 24px;
          border-radius:6px;
          text-decoration:none;
          font-weight:bold;
        ">
          Start Using DevSync
        </a>
      </div>

      <p style="color:#555; font-size:14px;">
        We’re excited to have you onboard. Happy coding! 🚀
      </p>

      <hr style="margin:30px 0;"/>

      <p style="text-align:center; font-size:12px; color:#999;">
        © ${new Date().getFullYear()} DevSync. All rights reserved.
      </p>

    </div>
  </div>
  `
}