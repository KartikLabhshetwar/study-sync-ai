import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create the 'uploads' directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'uploads');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
    return NextResponse.json({ success: false, message: "Error creating upload directory" }, { status: 500 });
  }

  // Save the file to the 'uploads' directory
  const path = join(uploadDir, file.name);
  try {
    await writeFile(path, buffer);
  } catch (error) {
    console.error('Error writing file:', error);
    return NextResponse.json({ success: false, message: "Error saving file" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "File uploaded successfully", fileName: file.name });
}