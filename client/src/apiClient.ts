import { Api } from "./api/Api";

// the one api object the whole app uses, every page imports it from here
// after changing an endpoint in the backend, run "bun run generate:api" again
// TODO #27 (Gabriela): use the live Fly url in production instead of localhost
export const api = new Api({ baseUrl: "http://localhost:5000" });
