import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <CheckCircle size={80} className="mx-auto mb-6 text-green-400" />
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-white/60 mb-8">
          Thank you for your payment. You'll receive a confirmation email shortly.
        </p>
        <Link to={createPageUrl('Home')}>
          <Button className="bg-white text-black hover:bg-white/90 rounded-full">
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}