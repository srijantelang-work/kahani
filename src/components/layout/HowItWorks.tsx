import {
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const steps = [
  {
    name: 'Describe What You Like',
    description:
      "Tell us what you're in the mood for using natural language, just like chatting with a friend.",
    icon: ChatBubbleBottomCenterTextIcon,
    delay: 0.2,
  },
  {
    name: 'AI Analyzes Your Preferences',
    description:
      'Our AI understands your tastes and searches through thousands of titles to find perfect matches.',
    icon: CogIcon,
    delay: 0.4,
  },
  {
    name: 'Get Personalized Recommendations',
    description:
      "Receive curated suggestions that match exactly what you're looking for, with details on where to watch.",
    icon: StarIcon,
    delay: 0.6,
  },
]

export const HowItWorks = () => {
  return (
    <div id="how-it-works" className="relative overflow-hidden bg-black py-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-turret text-4xl font-bold uppercase tracking-wider text-red-600"
          >
            HOW IT WORKS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-turret mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl"
          >
            Three Simple Steps
          </motion.p>
        </div>

        <div className="relative mt-20">
          {/* Timeline line */}
          <div className="absolute left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-red-600/0 via-red-600 to-red-600/0 lg:block" />

          <div className="relative space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className="relative"
              >
                {/* Timeline node */}
                <div className="absolute left-1/2 top-8 z-10 -ml-4 lg:ml-0 lg:-translate-x-1/2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-600 bg-black text-sm font-bold text-white">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'
                  }`}
                >
                  <div
                    className={`group relative w-full rounded-2xl bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 lg:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? 'lg:mr-auto' : 'lg:ml-auto'
                    }`}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-red-600/50 to-red-900/50 opacity-0 blur transition-all duration-300 group-hover:opacity-100" />

                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700">
                        <step.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="font-turret text-xl font-bold text-white">
                          {step.name}
                        </h3>
                        <p className="mt-2 text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
