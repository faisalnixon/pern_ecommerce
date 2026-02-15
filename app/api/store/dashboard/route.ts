import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import authSeller from "../../../../middleware/authSeller";
import { prisma } from "../../../../src-db/db";

// Get Dashboard Data for Seller (total orders, total earnings, total products)
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    //  Get all order data for seller
    const orders = await prisma.order.findMany({ where: { storeId } });

    // Get all products with ratings for seller
    const products = await prisma.product.findMany({ where: { storeId } });

    const ratings = await prisma.rating.findMany({
      where: { productId: { in: products.map((product) => product.id) } },
      include: { user: true, product: true }, //in the ratings data it will provide the user & product dat
    });

    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalEarnings: Math.round(
        orders.reduce((acc, order) => acc + order.total, 0),
      ),
      totalProducts: products.length,
    };

    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 },
    );
  }
}
