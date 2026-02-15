import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface Complaint {
  id: string;
  ticketNumber: string;
  category: string;
  status: string;
  subject: string;
  description: string;
  createdAt: string;
  order?: {
    orderNumber: string;
    stage: string;
  };
}

export function Complaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'QUALITY_CONCERN',
    subject: '',
    description: '',
    orderId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  async function loadComplaints() {
    try {
      const response = await api.get('/complaints/my-complaints');
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.subject || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/complaints/create', {
        ...formData,
        orderId: formData.orderId || null
      });

      alert('Complaint submitted successfully! Our team will review it shortly.');
      setFormData({
        category: 'QUALITY_CONCERN',
        subject: '',
        description: '',
        orderId: ''
      });
      setShowCreateForm(false);
      loadComplaints();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  }

  const statusColors: any = {
    OPEN: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800'
  };

  const categoryLabels: any = {
    MISSING_ITEM: 'Missing Item',
    DAMAGED_GARMENT: 'Damaged Garment',
    QUALITY_CONCERN: 'Quality Concern',
    LATE_DELIVERY: 'Late Delivery',
    BILLING_ISSUE: 'Billing Issue',
    OTHER: 'Other'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Complaints</h1>
            <p className="text-gray-600">Submit and track your service complaints</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Submit New Complaint'}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Submit a Complaint</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="QUALITY_CONCERN">Quality Concern</option>
                  <option value="MISSING_ITEM">Missing Item</option>
                  <option value="DAMAGED_GARMENT">Damaged Garment</option>
                  <option value="LATE_DELIVERY">Late Delivery</option>
                  <option value="BILLING_ISSUE">Billing Issue</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID (Optional)
                </label>
                <Input
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  placeholder="Order ID if related to specific order"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about your complaint"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {complaints.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">No Complaints</h3>
              <p className="text-gray-600 mb-4">You haven't submitted any complaints yet.</p>
              <Button onClick={() => setShowCreateForm(true)}>Submit Your First Complaint</Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{complaint.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status]}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ticket #{complaint.ticketNumber} • {categoryLabels[complaint.category]} • {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                    {complaint.order && (
                      <p className="text-sm text-gray-600 mt-1">
                        Related to Order: {complaint.order.orderNumber}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{complaint.description}</p>
                <div className="flex justify-end">
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/complaints/${complaint.id}`)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
