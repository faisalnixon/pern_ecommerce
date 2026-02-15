import { inngest } from "./client";
import { prisma } from "../db";

// Inngest Function to save user data to database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "clerk/user.created" },
  async ({ event, step }) => {
    const { data } = event;
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

// Inngest Function to update user data to database
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event, step }) => {
    const { data } = event;
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

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    const { data } = event;
    await prisma.user.delete({
      where: { id: data.id },
    });
  },
);

// Ingest Function to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry" },
  { event: "app/coupon.expired" },
  async ({ event, step }) => {
    const { data } = event;
    const expiredDate = new Date(data.expires_at);
    await step.sleepUntil("wait-for-expiry", expiredDate);

    await step.run("delete-coupon-from-database", async () => {
      await prisma.coupon.delete({
        where: { code: data.code },
      });
    });
  },
);

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "1s");
//     return { message: `Hello ${event.data.email}!` };
//   },
// );
