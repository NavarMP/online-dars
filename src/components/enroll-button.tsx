"use client"

import { useTransition } from "react"
import { enrollInCourse } from "@/app/actions/enroll"
import Link from "next/link"

export function EnrollButton({ courseId, isFree, isEnrolled }: { courseId: string, isFree: boolean, isEnrolled: boolean }) {
  const [isPending, startTransition] = useTransition()

  if (isEnrolled) {
    return (
      <Link href={`/account`} className="component-button-primary w-full flex items-center justify-center">
        Go to Dashboard
      </Link>
    )
  }

  return (
    <button 
      onClick={() => startTransition(async () => { await enrollInCourse(courseId); })} 
      disabled={isPending}
      className="component-button-primary w-full disabled:opacity-50"
    >
      {isPending ? "Processing..." : isFree ? "Enroll Now" : "Purchase Course"}
    </button>
  )
}
