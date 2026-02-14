import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import api from '../lib/api';

interface DashboardProps {
  user: any;
}

export function Dashboard({ user }: DashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleCreateOrder = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pickupAt = new Date(`${pickupDate}T${pickupTime}`).toISOString();
      await api.post('/orders', { pickupAt, notes });
      setShowCreateForm(false);
      setPickupDate('');
      setPickupTime('');
      setNotes('');
      await loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      Scheduled: 'bg-blue-100 text-blue-800',
      PickedUp: 'bg-purple-100 text-purple-800',
      Received: 'bg-indigo-100 text-indigo-800',
      Washing: 'bg-cyan-100 text-cyan-800',
      Drying: 'bg-yellow-100 text-yellow-800',
      Ironing: 'bg-orange-100 text-orange-800',
      Folding: 'bg-pink-100 text-pink-800',
      QualityCheck: 'bg-teal-100 text-teal-800',
      OutForDelivery: 'bg-green-100 text-green-800',
      Delivered: 'bg-green-200 text-green-900',
    };
    return stageColors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Manage your laundry orders and track their progress</p>
        </div>

        <div className="mb-8">
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)}>
              + Schedule New Pickup
            </Button>
          ) : (
            <Card>
              <h2 className="text-xl font-bold mb-4">Schedule New Pickup</h2>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Pickup Date"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                  <Input
                    label="Pickup Time"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Special Instructions (Optional)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., delicate items, preferred detergent, etc."
                  />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Order'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
          {orders.length === 0 ? (
            <Card>
              <p className="text-gray-600 text-center py-8">
                No orders yet. Schedule your first pickup to get started!
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">Order #{order.id.slice(-8)}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(order.stage)}`}>
                            {order.stage}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          Pickup: {new Date(order.pickupAt).toLocaleString()}
                        </p>
                        {order.notes && (
                          <p className="text-gray-500 text-sm">Notes: {order.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Created {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
