import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-xl font-bold">Study Sync AI</span>
        </Link>
      </div>
    </nav>
  )
}