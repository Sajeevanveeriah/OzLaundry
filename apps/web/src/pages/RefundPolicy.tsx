export function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
          <p className="text-sm text-gray-600 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
              <p>
                At OzLaundry, customer satisfaction is our priority. This Refund Policy outlines the circumstances
                under which refunds, credits, or compensation may be provided for our subscription laundry service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Subscription Refunds</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.1 Monthly Subscription</h3>
              <p>
                Subscription fees are non-refundable. If you cancel your subscription during a billing cycle,
                you will retain access to the service until the end of that billing period, but no refund will
                be issued for the unused portion of the month.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.2 First Month Satisfaction Guarantee</h3>
              <p>
                New customers may request a full refund within the first 14 days of their initial subscription if:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>They have not used more than one pickup</li>
                <li>They provide a valid reason for dissatisfaction</li>
                <li>They request the refund via email or customer support</li>
              </ul>
              <p className="mt-4">
                This guarantee applies only to first-time subscribers and cannot be combined with promotional offers.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.3 Service Interruptions</h3>
              <p>
                If we are unable to provide service due to operational issues for more than 7 consecutive days,
                you may request a prorated refund or account credit for the affected period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Service Dissatisfaction Refunds</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.1 Eligible Circumstances</h3>
              <p>
                You may be eligible for a partial refund or service credit if:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Quality Issues:</strong> Garments returned improperly cleaned, with stains not removed, or with a strong odor</li>
                <li><strong>Late Delivery:</strong> Delivery is more than 48 hours past the promised timeframe without prior notification</li>
                <li><strong>Missing Items:</strong> Items are confirmed lost or not returned (subject to investigation)</li>
                <li><strong>Service Failure:</strong> Missed pickup without notification or valid reason</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Claim Process</h3>
              <p>
                To request a refund for service dissatisfaction:
              </p>
              <ol className="list-decimal ml-6 mt-2 space-y-2">
                <li>Submit a complaint through your customer dashboard or via email within <strong>48 hours</strong> of delivery</li>
                <li>Provide photographic evidence if applicable (for quality issues or damage)</li>
                <li>Include your order number and detailed description</li>
                <li>Allow up to 5 business days for investigation</li>
              </ol>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.3 Refund Amounts</h3>
              <p>
                Refunds for service dissatisfaction are determined on a case-by-case basis:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Minor Issues:</strong> 10-25% credit toward next order</li>
                <li><strong>Moderate Issues:</strong> 25-50% refund or free re-clean</li>
                <li><strong>Major Issues:</strong> 50-100% refund plus service credit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Damaged or Lost Items</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Damage Claims</h3>
              <p>
                If your garment is damaged during our care:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Report the damage within 48 hours of delivery</li>
                <li>Provide photos of the damaged item</li>
                <li>Submit proof of original purchase value (if claiming over $25)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Compensation Limits</h3>
              <p>
                Maximum compensation for damaged or lost items:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Standard garments: Up to $25 per item</li>
                <li>Maximum per order: $100</li>
                <li>Delicate/luxury items: Up to depreciated value (max $100 per item with proof of purchase)</li>
              </ul>
              <p className="mt-4 font-semibold">
                We are not liable for sentimental value, dry-clean-only items processed as laundry, or items
                without care labels.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Lost Items</h3>
              <p>
                If an item is confirmed lost after investigation:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Compensation provided per the limits above</li>
                <li>Service credit equal to one free pickup</li>
                <li>Claims must be submitted within 7 days of delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Add-On Service Refunds</h2>
              <p>
                Refunds for add-on services (ironing, stain treatment, same-day delivery) will be provided if:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>The service was charged but not performed</li>
                <li>The service was performed below reasonable quality standards</li>
              </ul>
              <p className="mt-4">
                Add-on refunds are typically 50-100% of the add-on fee, issued as account credit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Non-Refundable Circumstances</h2>
              <p>
                Refunds will <strong>not</strong> be issued in the following cases:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Damage due to pre-existing wear and tear</li>
                <li>Color bleeding from improperly manufactured garments</li>
                <li>Shrinkage of garments without care labels</li>
                <li>Missed pickups due to customer unavailability</li>
                <li>Dissatisfaction with normal laundry results (e.g., "not soft enough")</li>
                <li>Claims submitted more than 48 hours after delivery</li>
                <li>Items damaged by contents left in pockets (pens, makeup, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Refund Processing</h2>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.1 Method</h3>
              <p>
                Approved refunds will be processed via:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Original Payment Method:</strong> For subscription refunds (5-10 business days)</li>
                <li><strong>Account Credit:</strong> For service issues (applied immediately)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">7.2 Timeframe</h3>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Investigation: Up to 5 business days</li>
                <li>Refund decision: Within 24 hours of investigation completion</li>
                <li>Processing: 5-10 business days for payment refunds, immediate for credits</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Chargebacks and Disputes</h2>
              <p>
                If you initiate a chargeback or payment dispute without first contacting us:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Your account will be suspended pending resolution</li>
                <li>You may be liable for chargeback fees ($25)</li>
                <li>Repeat chargebacks may result in permanent service termination</li>
              </ul>
              <p className="mt-4">
                Please contact our customer support team before disputing charges with your bank.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Australian Consumer Law</h2>
              <p>
                This Refund Policy does not limit your rights under the Australian Consumer Law (ACL).
                If our service fails to meet consumer guarantees, you may be entitled to a remedy under the ACL.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact for Refund Requests</h2>
              <p>
                To request a refund or submit a complaint:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p><strong>OzLaundry Support</strong></p>
                <p>Email: refunds@ozlaundry.com.au</p>
                <p>Phone: 1300 XXX XXX</p>
                <p>Customer Dashboard: Submit via "Complaints" section</p>
                <p>Hours: Monday-Friday, 9am-6pm AEST</p>
              </div>
              <p className="mt-4">
                Please include your order number, subscription details, and a clear description of the issue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Policy Updates</h2>
              <p>
                We may update this Refund Policy from time to time. Material changes will be communicated via
                email at least 14 days before taking effect.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
