import twilio from 'twilio';
import { env } from './env.config.js'; // Import environment variables

const twilioClient = twilio(
  env.TWILIO_ACCOUNT_SID,
  env.TWILIO_AUTH_TOKEN
);

export default twilioClient;