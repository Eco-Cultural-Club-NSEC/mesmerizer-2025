console.log("server");
import "dotenv/config";

import app from "./src/app.js";

const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
