import app from "./app.js";
import { PORT } from "./config/config.js";

app.listen(PORT, () => {
  console.log(`GriviLabs API running on port ${PORT}`);
});
