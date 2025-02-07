import React, { useState } from 'react';
import { Mail, Send, Phone, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  message: string;
  services: string[];
}

const VeriLocalContact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
    services: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Insert contact form data into Supabase
      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          business_name: formData.businessName,
          message: formData.message,
          services: formData.services,
          status: 'new'
        }]);

      if (submitError) throw submitError;

      // Send notification email (you'll need to set up your own email service)
      // This is just a placeholder for where you would integrate email notifications
      
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError('There was an error submitting your message. Please try again or contact us directly.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
          <p className="text-green-700">
            Thank you for your interest. Our team will contact you shortly to discuss how we can help grow your business.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to grow your business?
        </h2>
        <p className="text-gray-600">
          Contact our business development team to learn more about how VeriLocal can help take your business to the next level.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your business and how we can help..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
            <span>{loading ? 'Sending...' : 'Send Message'}</span>
          </button>
        </div>
      </form>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Phone Support</h3>
            <p className="text-gray-600">
              Available Monday to Saturday, 9am to 5pm EST
            </p>
            <a href="tel:+1-251-0606" className="text-blue-600 hover:text-blue-800">
              +1 (251) 235-0606
            </a>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Email Support</h3>
            <p className="text-gray-600">
              We'll respond within 24 hours
            </p>
            <a href="mailto:hello@verilocal.pro" className="text-blue-600 hover:text-blue-800">
              hello@verilocal.pro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeriLocalContact;