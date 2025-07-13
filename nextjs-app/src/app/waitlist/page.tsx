'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useWaitlist } from '@/hooks/useWaitlist';

const featureOptions = [
  'Property Search & Discovery',
  'ROI Calculator',
  'Market Analysis',
  'Portfolio Tracking',
  'Investment Alerts',
  'Property Management',
  'Financial Planning Tools',
  'Community & Networking'
];

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addToWaitlist, isLoading } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedFeature) return;

    const result = await addToWaitlist({
      email,
      featurePreference: selectedFeature
    });
    
    if (result.success) {
      setIsSubmitted(true);
    }
  };

  const exampleProperties = [
    {
      id: 1,
      address: '1234 Oak Street, Beverly Hills, CA 90210',
      price: '$2,450,000',
      type: 'Single Family Home',
      beds: 4,
      baths: 3,
      sqft: '2,850',
      roi: '8.2%',
      image: '/img/property-1.jpg',
      description: 'Beautiful modern home with high rental potential in prime Beverly Hills location.'
    },
    {
      id: 2,
      address: '5678 Sunset Blvd, Los Angeles, CA 90027',
      price: '$1,850,000',
      type: 'Multi-Family',
      beds: 6,
      baths: 4,
      sqft: '3,200',
      roi: '9.1%',
      image: '/img/property-2.jpg',
      description: 'Prime multi-family investment property with excellent cash flow potential.'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You&apos;re on the list!
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We&apos;ll notify you when UrbanInsight launches. Get ready to transform your real estate investing!
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UI</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">UrbanInsight</span>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            The Future of
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Real Estate Investing</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the waitlist for early access to our revolutionary platform that combines AI-powered insights, 
            comprehensive market analysis, and powerful investment tools.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Properties Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">$50M+</div>
              <div className="text-gray-600 dark:text-gray-300">Investment Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Properties */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          See What You&apos;ll Be Able to Analyze
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {exampleProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center">
                  <div className="text-center text-gray-600 dark:text-gray-300">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6z"/>
                    </svg>
                    <p className="text-sm">Property Screenshot</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {property.roi} ROI
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {property.address}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {property.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.price}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.type}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Beds/Baths</span>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.beds}/{property.baths}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Sq Ft</span>
                    <div className="font-semibold text-gray-900 dark:text-white">{property.sqft}</div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  View Full Analysis
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Join the Waitlist
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Be among the first to experience the future of real estate investing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="feature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What feature matters most to you?
              </label>
              <select
                id="feature"
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a feature</option>
                {featureOptions.map((feature) => (
                  <option key={feature} value={feature}>
                    {feature}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !selectedFeature}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                'Join Waitlist'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We&apos;ll notify you when we launch. No spam, ever.
            </p>
          </div>
        </Card>
      </section>

      {/* Features Preview */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Powerful Features Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: 'AI Property Analysis', icon: '🤖', desc: 'Advanced AI algorithms analyze market trends and property potential' },
            { title: 'ROI Calculator', icon: '📊', desc: 'Calculate returns, cash flow, and investment metrics instantly' },
            { title: 'Market Insights', icon: '📈', desc: 'Real-time market data and neighborhood analysis' },
            { title: 'Portfolio Tracking', icon: '📋', desc: 'Track all your investments in one comprehensive dashboard' },
            { title: 'Investment Alerts', icon: '🔔', desc: 'Get notified about new opportunities matching your criteria' },
            { title: 'Financial Planning', icon: '💰', desc: 'Plan your real estate investment strategy with expert tools' },
            { title: 'Property Management', icon: '🏠', desc: 'Manage your properties and track maintenance costs' },
            { title: 'Community Network', icon: '👥', desc: 'Connect with other investors and share insights' }
          ].map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          © 2024 UrbanInsight. All rights reserved.
        </p>
      </footer>
    </div>
  );
} 