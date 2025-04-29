import React from 'react'

export const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
      <div className="space-y-6">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Agreement to Terms</h2>
          <p className="mb-4">
            By accessing or using our service, you agree to be bound by these
            Terms of Service. If you disagree with any part of these terms, you
            may not access the service.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide accurate,
            complete, and current information. Failure to do so constitutes a
            breach of the Terms, which may result in immediate termination of
            your account.
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>You are responsible for safeguarding your account password</li>
            <li>You agree not to share your account credentials</li>
            <li>You must notify us immediately of any breach of security</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Acceptable Use</h2>
          <p className="mb-4">
            You agree not to use the service for any purpose that is unlawful or
            prohibited by these Terms. You may not use the service in any manner
            that could damage, disable, overburden, or impair the service.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Intellectual Property</h2>
          <p className="mb-4">
            The service and its original content, features, and functionality
            are and will remain the exclusive property of our company and its
            licensors. The service is protected by copyright, trademark, and
            other laws.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Limitation of Liability
          </h2>
          <p className="mb-4">
            In no event shall our company, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential or punitive damages.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify or replace these Terms at any time.
            If a revision is material, we will try to provide at least 30 days'
            notice prior to any new terms taking effect.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
            support@example.com
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
