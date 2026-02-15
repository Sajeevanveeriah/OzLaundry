export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6">Terms & Conditions</h1>
          <p className="text-sm text-gray-600 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using OzLaundry's subscription laundry service, you agree to be bound by these
                Terms and Conditions. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Service Area</h2>
              <p>
                OzLaundry provides laundry pickup and delivery services in the following regions of Victoria, Australia:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Greater Geelong</li>
                <li>Bellarine Peninsula</li>
                <li>Surf Coast</li>
              </ul>
              <p className="mt-4">
                Service availability is subject to our delivery capacity and may vary by suburb.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Subscription Plans</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.1 Plan Types</h3>
              <p>We offer three subscription tiers:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Starter Plan:</strong> $19.99/month - Up to 15 lbs per pickup, 2 pickups per month</li>
                <li><strong>Family Plan:</strong> $49.99/month - Up to 40 lbs per pickup, 4 pickups per month</li>
                <li><strong>Premium Plan:</strong> $89.99/month - Unlimited weight, 8 pickups per month</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Billing</h3>
              <p>
                Subscriptions are billed monthly in advance on the date you sign up. All payments are processed
                securely through Stripe. Prices are in Australian Dollars (AUD) and include GST where applicable.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.3 Auto-Renewal</h3>
              <p>
                Your subscription will automatically renew each month unless you cancel before the renewal date.
                You will be charged the then-current subscription price.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.4 Plan Changes</h3>
              <p>
                You may upgrade or downgrade your subscription plan at any time. Changes take effect at the start
                of your next billing cycle. Prorated charges or credits will be applied as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Fair Usage Policy</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Weight Limitations</h3>
              <p>
                Each subscription plan has weight limits per pickup. Exceeding these limits may result in:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Additional charges at $2.50 per pound over the limit</li>
                <li>Partial pickup (excess items left for next pickup)</li>
                <li>Request to upgrade to a higher-tier plan</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Pickup Frequency</h3>
              <p>
                Monthly pickup allowances reset on the first day of each billing cycle. Unused pickups do not
                roll over to the next month.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Add-On Services</h3>
              <p>
                Additional services (ironing, stain treatment, same-day delivery) are charged separately and
                are not included in the base subscription price unless specifically stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Garment Liability</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Care and Handling</h3>
              <p>
                We take great care in handling your garments. However, we cannot guarantee against:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Color bleeding from improperly manufactured garments</li>
                <li>Shrinkage or damage to items without proper care labels</li>
                <li>Pre-existing damage or wear that becomes apparent during cleaning</li>
                <li>Loss of decorative buttons, beads, or embellishments</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Delicate Items Disclaimer</h3>
              <p className="font-semibold text-red-600">
                We recommend professional dry cleaning for:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Silk, wool, and delicate fabrics</li>
                <li>Designer or high-value garments</li>
                <li>Items with special embellishments</li>
                <li>Wedding dresses and formal wear</li>
              </ul>
              <p className="mt-4">
                By including such items in your laundry, you accept the risk of damage and release OzLaundry from liability.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.3 Liability Limitation</h3>
              <p>
                Our maximum liability for lost or damaged items is limited to:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>$25 per item for standard garments</li>
                <li>$100 per order maximum</li>
                <li>Depreciated value based on age and condition</li>
              </ul>
              <p className="mt-4">
                Claims must be submitted within 48 hours of delivery. We do not cover sentimental value.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.4 Items Left in Pockets</h3>
              <p>
                We are not responsible for items left in pockets, including but not limited to:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Money, credit cards, or keys</li>
                <li>Phones, earbuds, or electronics</li>
                <li>Pens, makeup, or other staining items</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Pickup and Delivery</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.1 Scheduling</h3>
              <p>
                Pickups must be scheduled at least 24 hours in advance through our platform. We will make reasonable
                efforts to accommodate your preferred time slot, but cannot guarantee exact times.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Access</h3>
              <p>
                You are responsible for ensuring our driver can safely access your property. If access is not possible
                (locked gates, aggressive pets, etc.), the pickup may be rescheduled at your expense.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.3 Missed Pickups</h3>
              <p>
                If you miss a scheduled pickup without 24-hour notice, it will count toward your monthly allowance.
                Repeated no-shows may result in service suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cancellation and Refunds</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.1 Subscription Cancellation</h3>
              <p>
                You may cancel your subscription at any time. Cancellations take effect at the end of your current
                billing cycle. No refunds are provided for partial months.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.2 Pausing Service</h3>
              <p>
                You may pause your subscription for up to 3 months per year. Paused subscriptions do not accrue
                charges or pickup allowances.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.3 Refund Policy</h3>
              <p>See our separate Refund Policy for detailed information about refunds and credits.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide accurate account and payment information</li>
                <li>Separate laundry from dry-clean-only items</li>
                <li>Empty pockets before pickup</li>
                <li>Report damaged or missing items within 48 hours</li>
                <li>Maintain a valid payment method on file</li>
                <li>Not abuse or misuse our service or platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Service Suspension</h2>
              <p>
                We reserve the right to suspend or terminate your service if:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Payment fails or your account is past due</li>
                <li>You violate these Terms and Conditions</li>
                <li>You abuse our staff or service</li>
                <li>We suspect fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Privacy and Data</h2>
              <p>
                Your use of our service is also governed by our Privacy Policy. We collect and process personal
                information in accordance with Australian privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by the laws of Victoria, Australia. Any disputes will be
                subject to the exclusive jurisdiction of the courts of Victoria.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p>
                We may modify these Terms and Conditions at any time. Material changes will be communicated via
                email at least 14 days before taking effect. Continued use of our service constitutes acceptance
                of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p><strong>OzLaundry</strong></p>
                <p>Email: support@ozlaundry.com.au</p>
                <p>Phone: 1300 XXX XXX</p>
                <p>Address: Geelong, Victoria, Australia</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
