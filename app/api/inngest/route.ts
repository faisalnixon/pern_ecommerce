import { serve } from "inngest/next";
import {
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
} from "../../../src-db/inngest/functions";
import { inngest } from "../../../src-db/inngest/client";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdation, syncUserDeletion],
});
