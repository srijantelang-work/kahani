import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '../components/layout/PageHeader'

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
    <>
      <PageHeader
        title="Profile"
        description={
          user?.displayName
            ? `Welcome back, ${user.displayName}`
            : 'Manage your account'
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="liquid-glass-card overflow-hidden rounded-lg border border-red-800/30 bg-gray-900/20 shadow-xl backdrop-blur-sm">
          {/* Header Section */}
          <div className="px-6 py-8">
            <div className="flex items-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Profile'}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-red-500/30 ring-offset-2 ring-offset-black/50"
                />
              ) : (
                <div className="glass-effect flex h-20 w-20 items-center justify-center rounded-full bg-red-600/10">
                  <UserCircleIcon className="h-12 w-12 text-red-500" />
                </div>
              )}
              <div className="ml-6">
                <h2 className="liquid-glass-text text-2xl font-semibold">
                  {user?.displayName || 'User'}
                  <span className="shine-text"></span>
                </h2>
                <p className="mt-1 text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="border-t border-red-800/30 bg-black/20 backdrop-blur-sm">
            <dl className="divide-y divide-red-800/20">
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
          <div className="border-t border-red-800/30 bg-black/20 px-6 py-4 backdrop-blur-sm">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => (window.location.href = '/settings')}
                className="liquid-glass-button relative rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-all before:bg-red-600/90 hover:before:bg-red-700/90 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <span className="shine"></span>
                <span className="relative z-10">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
