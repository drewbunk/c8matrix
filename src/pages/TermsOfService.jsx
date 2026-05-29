import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-white/40 hover:text-white text-sm font-mono tracking-widest uppercase mb-10 inline-block transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: May 29, 2026</p>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the C8Matrix website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Services Provided</h2>
            <p className="mb-3">C8Matrix provides the following services:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>AI-powered content creation and consulting</li>
              <li>Automotive storytelling and video production</li>
              <li>App development and digital product creation</li>
              <li>Brand strategy and creative direction</li>
              <li>Discovery calls and coaching sessions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Payments & Refunds</h2>
            <p className="mb-3">
              All payments are processed securely through Stripe. By purchasing a service or product, you agree to our pricing as listed at the time of purchase.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Discovery Calls:</strong> Non-refundable once the session is scheduled and confirmed.</li>
              <li><strong className="text-white">Launch Packages:</strong> Refund requests must be made within 48 hours of purchase, before any work has commenced.</li>
              <li><strong className="text-white">Subscriptions:</strong> May be cancelled at any time; cancellation takes effect at the end of the current billing period.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, videos, logos, and creative work — is the property of C8Matrix / Drew Bunkley and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. User Conduct</h2>
            <p className="mb-3">When using our services, you agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Harass, abuse, or harm others through our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Disclaimer of Warranties</h2>
            <p>
              Our services are provided "as is" without warranties of any kind, either express or implied. We do not guarantee specific results from our consulting, content, or creative services. Results may vary based on individual effort, market conditions, and other factors outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, C8Matrix shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services, even if advised of the possibility of such damages. Our total liability shall not exceed the amount paid by you for the specific service in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Third-Party Services</h2>
            <p>
              We use third-party services including Stripe (payments) and Google Calendar (scheduling). Your use of these services is also subject to their respective terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Arizona, United States, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes your acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
            <p>
              For questions about these Terms, please contact:<br />
              <a href="mailto:drew@TreadAndTorque.com" className="text-white underline hover:text-white/70">drew@TreadAndTorque.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}