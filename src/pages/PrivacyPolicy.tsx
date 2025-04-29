import React from 'react'

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <div className="space-y-6">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Introduction</h2>
          <p className="mb-4">
            This Privacy Policy describes how we collect, use, and handle your
            personal information when you use our services. We take your privacy
            seriously and are committed to protecting your personal information.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Information We Collect
          </h2>
          <p className="mb-4">
            We collect information that you provide directly to us when you:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Contact us for support</li>
            <li>Subscribe to our newsletters</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="mb-4 list-disc pl-6">
            <li>Provide and maintain our services</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about our services</li>
            <li>Protect against fraud and abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="mb-4 list-disc pl-6">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at: support@example.com
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  )
}
