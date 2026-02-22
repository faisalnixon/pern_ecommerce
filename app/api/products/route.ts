import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../src-db/db";

export async function GET(request: NextRequest) {
  try {
    let products = await prisma.product.findMany({
      where: { inStock: true },
      include: {
        rating: {
          select: {
            createdAt:true,rating:true,review:true,
            user:{select:{name:true,image:true}}
          },
        },
        store:true,
      },
      orderBy:{createdAt:'desc'}
    });

//     remove products with store isActive false
      products = products.filter(product => product.store.isActive)
      return NextResponse.json({products})
  } catch (error) {
      console.error(error);
      return NextResponse.json({error:"An internal server error occured"},{status:500})
  }
}
