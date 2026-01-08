import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShopSection({ products = [] }) {
  const sortedProducts = [...products]
    .filter(p => p.isFeatured !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section id="shop" className="py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-white/40 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Shop
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Featured Products
          </h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product, i) => (
            <motion.a
              key={product.id}
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group block"
            >
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-zinc-800">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={48} className="text-white/10" />
                    </div>
                  )}
                  
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white text-black text-xs font-semibold rounded-full">
                      {product.badge}
                    </span>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center gap-2 text-white font-medium">
                      View Product
                      <ExternalLink size={18} />
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-white group-hover:text-white/80 transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  {product.priceText && (
                    <p className="text-white/50 mt-1">{product.priceText}</p>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
            <p>Products will appear here once added in the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}