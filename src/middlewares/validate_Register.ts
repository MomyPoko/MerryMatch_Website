import { NextRequest, NextResponse } from "next/server";

export async function validateRegister(req: NextRequest) {
  const formData = await req.formData(); // ใช้ formData แทน json

  // ดึงข้อมูลจาก formData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const country = formData.get("country") as string;
  const sexIdent = formData.get("sexIdent") as string;
  const sexPref = formData.get("sexPref") as string;
  const racailPref = formData.get("racailPref") as string;
  const meeting = formData.get("meeting") as string;
  const hobbies = formData.get("hobbies") as string;

  if (
    !email ||
    !password ||
    !username ||
    !name ||
    !dateOfBirth ||
    !country ||
    !sexIdent ||
    !sexPref ||
    !racailPref ||
    !meeting ||
    !hobbies
  ) {
    return NextResponse.json(
      { error: "All fields are required", formData },
      { status: 400 }
    );
  }
  return NextResponse.next();
}
