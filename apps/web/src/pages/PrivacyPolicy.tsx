export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                OzLaundry ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our laundry
                subscription service in the Greater Geelong, Bellarine Peninsula, and Surf Coast regions of Victoria, Australia.
              </p>
              <p className="mt-4">
                This Privacy Policy complies with the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Name and contact information (email address, phone number)</li>
                <li>Billing address and service address</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Subscription plan details and preferences</li>
                <li>Order history and service preferences</li>
                <li>Communication records with our customer support team</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Technical Information</h3>
              <p>We automatically collect certain technical information:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage data and analytics</li>
                <li>QR code scanning activity for order tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide and manage your laundry subscription service</li>
                <li>Process payments and manage billing</li>
                <li>Schedule pickups and deliveries</li>
                <li>Send order updates and service notifications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (e.g., payment processors, delivery partners)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of our business</li>
              </ul>
              <p className="mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information,
                including:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Data backup and recovery procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p>Under the Australian Privacy Principles, you have the right to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Object to or restrict certain processing activities</li>
                <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and comply with
                legal obligations. When you cancel your subscription, we will retain your information for:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>7 years for financial records (as required by Australian tax law)</li>
                <li>30 days for operational data (unless required for dispute resolution)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to improve your experience on our website.
                You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect
                personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes
                by email or through our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p><strong>OzLaundry</strong></p>
                <p>Email: privacy@ozlaundry.com.au</p>
                <p>Phone: 1300 XXX XXX</p>
                <p>Address: Geelong, Victoria, Australia</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Complaints</h2>
              <p>
                If you believe we have breached the Australian Privacy Principles, you may lodge a complaint with us
                using the contact details above. If you are not satisfied with our response, you may contact the
                Office of the Australian Information Commissioner:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p><strong>Office of the Australian Information Commissioner (OAIC)</strong></p>
                <p>Website: www.oaic.gov.au</p>
                <p>Phone: 1300 363 992</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
