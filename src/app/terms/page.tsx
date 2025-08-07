import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link href="/" className="inline-block mb-8 text-blue-400 hover:text-blue-300">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing and using 3DLogo.io (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              3DLogo.io provides an online platform for creating, customizing, and exporting 3D logos. The Service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>3D logo creation and editing tools</li>
              <li>Material and texture customization</li>
              <li>Export functionality in various formats</li>
              <li>Template library and design resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-gray-300 mb-4">
              You may be required to create an account to access certain features. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property Rights</h2>
            <h3 className="text-xl font-semibold mb-2 mt-4">Your Content</h3>
            <p className="text-gray-300 mb-4">
              You retain all rights to the logos and designs you create using our Service. By using the Service, you grant us a limited license to display and process your content solely for the purpose of providing the Service.
            </p>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Our Content</h3>
            <p className="text-gray-300 mb-4">
              The Service, including its original content, features, and functionality, is owned by 3DLogo.io and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use Policy</h2>
            <p className="text-gray-300 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Upload content that infringes on intellectual property rights</li>
              <li>Transmit any malicious code or viruses</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Create logos that are offensive, defamatory, or inappropriate</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment and Subscriptions</h2>
            <p className="text-gray-300 mb-4">
              Certain features may require payment or subscription. By purchasing a subscription or premium features, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Pay all applicable fees and taxes</li>
              <li>Provide accurate billing information</li>
              <li>Accept automatic renewal unless canceled</li>
            </ul>
            <p className="text-gray-300 mb-4 mt-4">
              Refunds are handled on a case-by-case basis in accordance with our refund policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              To the maximum extent permitted by law, 3DLogo.io shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to your data</li>
              <li>Any interruption or cessation of transmission</li>
              <li>Any bugs, viruses, or errors in the Service</li>
              <li>Any loss of your content or data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
            <p className="text-gray-300 mb-4">
              You agree to indemnify and hold harmless 3DLogo.io, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
            </p>
            <p className="text-gray-300 mb-4">
              Upon termination, your right to use the Service will cease immediately. You may delete your account at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Modifications to Service</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify or discontinue the Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-gray-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 3DLogo.io operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to update these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-300">
              Email: legal@3dlogo.io<br />
              Website: https://3dlogo.io
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}