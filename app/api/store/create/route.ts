import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../src-db/db";
import imageKit from "../../../../configs/imageKit";

//create the store
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 },
      );
    }

    // Get the data from the form
    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    // const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof email !== "string" ||
      typeof address !== "string" ||
      typeof username !== "string" ||
      typeof contact !== "string"
    ) {
      return NextResponse.json({ error: "Invalid  formet" }, { status: 400 });
    }
    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "Only Image file is required" },
        { status: 400 },
      );
    }
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 5MB)" },
        { status: 400 },
      );
    }

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "missing store info" },
        { status: 400 },
      );
    }

    // check is user have already registered a store
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // if store is already registered then send status of store
    // if (store) {
    //   return NextResponse.json({ status: store.status });
    // }
    if (store) {
      return NextResponse.json(
        {
          error: `You already have a store registered with ${email}. If you want to create a new store, please login with a different email account.`,
          alreadyExists: true,
          status: store.status,
        },
        { status: 400 },
      );
    }

    // check is username is already taken
    // const usernameEntry = formData.get("username");

    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "username already taken" },
        { status: 400 },
      );
    }

    // check is username is already taken
    // const usernameEntry = formData.get("username");

    const isStoreMadeBySameEmail = await prisma.store.findFirst({
      where: { email: email },
    });

    if (isStoreMadeBySameEmail) {
      return NextResponse.json(
        {
          error: `A store is already registered under ${email}. Please login with a different account to create another store.`,
        },
        { status: 400 },
      );
    }

    // image upload to imagekit
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString("base64");
    const response = await imageKit.files.upload({
      file: base64,
      fileName: image.name,
      folder: "logos",
    });

    const optimizedImage = imageKit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
      src: response.filePath!,
      transformation: [
        {
          width: 512,
          quality: 100,
          format: "webp",
        },
      ],
    });
    // or u can use the bellow code
    // const optimizedImage = `${process.env.IMAGEKIT_URL_ENDPOINT}${response.filePath}?tr=w-512,q-100,f-webp`;

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    });

    // Link store to user
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "Applied , watting for approval" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}

// check is user have already registered a store if yes then send status of store
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    // check is user have already registered a store
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // if store is already registered then send status of store
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: "not registered" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
