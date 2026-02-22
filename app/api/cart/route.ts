import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../src-db/db";

// Update user cart
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const { cart } = await request.json();

    // Save the cart to the user object
    await prisma.user.update({
      where: { id: userId },
      data: { cart: cart },
    });

    return NextResponse.json({ message: "Cart updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Update user cart
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return NextResponse.json({ cart: user.cart });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
