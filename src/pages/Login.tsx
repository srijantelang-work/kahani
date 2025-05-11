import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { LoginIllustrations } from '../components/auth/LoginIllustrations'
import googleLogo from '../assets/auth/google.svg'

export const Login = () => {
  const { signInWithGoogle, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/landing'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black">
      {/* Main card container */}
      <div className="relative flex h-[85vh] w-[90vw] max-w-[1400px] overflow-hidden rounded-3xl bg-[#0a0a0a] shadow-2xl">
        {/* Left side - Illustrations */}
        <div className="hidden w-1/2 bg-gradient-to-br from-[#1a1a1a] to-[#2a1a2a] md:block">
          <LoginIllustrations />
        </div>

        {/* Center - Login form */}
        <div className="flex w-full flex-col items-center justify-center p-12 md:w-1/2">
          <div className="w-full max-w-md space-y-12">
            <div className="text-center">
              <h2 className="text-5xl font-bold tracking-tight text-white">
                WELCOME TO KAHANI
              </h2>
              <p className="mt-6 text-xl text-gray-300">
                Your personal entertainment companion
              </p>
            </div>

            <div className="flex flex-col items-center space-y-8">
              <button
                onClick={signInWithGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-[4px] bg-white px-6 py-3 text-[14px] font-medium text-[#3c4043] shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#4285f4]/50"
              >
                <img
                  src={googleLogo}
                  alt="Google"
                  className="h-[18px] w-[18px]"
                />
                Continue with Google
              </button>

              <p className="text-center text-sm text-gray-400">
                By continuing, you agree to our{' '}
                <a href="#" className="text-green-500 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-500 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
