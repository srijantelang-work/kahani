import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  rightContent?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  rightContent,
}) => {
  return (
    <div className="border-b border-gray-800/40 bg-gradient-to-r from-black to-gray-900/30 pb-6">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="liquid-glass-text relative text-3xl font-bold sm:text-4xl md:text-5xl">
              {title}
              <span className="shine-text absolute inset-0"></span>
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                {description}
              </p>
            )}
          </div>
          {rightContent && <div>{rightContent}</div>}
        </div>
      </div>
    </div>
  )
}
