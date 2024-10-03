"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from 'react-hot-toast'

interface SummaryProps {
  summary: string | null;
  importantPoints: string[] | null;
  success: boolean;
  message: string;
}

export function Summary({ summary, importantPoints, success, message }: SummaryProps) {
  useEffect(() => {
    if (message) {
      if (success) {
        toast.success('summary generated successfully')
      } else {
        toast.error('Error generating summary')
      }
    }
  }, [success, message])

  if (!summary && !importantPoints) return null;

  return (
    <div className="mt-8 space-y-4">
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{summary}</p>
          </CardContent>
        </Card>
      )}
      {importantPoints && importantPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Important Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {importantPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}