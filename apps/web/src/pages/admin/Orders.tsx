import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import api from '../../lib/api';

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

export function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanPayload, setScanPayload] = useState('');
  const [scanStage, setScanStage] = useState('Received');
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

  const handleUpdateStage = async (orderId: string, stage: string) => {
    try {
      await api.patch(`/orders/${orderId}/stage`, { stage, actor: 'admin' });
      await loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to update order');
    }
  };

  const handleScan = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/orders/admin/scan', {
        payload: scanPayload,
        stage: scanStage
      });
      setScanPayload('');
      await loadOrders();
      alert('Order updated successfully via QR scan!');
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Invalid QR code');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.notes && order.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin: Order Management</h1>
          <p className="text-gray-600">View all orders, update stages, and scan QR codes</p>
        </div>

        {/* QR Scanner */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">QR Code Scanner</h2>
          <form onSubmit={handleScan} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="QR Code Payload"
                type="text"
                value={scanPayload}
                onChange={(e) => setScanPayload(e.target.value)}
                placeholder="orderId.signature"
              />
              <div>
                <label className="label">Update Stage To</label>
                <select
                  className="input"
                  value={scanStage}
                  onChange={(e) => setScanStage(e.target.value)}
                >
                  {orderStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" disabled={loading || !scanPayload}>
              {loading ? 'Scanning...' : 'Scan & Update Order'}
            </Button>
          </form>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, stage, or notes..."
          />
        </div>

        {/* Orders List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Orders ({filteredOrders.length})</h2>
          </div>

          {filteredOrders.length === 0 ? (
            <Card>
              <p className="text-gray-600 text-center py-8">
                {searchTerm ? 'No orders match your search' : 'No orders yet'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="font-semibold text-lg text-primary-600 hover:text-primary-700"
                        >
                          Order #{order.id.slice(-8)}
                        </Link>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(order.stage)}`}>
                          {order.stage}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        Customer ID: {order.userId.slice(-8)}
                      </p>
                      <p className="text-gray-600 text-sm mb-1">
                        Pickup: {new Date(order.pickupAt).toLocaleString()}
                      </p>
                      {order.notes && (
                        <p className="text-gray-500 text-sm">Notes: {order.notes}</p>
                      )}
                    </div>

                    <div className="lg:w-64">
                      <label className="label text-sm">Update Stage</label>
                      <select
                        className="input text-sm"
                        value={order.stage}
                        onChange={(e) => handleUpdateStage(order.id, e.target.value)}
                      >
                        {orderStages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
