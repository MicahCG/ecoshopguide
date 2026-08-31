import { RotateCcw, Truck, Shield, MessageCircle } from 'lucide-react';

const trustItems = [
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders',
  },
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: 'Your payment info is always protected',
  },
  {
    icon: MessageCircle,
    title: 'Real Support',
    description: 'Questions? Email us anytime',
  },
];

export default function WhyChooseEcoShop() {
  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-base font-semibold mb-3 text-foreground">
        Why Choose Bambana?
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
