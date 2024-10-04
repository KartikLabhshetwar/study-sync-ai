"use client"

import { useState } from "react"
import { FileUpload } from "@/components/FileUpload"
import { Summary } from "@/components/Summary"
import { Toaster } from 'react-hot-toast'

interface SummaryData {
  summary: string;
  importantPoints: string[];
  success: boolean;
  message: string;
}

export default function Home() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)

  const handleSummaryReceived = (data: SummaryData) => {
    setSummaryData(data)
  }

  return (
    <main className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Study Sync AI</h1>
      <FileUpload onSummaryReceived={handleSummaryReceived} />
      {summaryData && (
        <Summary
          summary={summaryData.summary}
          importantPoints={summaryData.importantPoints}
          success={summaryData.success}
          message={summaryData.message}
        />
      )}
    </main>
  )
}