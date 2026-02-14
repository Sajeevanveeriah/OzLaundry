import { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import api from '../../lib/api';

export function AdminFeatures() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const response = await api.get('/flags');
      setFlags(response.data);
    } catch (err) {
      console.error('Failed to load flags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: string, enabled: boolean) => {
    try {
      const response = await api.patch(`/flags/${key}`, { enabled });
      setFlags(flags.map(f => f.key === key ? response.data : f));
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to update feature flag');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p className="text-gray-600">Loading features...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin: Feature Flags</h1>
          <p className="text-gray-600">Enable or disable features across the platform</p>
        </div>

        <Card>
          <div className="space-y-6">
            {flags.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No feature flags configured</p>
            ) : (
              flags.map((flag) => (
                <div
                  key={flag.key}
                  className="flex items-start justify-between py-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 capitalize">
                      {flag.key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    {flag.description && (
                      <p className="text-gray-600 text-sm">{flag.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 font-mono">Key: {flag.key}</p>
                  </div>

                  <div className="flex items-center ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flag.enabled}
                        onChange={(e) => handleToggle(flag.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">About Feature Flags</h3>
          <p className="text-blue-800 text-sm">
            Feature flags allow you to enable or disable functionality across the platform without
            deploying new code. Use them to control beta features, A/B test new capabilities, or
            temporarily disable features during maintenance.
          </p>
        </div>
      </div>
    </div>
  );
}
