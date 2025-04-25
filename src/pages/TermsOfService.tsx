import { Container } from '../components/layout/Container'

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black py-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          <div className="mt-8 space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white">
                1. Acceptance of Terms
              </h2>
              <p className="mt-4">
                By accessing and using Kahani, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do
                not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                2. Description of Service
              </h2>
              <p className="mt-4">
                Kahani is an AI-powered platform that provides personalized
                movie, TV show, and book recommendations. We use artificial
                intelligence to analyze your preferences and provide tailored
                content suggestions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                3. User Accounts
              </h2>
              <p className="mt-4">
                To use certain features of our service, you must register for an
                account. You agree to provide accurate information and keep it
                updated. You are responsible for maintaining the confidentiality
                of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">4. Privacy</h2>
              <p className="mt-4">
                Your privacy is important to us. Our use of your personal
                information is governed by our Privacy Policy. By using Kahani,
                you consent to our collection and use of data as outlined in the
                Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                5. Content and Recommendations
              </h2>
              <p className="mt-4">
                While we strive to provide accurate and relevant
                recommendations, we do not guarantee the accuracy, completeness,
                or usefulness of any recommendations. The content suggestions
                are based on available data and AI analysis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                6. Modifications to Service
              </h2>
              <p className="mt-4">
                We reserve the right to modify or discontinue our service at any
                time, with or without notice. We shall not be liable to you or
                any third party for any modification, suspension, or
                discontinuance of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                7. Contact Information
              </h2>
              <p className="mt-4">
                If you have any questions about these Terms of Service, please
                contact us at support@kahani.com
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  )
}
