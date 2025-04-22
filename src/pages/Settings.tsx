import { useState } from 'react'
import { ProfileForm } from '../components/profile/ProfileForm'
import { PreferencesForm } from '../components/profile/PreferencesForm'

type SettingsTab = 'profile' | 'preferences'

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-1/2 border-b-2 px-1 py-4 text-center text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-1/2 border-b-2 px-1 py-4 text-center text-sm font-medium ${
                  activeTab === 'preferences'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Preferences
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'profile' ? <ProfileForm /> : <PreferencesForm />}
          </div>
        </div>
      </div>
    </div>
  )
}
