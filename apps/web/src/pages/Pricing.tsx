import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      price: '$19.99',
      period: 'per month',
      tagline: 'Affordable convenience for personal laundry needs',
      description: 'Perfect for individuals who want hassle-free laundry without committing to a full-service plan. Ideal for students and professionals who need reliable twice-monthly pickups with tracking transparency.',
      target: 'Individuals, students, busy professionals',
      features: [
        'Up to 15 lbs (≈7kg) per pickup',
        '2 pickups per month',
        'Standard washing & drying',
        'Folding service included',
        'Real-time tracking',
        'Unique QR code access'
      ],
      popular: false
    },
    {
      id: 'FAMILY',
      name: 'Family',
      price: '$49.99',
      period: 'per month',
      tagline: 'Balanced value and volume',
      description: 'Designed for busy households. Weekly pickups, ironing included, and premium wash care ensure your family\'s laundry is handled professionally and efficiently. Our most popular plan.',
      target: 'Households & growing families',
      features: [
        'Up to 40 lbs (≈18kg) per pickup',
        'Weekly pickups (4 per month)',
        'Premium detergents',
        'Ironing & folding included',
        'Real-time tracking',
        'QR code access',
        'Priority support',
        'Custom washing preferences'
      ],
      popular: true
    },
    {
      id: 'PREMIUM',
      name: 'Premium',
      price: '$89.99',
      period: 'per month',
      tagline: 'Ultimate convenience & garment care',
      description: 'Ultimate garment care with unlimited volume and twice-weekly pickups. Designed for households that demand luxury handling, flexibility, and priority service.',
      target: 'High-demand households, luxury care clients, Airbnb hosts',
      features: [
        'Unlimited weight per pickup',
        'Twice weekly pickups (8 per month)',
        'Luxury detergents',
        'Full ironing service',
        'Delicate item care',
        'Real-time tracking',
        'QR code access',
        '24/7 priority support',
        'Custom preferences',
        'Same-day service availability'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our premium cleaning service
            and real-time tracking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div key={plan.name} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? 'border-2 border-primary-600 shadow-xl' : ''}`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name} Plan</h3>
                  <p className="text-sm text-primary-600 font-medium mb-2">{plan.tagline}</p>
                  <p className="text-xs text-gray-500 mb-3">{plan.target}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'secondary'}
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </Card>
            </div>
          ))}
        </div>

        {/* Add-on Services Section */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Add-On Services</h2>
          <p className="text-gray-600 text-center mb-8">
            Enhance your subscription with optional add-ons available for all plans
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Extra Ironing Service</h3>
              <p className="text-gray-600 text-sm mb-2">Professional pressing for dress shirts, pants, and more</p>
              <p className="text-primary-600 font-semibold">From $8</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Folding-Only Service</h3>
              <p className="text-gray-600 text-sm mb-2">For items you've already washed at home</p>
              <p className="text-primary-600 font-semibold">From $5</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Fabric Softener Option</h3>
              <p className="text-gray-600 text-sm mb-2">Premium fabric softener for extra freshness</p>
              <p className="text-primary-600 font-semibold">$3</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Hypoallergenic Detergent</h3>
              <p className="text-gray-600 text-sm mb-2">Gentle, fragrance-free detergent for sensitive skin</p>
              <p className="text-primary-600 font-semibold">$4</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Heavy Stain Treatment</h3>
              <p className="text-gray-600 text-sm mb-2">Specialized treatment for tough stains</p>
              <p className="text-primary-600 font-semibold">$6</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Express / Same-Day Service</h3>
              <p className="text-gray-600 text-sm mb-2">Rush service when you need it fast</p>
              <p className="text-primary-600 font-semibold">$15</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the
                start of your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What if I need extra pickups?</h3>
              <p className="text-gray-600">
                Additional pickups can be scheduled on-demand at $15 per pickup for Starter plan,
                $12 for Family plan, and $10 for Premium plan members.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a contract?</h3>
              <p className="text-gray-600">
                No contracts required! You can cancel your subscription at any time with no penalties.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What areas do you serve?</h3>
              <p className="text-gray-600">
                We currently serve Greater Geelong, Bellarine Peninsula, and Surf Coast regions in Victoria.
                Enter your address during signup to confirm service availability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I pause my subscription?</h3>
              <p className="text-gray-600">
                Absolutely! You can pause your subscription at any time if you're going on vacation or
                won't need the service for a while. No fees or penalties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
