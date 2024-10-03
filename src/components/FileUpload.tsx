"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'

interface SummaryData {
  summary: string;
  importantPoints: string[];
  success: boolean;
  message: string;
}

export function FileUpload({ onSummaryReceived }: { onSummaryReceived: (data: SummaryData) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const uploadToastId = toast.loading('Uploading file...')
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json()
        toast.success('File uploaded successfully', { id: uploadToastId })

        const summarizeToastId = toast.loading('Generating summary...')
        const summarizeResponse = await fetch("/api/summarize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: uploadData.fileName }),
        })

        if (summarizeResponse.ok) {
          const summarizeData: SummaryData = await summarizeResponse.json()
          onSummaryReceived(summarizeData)
          toast.success(summarizeData.message, { id: summarizeToastId })
        } else {
          toast.error('Summarization failed. Please try again.', { id: summarizeToastId })
        }
      } else {
        toast.error('File upload failed. Please try again.', { id: uploadToastId })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">Upload PDF, DOCX, or TXT</Label>
        <Input id="file" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
      </div>
      <Button onClick={handleUpload} disabled={!file || isUploading}>
        <Upload className="mr-2 h-4 w-4" /> {isUploading ? "Processing..." : "Upload and Process"}
      </Button>
    </div>
  )
}