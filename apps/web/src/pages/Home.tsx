import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Laundry Service
              <br />
              <span className="text-primary-200">Delivered to Your Door</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Experience hassle-free laundry with real-time tracking, QR scanning, and professional care for your clothes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                Get Started
              </Button>
              <Button size="lg" variant="ghost" className="text-white border-white hover:bg-primary-700" onClick={() => navigate('/learn-more')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Pickup</h3>
              <p className="text-gray-600">
                Choose a convenient time for us to collect your laundry. We work around your schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Track in Real-Time</h3>
              <p className="text-gray-600">
                Watch your order progress through washing, drying, ironing, and folding with live updates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Delivery</h3>
              <p className="text-gray-600">
                Receive your perfectly cleaned, folded, and fresh laundry right at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose OzLaundry?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-primary-600 text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold mb-2">Fast Turnaround</h3>
              <p className="text-gray-600 text-sm">
                Same-day and next-day delivery options available.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-primary-600 text-3xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">QR Tracking</h3>
              <p className="text-gray-600 text-sm">
                Scan QR codes to instantly see your order status.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-primary-600 text-3xl mb-4">✨</div>
              <h3 className="text-lg font-semibold mb-2">Premium Care</h3>
              <p className="text-gray-600 text-sm">
                Professional washing, ironing, and folding services.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-primary-600 text-3xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold mb-2">Live Updates</h3>
              <p className="text-gray-600 text-sm">
                Get notified at each stage of the cleaning process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of happy customers enjoying fresh, clean laundry without the hassle.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  );
}
