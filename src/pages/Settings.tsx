import { useAuth } from '../hooks/useAuth'
import {
  UserCircleIcon,
  ShieldCheckIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

export const Settings = () => {
  const { user } = useAuth()
  const appVersion = '1.0.0' // You can replace this with your actual app version

  const sections = [
    {
      id: 'profile',
      name: 'Profile Info',
      description: 'Manage your personal information',
      icon: UserCircleIcon,
      items: [
        { name: 'Name', value: user?.displayName || 'Not set' },
        { name: 'Avatar', value: 'Update profile picture' },
      ],
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      description: 'Manage your account security settings',
      icon: ShieldCheckIcon,
      items: [
        { name: 'Password', value: '••••••••' },
        { name: 'Two-factor authentication', value: 'Not enabled' },
      ],
    },
    {
      id: 'accounts',
      name: 'Connected Accounts',
      description: 'Manage your linked accounts and services',
      icon: LinkIcon,
      items: [{ name: 'Google', value: user?.email || 'Not connected' }],
    },
    {
      id: 'about',
      name: 'About & Support',
      description: 'Get help and learn more about Kahani',
      icon: QuestionMarkCircleIcon,
      items: [
        { name: 'App Version', value: appVersion },
        { name: 'Contact Support', value: 'Get help with Kahani' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:px-6 lg:px-0">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="space-y-6">
            {sections.map(section => (
              <div
                key={section.id}
                className="overflow-hidden rounded-lg border border-red-800 bg-black shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <section.icon
                      className="h-6 w-6 text-red-500"
                      aria-hidden="true"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-white">
                        {section.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {section.items.map(item => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >
                        <div className="text-sm font-medium text-gray-300">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Links */}
          <div className="mt-10 flex items-center justify-center space-x-8 border-t border-red-800 pt-8">
            <button
              onClick={() => window.open('/terms-of-service', '_blank')}
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              <DocumentTextIcon className="mr-2 h-5 w-5" />
              Terms of Service
            </button>
            <button
              onClick={() => window.open('/privacy-policy', '_blank')}
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              <DocumentTextIcon className="mr-2 h-5 w-5" />
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
