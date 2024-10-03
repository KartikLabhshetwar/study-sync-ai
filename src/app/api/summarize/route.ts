import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from 'fs/promises';
import { join } from 'path';

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { fileName } = await request.json();
  
  if (!fileName) {
    return NextResponse.json({ success: false, message: "No file name provided" }, { status: 400 });
  }

  try {
    const filePath = join(process.cwd(), 'uploads', fileName);
    const fileContent = await readFile(filePath);

    // Choose a Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Generate content using the file content
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: getMimeType(fileName),
          data: fileContent.toString('base64')
        }
      },
      { text: "Summarize this document and provide important points. Format the output as a JSON object with 'summary' and 'importantPoints' keys." },
    ]);

    const responseText = result.response.text();
    console.log("Raw response:", responseText);

    // Remove backticks and "json" tag if present
    const cleanedResponse = responseText.replace(/^```json\n|\n```$/g, '').trim();

    let response;
    try {
      response = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      // If JSON parsing fails, return the cleaned response text
      return NextResponse.json({ 
        success: true, 
        summary: cleanedResponse,
        importantPoints: []
      });
    }

    if (!response || typeof response !== 'object' || !('summary' in response) || !('importantPoints' in response)) {
      console.error("Invalid response structure:", response);
      return NextResponse.json({ 
        success: true, 
        summary: cleanedResponse,
        importantPoints: []
      });
    }

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error("Error summarizing file:", error);
    return NextResponse.json({ success: false, message: "Error summarizing file" }, { status: 500 });
  }
}

function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}