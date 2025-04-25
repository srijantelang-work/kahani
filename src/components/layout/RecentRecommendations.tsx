import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useRecommendationStore } from '../../stores/recommendationStore'

export const RecentRecommendations = () => {
  const recentRecommendations = useRecommendationStore(
    state => state.recentRecommendations
  )

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-red-500 hover:text-white">
        <ClockIcon className="mr-1 h-5 w-5" />
        Recent
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md border border-red-800 bg-black py-1 shadow-lg focus:outline-none">
          {recentRecommendations.length > 0 ? (
            recentRecommendations.map(rec => (
              <Menu.Item key={rec.id}>
                {({ active }) => (
                  <Link
                    to={`/dashboard?prompt=${encodeURIComponent(rec.prompt)}`}
                    className={`block px-4 py-2 text-sm ${
                      active ? 'bg-red-900 text-white' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{rec.prompt}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(rec.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                )}
              </Menu.Item>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No recent recommendations
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
