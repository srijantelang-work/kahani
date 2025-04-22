import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { UserPreferences } from '../../types/database.types'

interface ContentFilters {
  explicit_content?: boolean
  violence?: boolean
}

interface AccessibilitySettings {
  high_contrast?: boolean
  large_text?: boolean
  screen_reader?: boolean
}

export const PreferencesForm = () => {
  const { preferences, updatePreferences, isLoading, error } = useProfile()
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    const updates: Partial<UserPreferences> = {
      language: formData.get('language') as string,
      content_filters: {
        explicit_content: formData.get('explicit_content') !== null,
        violence: formData.get('violence') !== null,
      },
      accessibility_settings: {
        high_contrast: formData.get('high_contrast') !== null,
        large_text: formData.get('large_text') !== null,
        screen_reader: formData.get('screen_reader') !== null,
      },
    }

    try {
      await updatePreferences(updates)
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Failed to update preferences'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error.message}</div>
      </div>
    )
  }

  const contentFilters = (preferences?.content_filters || {}) as ContentFilters
  const accessibilitySettings = (preferences?.accessibility_settings ||
    {}) as AccessibilitySettings

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{formError}</div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Language</h3>
          <div className="mt-4">
            <select
              name="language"
              defaultValue={preferences?.language || 'en'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Content Filters</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="explicit_content"
                id="explicit_content"
                defaultChecked={contentFilters.explicit_content}
                value="true"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="explicit_content"
                className="ml-3 text-sm text-gray-700"
              >
                Filter Explicit Content
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="violence"
                id="violence"
                defaultChecked={contentFilters.violence}
                value="true"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="violence" className="ml-3 text-sm text-gray-700">
                Filter Violence
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Accessibility</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="high_contrast"
                id="high_contrast"
                defaultChecked={accessibilitySettings.high_contrast}
                value="true"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="high_contrast"
                className="ml-3 text-sm text-gray-700"
              >
                High Contrast Mode
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="large_text"
                id="large_text"
                defaultChecked={accessibilitySettings.large_text}
                value="true"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="large_text"
                className="ml-3 text-sm text-gray-700"
              >
                Large Text
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="screen_reader"
                id="screen_reader"
                defaultChecked={accessibilitySettings.screen_reader}
                value="true"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="screen_reader"
                className="ml-3 text-sm text-gray-700"
              >
                Screen Reader Support
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isSaving ? (
            <>
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </button>
      </div>
    </form>
  )
}
