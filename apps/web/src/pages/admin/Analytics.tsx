import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Card } from '../../components/Card';

interface Analytics {
  totalActive: number;
  totalPaused: number;
  totalCancelled: number;
  newThisMonth: number;
  churnedThisMonth: number;
  mrr: string;
  churnRate: string;
  planBreakdown: {
    STARTER: number;
    FAMILY: number;
    PREMIUM: number;
  };
}

interface ComplaintStats {
  totalOpen: number;
  totalInProgress: number;
  totalResolved: number;
  totalClosed: number;
  categoryBreakdown: Record<string, number>;
  totalRefunds: number;
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [complaintStats, setComplaintStats] = useState<ComplaintStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const [analyticsRes, complaintsRes] = await Promise.all([
        api.get('/subscriptions/admin/analytics'),
        api.get('/complaints/admin/stats')
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setComplaintStats(complaintsRes.data.stats);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !complaintStats) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <p className="text-gray-600">Failed to load analytics data</p>
          </Card>
        </div>
      </div>
    );
  }

  const totalSubscriptions = analytics.totalActive + analytics.totalPaused + analytics.totalCancelled;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Monthly Recurring Revenue</p>
              <p className="text-3xl font-bold text-primary-600">${analytics.mrr}</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
              <p className="text-3xl font-bold text-green-600">{analytics.totalActive}</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Churn Rate</p>
              <p className="text-3xl font-bold text-red-600">{analytics.churnRate}%</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">New This Month</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.newThisMonth}</p>
            </div>
          </Card>
        </div>

        {/* Subscription Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h2 className="text-xl font-bold mb-4">Subscription Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">Active</span>
                <span className="text-2xl font-bold text-green-600">{analytics.totalActive}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-yellow-800">Paused</span>
                <span className="text-2xl font-bold text-yellow-600">{analytics.totalPaused}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-red-800">Cancelled</span>
                <span className="text-2xl font-bold text-red-600">{analytics.totalCancelled}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-t-2 border-gray-300">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-gray-800">{totalSubscriptions}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-4">Plan Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Starter Plan</span>
                  <span className="font-semibold">{analytics.planBreakdown.STARTER}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{
                      width: `${(analytics.planBreakdown.STARTER / analytics.totalActive) * 100 || 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Family Plan</span>
                  <span className="font-semibold">{analytics.planBreakdown.FAMILY}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${(analytics.planBreakdown.FAMILY / analytics.totalActive) * 100 || 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">Premium Plan</span>
                  <span className="font-semibold">{analytics.planBreakdown.PREMIUM}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full"
                    style={{
                      width: `${(analytics.planBreakdown.PREMIUM / analytics.totalActive) * 100 || 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Growth Metrics */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">Growth Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">New Subscriptions</p>
              <p className="text-3xl font-bold text-blue-600">{analytics.newThisMonth}</p>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Churned</p>
              <p className="text-3xl font-bold text-red-600">{analytics.churnedThisMonth}</p>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Net Growth</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.newThisMonth - analytics.churnedThisMonth > 0 ? '+' : ''}
                {analytics.newThisMonth - analytics.churnedThisMonth}
              </p>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
            </div>
          </div>
        </Card>

        {/* Complaints Overview */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Complaints Overview</h2>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Open</p>
              <p className="text-2xl font-bold text-blue-600">{complaintStats.totalOpen}</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{complaintStats.totalInProgress}</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{complaintStats.totalResolved}</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Closed</p>
              <p className="text-2xl font-bold text-gray-600">{complaintStats.totalClosed}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Total Refunds Issued</h3>
            <p className="text-2xl font-bold text-red-600">${complaintStats.totalRefunds.toFixed(2)}</p>
          </div>

          {Object.keys(complaintStats.categoryBreakdown).length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3">Complaints by Category</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {Object.entries(complaintStats.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{category.replace('_', ' ')}</span>
                    <span className="text-sm font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
