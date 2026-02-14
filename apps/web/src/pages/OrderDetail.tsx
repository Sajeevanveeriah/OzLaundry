import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import api from '../lib/api';

const orderStages = [
  'Scheduled',
  'PickedUp',
  'Received',
  'Washing',
  'Drying',
  'Ironing',
  'Folding',
  'QualityCheck',
  'OutForDelivery',
  'Delivered'
];

export function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <p className="text-gray-600 text-center py-8">Order not found</p>
            <div className="text-center">
              <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
                Back to Dashboard
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const currentStageIndex = orderStages.indexOf(order.stage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <Card className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order #{order.id.slice(-8)}</h1>
              <p className="text-gray-600">
                Pickup scheduled for {new Date(order.pickupAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{order.id}</p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-1">Special Instructions</p>
              <p className="text-blue-800">{order.notes}</p>
            </div>
          )}

          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-center">QR Code</h2>
            <div className="flex justify-center">
              {order.qrDataUrl ? (
                <img src={order.qrDataUrl} alt="Order QR Code" className="w-48 h-48 bg-white p-2 rounded-lg shadow-md" />
              ) : (
                <div className="w-48 h-48 bg-white rounded-lg shadow-md flex items-center justify-center">
                  <p className="text-gray-500 text-sm">QR Code</p>
                </div>
              )}
            </div>
            {order.qrPayload && (
              <p className="text-center text-xs text-gray-600 mt-4 font-mono">
                {order.qrPayload}
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-6">Order Status Timeline</h2>
          <div className="space-y-4">
            {orderStages.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;

              return (
                <div key={stage} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        isCompleted
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}
                    >
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < orderStages.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3
                      className={`font-semibold text-lg ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {stage}
                      {isCurrent && (
                        <span className="ml-3 text-sm bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </h3>
                    <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {getStageDescription(stage)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getStageDescription(stage: string): string {
  const descriptions: Record<string, string> = {
    Scheduled: 'Your pickup has been scheduled',
    PickedUp: 'Your laundry has been picked up from your location',
    Received: 'Your laundry has arrived at our facility',
    Washing: 'Your items are being washed with premium detergents',
    Drying: 'Your items are being dried at optimal temperature',
    Ironing: 'Your items are being professionally ironed',
    Folding: 'Your items are being carefully folded',
    QualityCheck: 'Final quality inspection in progress',
    OutForDelivery: 'Your fresh laundry is on the way to you',
    Delivered: 'Your order has been delivered. Enjoy!',
  };
  return descriptions[stage] || '';
}
