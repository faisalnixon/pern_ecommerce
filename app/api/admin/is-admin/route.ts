import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import authAdmin from "../../../../middleware/authAdmin";

// Auth Admin
export async function GET(request:NextRequest){
      try {
            const {userId} = getAuth(request)
            const isAdmin = await authAdmin(userId)

            if(!isAdmin){
                  return NextResponse.json({error:"not authorized"},{status:401})
            }

            return NextResponse.json({isAdmin})
      } catch (error) {
            console.error(error);
            return NextResponse.json({error:error.code || error.message} , {status:400})
      }
}