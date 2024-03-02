import { construct_development_api_response } from "./dev_api_response";

export function appwriteUnavailableResponse() {
  return construct_development_api_response({
    message: "Our backend dependency is currently unavailable.",
    status_code: 503,
  });
}
