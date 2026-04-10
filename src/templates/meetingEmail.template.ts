export const meetingReminderTemplate = (
  title: string,
  meetingLink: string,
  dateTime: string
) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h2>📅 Meeting Reminder</h2>
      </div>

      <!-- Body -->
      <div style="padding: 20px; color: #333;">
        <h3>Hello 👋</h3>
        <p>Your meeting <strong>${title}</strong> will start in <b>5 minutes</b>.</p>
        
        <p><strong>Time:</strong> ${new Date(dateTime).toLocaleString()}</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${meetingLink}" 
             style="background: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Join Meeting
          </a>
        </div>

        <p>If the button doesn't work, use this link:</p>
        <p style="word-break: break-all;">
          <a href="${meetingLink}">${meetingLink}</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        <p>DevSync Team 🚀</p>
      </div>

    </div>
  </div>
  `;
};