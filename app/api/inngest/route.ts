import { serve } from "inngest/next";
import { inngest } from "../../../src/inngest/client";
import { syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/src/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion
  ],
});