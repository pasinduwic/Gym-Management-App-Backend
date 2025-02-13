import cron from "node-cron";
import axios from "axios";
import Client from "../models/client.js"; // Assuming you have these models defined
import moment from "moment-timezone"; // Import moment-timezone

// Define the function to send SMS to clients with payments due today
const sendPaymentDueSMS = async () => {
  try {
    // Find clients whose payment is due today
    const today = new Date();

    // Set today's time to midnight (00:00:00)
    today.setHours(0, 0, 0, 0);

    // Add one day to today's date
    today.setDate(today.getDate() + 1);

    // Get tomorrow's date in ISO format (with midnight time)
    const tomorrow = today.toISOString();
    console.log(tomorrow);
    const clients = await Client.find({
      nextPaymentDate: tomorrow, // Assuming `nextPaymentDate` field in the Client model
    });
    console.log(clients);
    if (clients.length === 0) {
      console.log("No clients have payments due today.");
      return;
    }

    // Send SMS to each client
    for (const client of clients) {
      let phoneNumber = client.phoneNumber;
      phoneNumber = String(phoneNumber);
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "94" + phoneNumber.slice(1);
      } else {
        phoneNumber = "94" + phoneNumber;
      }

      const smsUrl = `https://app.notify.lk/api/v1/send?
                      user_id=29081000&api_key=5NQPpqHnWGUmjtKjBecH&sender_id=NotifyDEMO&to=${phoneNumber}
                      &message=Reminder!!!%0AYour membership will expire tomorrow. Please make the payment and renew the membership.%0AThank you!`;

      try {
        const smsResponse = await axios.get(smsUrl);
        if (smsResponse.data.status === "success") {
          console.log(`SMS sent to ${client.phoneNumber}`);
        } else {
          console.log(
            `Failed to send SMS to ${client.phoneNumber}:`,
            smsResponse.data
          );
        }
      } catch (smsError) {
        console.error("Error sending SMS:", smsError.message);
      }
    }
  } catch (error) {
    console.error("Error sending due payment SMS:", error);
  }
};

// Schedule the task to run at 9 PM local time in a specific timezone
const timezone = "Asia/Kolkata"; // Change to the desired timezone
const timeString = "21:35"; // 8:30 PM
const today = moment().tz(timezone).format("YYYY-MM-DD"); // Get today's date in the desired timezone

// Combine today's date with the desired time
const dateTimeString = `${today} ${timeString}`;

const localTime = moment.tz(dateTimeString, timezone);

// Convert the local 9 AM time to UTC time
const utcTime = localTime.utc().format("m H * * *");

// Schedule the task to run every day at 9 AM
cron.schedule(utcTime, sendPaymentDueSMS); // The cron expression for 9 AM every day

console.log("Scheduled task to send payment due SMS at 9 AM every day.");
