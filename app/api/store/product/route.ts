import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import authSeller from "../../../../middleware/authSeller";
import imageKit from "../../../../configs/imageKit";
import { prisma } from "../../../../src-db/db";

// add a new product
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    //      Get the data from the form
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const images = formData.getAll("images");

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof mrp !== "number" ||
      typeof price !== "number" ||
      typeof category !== "string"
    ) {
      return NextResponse.json({ error: "Invalid  formet" }, { status: 400 });
    }

    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      !category ||
      images.length < 1
    ) {
      return NextResponse.json(
        { error: "missing product detail" },
        { status: 400 },
      );
    }

    const files = images.filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `${file.name} is larger than 5MB` },
          { status: 400 },
        );
      }
    }

    const ImagesUrl = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");

        const res = await imageKit.files.upload({
          file: base64,
          fileName: file.name,
          folder: "products",
        });

        const url = imageKit.helper.buildSrc({
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
          src: res.filePath!,
          transformation: [
            {
              width: 512, 
              quality: 100,
              format: "webp",
            },
          ],
        });

        return url;
      }),
    );

    await prisma.product.create({
      data:{
        name,
        description,
        mrp,
        price,
        category,
        images: ImagesUrl,
        storeId
      }
    })

    return NextResponse.json({message:"Product Added successfully"})
  } catch (error) {
    console.error(error);
    return NextResponse.json({error:error.code || error.message} , {status:400})
  }
}



// Get all products for a seller
export async function GET(request){
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({where:{storeId}})

    return NextResponse.json({products})
  } catch (error) {
     console.error(error);
    return NextResponse.json({error:error.code || error.message} , {status:400})
  }
}