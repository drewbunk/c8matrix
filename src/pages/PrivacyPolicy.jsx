import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-white/40 hover:text-white text-sm font-mono tracking-widest uppercase mb-10 inline-block transition-colors">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: May 29, 2026</p>

        <div className="space-y-10 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to C8Matrix ("we," "us," or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong className="text-white">c8matrix.com</strong> and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Contact Information:</strong> Name, email address, and phone number when you fill out a contact or inquiry form.</li>
              <li><strong className="text-white">Payment Information:</strong> Billing details processed securely through Stripe. We do not store your full credit card information.</li>
              <li><strong className="text-white">Usage Data:</strong> Pages visited, time spent on site, browser type, and device information collected automatically via standard web analytics.</li>
              <li><strong className="text-white">Communications:</strong> Any messages or project details you submit through our contact or booking forms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To respond to inquiries and provide requested services</li>
              <li>To process bookings and payments</li>
              <li>To send service-related communications and updates</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers (such as Stripe for payments and Google for calendar scheduling) solely to operate our services. These providers are bound by their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Cookies & Tracking</h2>
            <p>
              Our website may use cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:drewbunkley@gmail.com" className="text-white underline hover:text-white/70">drewbunkley@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party sites (Instagram, YouTube, TikTok, LinkedIn). We are not responsible for the privacy practices of those sites and encourage you to review their policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of our site after changes constitutes your acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:<br />
              <a href="mailto:drewbunkley@gmail.com" className="text-white underline hover:text-white/70">drewbunkley@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}