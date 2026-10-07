import { Api } from "./api/Api";

// the one api object the whole app uses, every page imports it from here
// after changing an endpoint in the backend, run "bun run generate:api" again
// with docker compose the API is on localhost:5000 too, so this works in dev and in Docker
export const api = new Api({ baseUrl: "http://localhost:5000" });
