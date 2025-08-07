import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link href="/" className="inline-block mb-8 text-blue-400 hover:text-blue-300">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect information you provide directly to us, such as when you create or share 3D logos, contact us, or otherwise use our services.
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Images and files you upload for logo creation</li>
              <li>Logo designs and customizations you create</li>
              <li>Usage data and analytics</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns and improve user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Storage and Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-gray-300 mb-4">
              Your uploaded images and created logos are processed locally in your browser whenever possible, minimizing data transmission to our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
            <p className="text-gray-300 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy or as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-gray-300 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Access your personal information</li>
              <li>Correct or update your information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of certain communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-300">
              Email: privacy@3dlogo.io<br />
              Website: https://3dlogo.io
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}