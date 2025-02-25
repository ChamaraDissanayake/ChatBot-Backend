import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import clientRoutes from './routes/client.routes.js';
import messageRoutes from './routes/message.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import templateRoutes from './routes/template.routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect root URL to frontend
app.get('/', (req, res) => {
  res.redirect('https://chatbot-frontend-csykea58j-chamara-dissanayakes-projects.vercel.app/clients');
});

// Routes
app.use('/clients', clientRoutes);
app.use('/messages', messageRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/templates', templateRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});