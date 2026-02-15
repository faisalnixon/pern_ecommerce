import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import authAdmin from "../../../../middleware/authAdmin";
import { prisma } from "../../../../src-db/db";

// get all approved stores
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      where: { status: "approved" },
      include: { user: true },
    });

    return NextResponse.json({ stores });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
