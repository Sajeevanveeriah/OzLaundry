import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: '$19.99',
      period: 'per month',
      description: 'Perfect for individuals',
      features: [
        'Up to 15 lbs per pickup',
        '2 pickups per month',
        'Standard washing & drying',
        'Folding service',
        'Real-time tracking',
        'QR code access'
      ],
      popular: false
    },
    {
      name: 'Family',
      price: '$49.99',
      period: 'per month',
      description: 'Best for families',
      features: [
        'Up to 40 lbs per pickup',
        'Weekly pickups (4x/month)',
        'Premium detergents',
        'Ironing & folding',
        'Real-time tracking',
        'QR code access',
        'Priority support',
        'Custom preferences'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '$89.99',
      period: 'per month',
      description: 'Ultimate care',
      features: [
        'Unlimited weight',
        'Twice weekly pickups (8x/month)',
        'Luxury detergents',
        'Full ironing service',
        'Delicate item care',
        'Real-time tracking',
        'QR code access',
        '24/7 priority support',
        'Custom preferences',
        'Same-day service available'
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
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
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
                We currently serve the greater metropolitan area. Enter your address during signup
                to confirm service availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
