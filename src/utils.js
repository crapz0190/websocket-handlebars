import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

export default __dirname;
