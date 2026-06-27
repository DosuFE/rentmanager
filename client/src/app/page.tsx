'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LandingPage } from '@/components/landing/landing-page'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { getAuthToken } from '@/lib/auth-session'
import { getMe } from '@/services/auth-service'

export default function Home() {
  const router = useRouter()
  const [showLanding, setShowLanding] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setShowLanding(true)
      return
    }

    getMe()
      .then((me) => {
        router.replace(
          me.role === 'LANDLORD' ? '/dashboard' : '/tenant/dashboard',
        )
      })
      .catch(() => {
        setShowLanding(true)
      })
  }, [router])

  if (!showLanding) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <LandingPage />
}
