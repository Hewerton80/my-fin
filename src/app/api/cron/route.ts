import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  console.log("---PATCH JOBS---");
  return NextResponse.json({ message: "PATCH" });
}
