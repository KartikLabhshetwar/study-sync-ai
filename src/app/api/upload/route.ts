import { NextResponse } from "next/server";

// In-memory storage for file contents
const fileStorage: { [fileName: string]: Buffer } = {};

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Store the file content in memory
  fileStorage[file.name] = buffer;

  return NextResponse.json({ success: true, message: "File uploaded successfully", fileName: file.name });
}

// Export the fileStorage for use in other routes
export { fileStorage };