import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface SubscriptionData {
  subscription: {
    id: string;
    plan: 'STARTER' | 'FAMILY' | 'PREMIUM';
    status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'PAST_DUE';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    pausedAt: string | null;
    weightLimitLbs: number;
    pickupsPerMonth: number;
    pickupsUsed: number;
    lastResetAt: string;
    planDetails: {
      name: string;
      price: number;
      features: string[];
    };
  } | null;
}

export function Subscription() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showChangePlan, setShowChangePlan] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    try {
      const response = await api.get('/subscriptions/me');
      setData(response.data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePause() {
    if (!confirm('Are you sure you want to pause your subscription?')) return;

    setActionLoading(true);
    try {
      await api.post('/subscriptions/pause');
      await loadSubscription();
      alert('Subscription paused successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to pause subscription');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResume() {
    if (!confirm('Resume your subscription?')) return;

    setActionLoading(true);
    try {
      await api.post('/subscriptions/resume');
      await loadSubscription();
      alert('Subscription resumed successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    const immediately = confirm(
      'Cancel immediately (refund prorated amount) or at end of billing period?\n\nOK = End of period\nCancel = Immediately'
    );

    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    setActionLoading(true);
    try {
      await api.post('/subscriptions/cancel', { immediately: !immediately });
      await loadSubscription();
      alert(immediately ? 'Subscription will end at period end' : 'Subscription cancelled');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleChangePlan(newPlan: string) {
    if (!confirm(`Change to ${newPlan} plan? Changes take effect immediately.`)) return;

    setActionLoading(true);
    try {
      await api.post('/subscriptions/change-plan', { newPlan });
      await loadSubscription();
      setShowChangePlan(false);
      alert('Plan changed successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to change plan');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!data?.subscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-3xl font-bold mb-4">No Active Subscription</h1>
            <p className="text-gray-600 mb-6">
              You don't have an active subscription. Choose a plan to get started!
            </p>
            <Button onClick={() => navigate('/pricing')}>View Plans</Button>
          </Card>
        </div>
      </div>
    );
  }

  const { subscription } = data;
  const pickupsRemaining = subscription.pickupsPerMonth - subscription.pickupsUsed;
  const usagePercentage = (subscription.pickupsUsed / subscription.pickupsPerMonth) * 100;

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
    CANCELLED: 'bg-red-100 text-red-800',
    PAST_DUE: 'bg-orange-100 text-orange-800'
  };

  const planNames = {
    STARTER: 'Starter',
    FAMILY: 'Family',
    PREMIUM: 'Premium'
  };

  const allPlans = ['STARTER', 'FAMILY', 'PREMIUM'];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">My Subscription</h1>
          <p className="text-gray-600">Manage your laundry subscription plan</p>
        </div>

        {/* Current Plan Card */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{planNames[subscription.plan]} Plan</h2>
                <p className="text-gray-600">${subscription.planDetails.price}/month</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[subscription.status]}`}>
                {subscription.status}
              </span>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-semibold">Subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
              </div>
            )}

            {subscription.status === 'PAST_DUE' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold">Payment failed. Please update your payment method.</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Plan Features</h3>
              <ul className="space-y-2">
                {subscription.planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Current Period</p>
                  <p className="font-semibold">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Next Billing Date</p>
                  <p className="font-semibold">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Usage Card */}
          <Card>
            <h3 className="font-semibold text-lg mb-4">This Month's Usage</h3>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Pickups Used</span>
                <span className="font-semibold">{subscription.pickupsUsed} / {subscription.pickupsPerMonth}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{pickupsRemaining} pickups remaining</p>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Weight Limit</span>
                <span className="font-semibold">
                  {subscription.weightLimitLbs > 10000 ? 'Unlimited' : `${subscription.weightLimitLbs} lbs`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Resets On</span>
                <span className="font-semibold">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => navigate('/dashboard')}
              variant="secondary"
            >
              Schedule Pickup
            </Button>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mb-6">
          <h3 className="font-semibold text-lg mb-4">Manage Subscription</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowChangePlan(!showChangePlan)}
              variant="secondary"
              disabled={actionLoading || subscription.status === 'CANCELLED'}
            >
              Change Plan
            </Button>

            {subscription.status === 'ACTIVE' && (
              <Button
                onClick={handlePause}
                variant="secondary"
                disabled={actionLoading}
              >
                Pause Subscription
              </Button>
            )}

            {subscription.status === 'PAUSED' && (
              <Button
                onClick={handleResume}
                variant="primary"
                disabled={actionLoading}
              >
                Resume Subscription
              </Button>
            )}

            {subscription.status !== 'CANCELLED' && !subscription.cancelAtPeriodEnd && (
              <Button
                onClick={handleCancel}
                variant="secondary"
                disabled={actionLoading}
                className="bg-red-600 text-white hover:bg-red-700 border-red-600"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </Card>

        {/* Change Plan Section */}
        {showChangePlan && (
          <Card>
            <h3 className="font-semibold text-lg mb-4">Choose New Plan</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {allPlans.map((plan) => (
                <div
                  key={plan}
                  className={`border-2 rounded-lg p-4 ${
                    plan === subscription.plan ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-2">{planNames[plan as keyof typeof planNames]}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {plan === 'STARTER' && '$19.99/month'}
                    {plan === 'FAMILY' && '$49.99/month'}
                    {plan === 'PREMIUM' && '$89.99/month'}
                  </p>
                  {plan === subscription.plan ? (
                    <Button variant="secondary" disabled className="w-full">Current Plan</Button>
                  ) : (
                    <Button
                      onClick={() => handleChangePlan(plan)}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      Switch to {planNames[plan as keyof typeof planNames]}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
