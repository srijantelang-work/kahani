import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export const Profile = () => {
  const { user } = useAuth()
  const { profile, isLoading } = useProfile()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>

        {/* Profile Card */}
        <div className="mt-8 overflow-hidden rounded-lg border border-red-800 bg-gray-900/50 shadow-xl">
          {/* Header Section */}
          <div className="px-6 py-8">
            <div className="flex items-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Profile'}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600/10">
                  <UserCircleIcon className="h-12 w-12 text-red-500" />
                </div>
              )}
              <div className="ml-6">
                <h2 className="text-2xl font-semibold text-white">
                  {user?.displayName || 'User'}
                </h2>
                <p className="mt-1 text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="border-t border-red-800/30 bg-black/30">
            <dl className="divide-y divide-red-800/30">
              <div className="px-6 py-4">
                <dt className="text-sm font-medium text-gray-400">User ID</dt>
                <dd className="mt-1 text-sm text-gray-300">{user?.id}</dd>
              </div>

              <div className="px-6 py-4">
                <dt className="text-sm font-medium text-gray-400">
                  Account Created
                </dt>
                <dd className="mt-1 text-sm text-gray-300">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </dd>
              </div>

              <div className="px-6 py-4">
                <dt className="text-sm font-medium text-gray-400">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-300">
                  {profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="border-t border-red-800/30 bg-black/30 px-6 py-4">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => (window.location.href = '/settings')}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
