import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link href="/" className="inline-block mb-8 text-blue-400 hover:text-blue-300">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="text-gray-300 mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-300 mb-4">
              3DLogo.io uses cookies to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Keep you signed in to your account</li>
              <li>Understand how you use our service</li>
              <li>Improve your user experience</li>
              <li>Analyze site traffic and usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Essential Cookies</h3>
            <p className="text-gray-300 mb-4">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
            </p>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Functional Cookies</h3>
            <p className="text-gray-300 mb-4">
              These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
            </p>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Analytics Cookies</h3>
            <p className="text-gray-300 mb-4">
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.
            </p>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Performance Cookies</h3>
            <p className="text-gray-300 mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-300 mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and deliver advertisements on and through the Service. These may include:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Google Analytics for usage statistics</li>
              <li>Social media cookies for sharing functionality</li>
              <li>Payment processor cookies for secure transactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookie Duration</h2>
            <p className="text-gray-300 mb-4">
              Cookies can be either &quot;session&quot; or &quot;persistent&quot; cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><strong>Session Cookies:</strong> These are temporary and expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Cookie Choices</h2>
            <p className="text-gray-300 mb-4">
              You have several options for managing cookies:
            </p>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Browser Settings</h3>
            <p className="text-gray-300 mb-4">
              Most web browsers allow you to control cookies through their settings preferences. You can set your browser to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Accept or reject all cookies</li>
              <li>Accept only certain types of cookies</li>
              <li>Prompt you before accepting a cookie</li>
              <li>Delete cookies when you close your browser</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">Our Cookie Settings</h3>
            <p className="text-gray-300 mb-4">
              When you first visit our site, we will ask for your consent to use non-essential cookies. You can change your preferences at any time through our cookie settings panel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Impact of Disabling Cookies</h2>
            <p className="text-gray-300 mb-4">
              Please note that if you choose to disable cookies, some features of our website may not function properly:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>You may not be able to sign in to your account</li>
              <li>Your preferences may not be saved</li>
              <li>Some interactive features may not work</li>
              <li>You may see less relevant content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Do Not Track Signals</h2>
            <p className="text-gray-300 mb-4">
              Some browsers include a &quot;Do Not Track&quot; (DNT) feature that signals to websites that you do not want to have your online activity tracked. Currently, our website does not respond to DNT signals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Updates to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <p className="text-gray-300">
              Email: privacy@3dlogo.io<br />
              Website: https://3dlogo.io
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. More Information</h2>
            <p className="text-gray-300 mb-4">
              For more information about cookies and how to manage them, visit:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">www.allaboutcookies.org</a></li>
              <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">www.youronlinechoices.com</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}