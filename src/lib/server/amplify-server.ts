import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { cookies } from "next/headers";

import type { Schema } from "../../../amplify/data/resource";
import outputs from "../../../amplify_outputs.json";

const amplifyConfig = outputs as Record<string, unknown>;

export function getAmplifyServerClient() {
  if (Object.keys(amplifyConfig).length === 0) {
    throw new Error(
      "Amplify backend is not configured. Generate amplify_outputs.json by running 'npx ampx sandbox' or deploying your Amplify backend.",
    );
  }

  return generateServerClientUsingCookies<Schema>({
    config: amplifyConfig,
    cookies,
  });
}
