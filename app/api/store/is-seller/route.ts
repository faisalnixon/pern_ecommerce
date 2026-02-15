import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "../../../../middleware/authSeller";
import { prisma } from "../../../../src-db/db";

// auth seller
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const storeInfo = await prisma.store.findUnique({ where: { userId } });

    return NextResponse.json({ isSeller, storeInfo });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
