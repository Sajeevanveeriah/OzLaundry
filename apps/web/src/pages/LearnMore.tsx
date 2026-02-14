import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function LearnMore() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Everything You Need to Know About OzLaundry
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">Our Complete Service</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            OzLaundry is a premium laundry subscription service that takes care of all your laundry needs.
            We handle everything from pickup to delivery, with professional cleaning and real-time tracking
            throughout the entire process.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our service includes washing with premium detergents, drying at optimal temperatures, professional
            ironing for wrinkle-free clothes, and careful folding. Every item is treated with care and attention
            to detail.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">The Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Schedule Your Pickup</h3>
                <p className="text-gray-600">
                  Use our app to schedule a pickup time that works for you. Our driver will arrive at your
                  chosen time to collect your laundry.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Professional Cleaning</h3>
                <p className="text-gray-600">
                  Your clothes are washed with premium detergents, dried at optimal temperatures, professionally
                  ironed, and carefully folded by our trained staff.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Quality Check</h3>
                <p className="text-gray-600">
                  Every order goes through a quality inspection to ensure everything meets our high standards
                  before delivery.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Fresh Delivery</h3>
                <p className="text-gray-600">
                  Your clean, fresh laundry is delivered back to your door. Track the delivery in real-time
                  through our app.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">QR Code Tracking</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Each order receives a unique QR code that you can scan at any time to see exactly where your
            laundry is in the cleaning process. From pickup to delivery, you'll always know the status of
            your order.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our admin team also uses QR codes to update order statuses, ensuring accuracy and providing
            you with real-time notifications.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">Customizable Preferences</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Choose from various service options including detergent selection, fabric softener preferences,
            and special handling instructions for delicate items.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our feature flags system allows us to continuously add new services and options based on customer
            demand.
          </p>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience Premium Laundry Service?</h2>
          <Button size="lg" onClick={() => navigate('/login')}>
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}
