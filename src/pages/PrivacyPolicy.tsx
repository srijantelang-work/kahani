import { Container } from '../components/layout/Container'

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black py-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <div className="mt-8 space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white">
                1. Information We Collect
              </h2>
              <p className="mt-4">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="mt-2 list-disc pl-6">
                <li>Account information (name, email, profile picture)</li>
                <li>Content preferences and viewing history</li>
                <li>Recommendation requests and feedback</li>
                <li>Device and usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                2. How We Use Your Information
              </h2>
              <p className="mt-4">We use the collected information to:</p>
              <ul className="mt-2 list-disc pl-6">
                <li>Provide personalized content recommendations</li>
                <li>Improve our AI recommendation system</li>
                <li>Communicate with you about our services</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                3. Information Sharing
              </h2>
              <p className="mt-4">
                We do not sell your personal information. We may share your
                information with:
              </p>
              <ul className="mt-2 list-disc pl-6">
                <li>Service providers who assist in our operations</li>
                <li>Law enforcement when required by law</li>
                <li>Other parties with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                4. Data Security
              </h2>
              <p className="mt-4">
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over
                the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                5. Your Rights
              </h2>
              <p className="mt-4">You have the right to:</p>
              <ul className="mt-2 list-disc pl-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of certain data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                6. Contact Us
              </h2>
              <p className="mt-4">
                If you have questions about this Privacy Policy, please contact
                us at privacy@kahani.com
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  )
}
