import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../src-db/db";

// Verify coupon
export async function POST(request: NextRequest) {
  try {
    const { userId, has } = getAuth(request); //in these has we can check user enabled paid plan
    const { code } = await request.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase(), expiresAt: { gt: new Date() } },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    if (coupon.forNewUser) {
      const userorders = await prisma.order.findMany({ where: { userId } });
      // checks user has orders before ... if user makes oreder before means user is not new ... if user does not have any order means user is new
      if (userorders.length > 0) {
        return NextResponse.json(
          { error: "Coupon valid for new users only" },
          { status: 400 },
        );
      }
    }

    if (coupon.forMember) {
      const hasPlusPlan = has({ plan: "plus" });
      if (!hasPlusPlan) {
        return NextResponse.json(
          { error: "Coupon valid for members only" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 500 },
    );
  }
}
