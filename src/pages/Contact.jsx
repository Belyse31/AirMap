import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { contactAPI } from '../services/api';

export function Contact() {
  const { toasts, removeToast, success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await contactAPI.submit(formData);
      success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      error('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about AirMap? Want to deploy sensors in your area? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <ContactInfoCard
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              content="info@airmap.io"
              link="mailto:info@airmap.io"
            />
            <ContactInfoCard
              icon={<Phone className="w-6 h-6" />}
              title="Phone"
              content="+250 788 123 456"
              link="tel:+250788123456"
            />
            <ContactInfoCard
              icon={<MapPin className="w-6 h-6" />}
              title="Location"
              content="Kigali, Rwanda"
            />

            <Card className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
              <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
              <div className="space-y-1 text-sm text-primary-100">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Send}
                  loading={submitting}
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <FAQItem
                  question="How can I add a sensor to the network?"
                  answer="Contact us through this form or email us at info@airmap.io. We'll guide you through the sensor deployment process and provide technical specifications."
                />
                <FAQItem
                  question="Is the data publicly available?"
                  answer="Yes! All air quality data collected through AirMap is publicly accessible through our platform and API. We believe in transparency and open data."
                />
                <FAQItem
                  question="Can I integrate AirMap with my own application?"
                  answer="Absolutely! We provide a RESTful API and WebSocket endpoints for real-time data access. Documentation is available on request."
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

function ContactInfoCard({ icon, title, content, link }) {
  const ContentWrapper = link ? 'a' : 'div';
  const wrapperProps = link ? { href: link, className: 'hover:text-primary-600 transition-colors' } : {};

  return (
    <Card hover>
      <div className="flex items-start gap-4">
        <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <ContentWrapper {...wrapperProps}>
            <p className="text-gray-600">{content}</p>
          </ContentWrapper>
        </div>
      </div>
    </Card>
  );
}

function FAQItem({ question, answer }) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      <h4 className="font-semibold text-gray-900 mb-2">{question}</h4>
      <p className="text-gray-600 text-sm">{answer}</p>
    </div>
  );
}
