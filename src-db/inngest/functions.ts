import { inngest } from "./client";
import { prisma } from "../db";

// Sync user creation
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-create",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event, step }) => {
    const data = event.data as any;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  },
);

// Sync user update
export const syncUserUpdation = inngest.createFunction(
  {
    id: "sync-user-update",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event, step }) => {
    const data = event.data as any;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  },
);

// Sync user deletion
export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-delete",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event, step }) => {
    const data = event.data as any;

    await prisma.user.delete({
      where: { id: data.id },
    });
  },
);

// Delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
  {
    id: "delete-coupon-on-expiry",
    triggers: [{ event: "app/coupon.expired" }],
  },
  async ({ event, step }) => {
    const data = event.data as any;

    const expiredDate = new Date(data.expires_at);

    await step.sleepUntil("wait-for-expiry", expiredDate);

    await step.run("delete-coupon-from-database", async () => {
      await prisma.coupon.delete({
        where: { code: data.code },
      });
    });
  },
);