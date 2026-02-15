import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface Complaint {
  id: string;
  ticketNumber: string;
  category: string;
  status: string;
  subject: string;
  description: string;
  resolution?: string;
  refundAmount?: number;
  refundIssued: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  order?: {
    orderNumber: string;
    stage: string;
  };
}

export function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, [filter]);

  async function loadComplaints() {
    setLoading(true);
    try {
      const response = await api.get('/complaints/admin/all', {
        params: { status: filter }
      });
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setActionLoading(true);
    try {
      await api.patch(`/complaints/admin/${id}/status`, {
        status: newStatus
      });
      await loadComplaints();
      setSelectedComplaint(null);
      alert('Status updated successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  }

  async function resolveComplaint(id: string) {
    if (!resolution) {
      alert('Please provide a resolution');
      return;
    }

    setActionLoading(true);
    try {
      await api.patch(`/complaints/admin/${id}/resolve`, {
        resolution,
        refundAmount: refundAmount ? parseFloat(refundAmount) : null
      });
      await loadComplaints();
      setSelectedComplaint(null);
      setResolution('');
      setRefundAmount('');
      alert('Complaint resolved successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to resolve complaint');
    } finally {
      setActionLoading(false);
    }
  }

  async function issueRefund(id: string) {
    const amount = prompt('Enter refund amount:');
    if (!amount || parseFloat(amount) <= 0) return;

    if (!confirm(`Issue refund of $${amount}?`)) return;

    setActionLoading(true);
    try {
      await api.post(`/complaints/admin/${id}/refund`, {
        amount: parseFloat(amount)
      });
      await loadComplaints();
      alert('Refund issued successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to issue refund');
    } finally {
      setActionLoading(false);
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
        <h1 className="text-4xl font-bold mb-8">Complaints Management</h1>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
              <Button
                key={status}
                onClick={() => setFilter(status)}
                variant={filter === status ? 'primary' : 'secondary'}
                size="sm"
              >
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </Card>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <Card>
            <p className="text-gray-600 text-center py-8">No complaints found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{complaint.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[complaint.status]}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Ticket #{complaint.ticketNumber} • {categoryLabels[complaint.category]}
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer: {complaint.user.name} ({complaint.user.email})
                    </p>
                    {complaint.order && (
                      <p className="text-sm text-gray-600">
                        Order: {complaint.order.orderNumber}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(complaint.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
                </div>

                {complaint.resolution && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800 mb-2">Resolution:</p>
                    <p className="text-sm text-gray-700">{complaint.resolution}</p>
                    {complaint.refundAmount && (
                      <p className="text-sm text-green-800 font-semibold mt-2">
                        Refund: ${complaint.refundAmount.toFixed(2)} {complaint.refundIssued ? '(Issued)' : '(Pending)'}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Management Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Manage Complaint #{selectedComplaint.ticketNumber}</h2>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-sm text-gray-700">
                  Name: {selectedComplaint.user.name}<br />
                  Email: {selectedComplaint.user.email}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Complaint Details</h3>
                <p className="text-sm text-gray-700">
                  Category: {categoryLabels[selectedComplaint.category]}<br />
                  Status: {selectedComplaint.status.replace('_', ' ')}<br />
                  Subject: {selectedComplaint.subject}
                </p>
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedComplaint.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedComplaint.status === status ? 'primary' : 'secondary'}
                      onClick={() => updateStatus(selectedComplaint.id, status)}
                      disabled={actionLoading}
                    >
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'CLOSED' && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Resolve Complaint</h3>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Enter resolution details..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                  />
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Refund amount (optional)"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                  />
                  <Button
                    onClick={() => resolveComplaint(selectedComplaint.id)}
                    disabled={actionLoading || !resolution}
                  >
                    Resolve & Close
                  </Button>
                </div>
              )}

              {selectedComplaint.refundAmount && !selectedComplaint.refundIssued && (
                <div className="mb-6">
                  <Button
                    onClick={() => issueRefund(selectedComplaint.id)}
                    disabled={actionLoading}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Issue Refund (${selectedComplaint.refundAmount.toFixed(2)})
                  </Button>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
