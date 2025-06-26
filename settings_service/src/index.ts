import app from './app';
import { testDBConnection } from './utils/db'; // Optional: if you want to test DB on start

const PORT = process.env.SETTINGS_SERVICE_PORT || 3001; // Ensure this is different from shop_service

app.listen(PORT, async () => {
  console.log(`Settings Service is running on port ${PORT}`);
  // Optional: Test DB connection on startup
  // await testDBConnection();
});
