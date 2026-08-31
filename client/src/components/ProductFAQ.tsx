import { Link } from 'wouter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductFAQProps {
  productTitle?: string;
  productId?: string;
}

// Default FAQ items for all products
const defaultFaqItems = [
  {
    question: 'How do you choose your products?',
    answer:
      'Every piece is hand-picked by our team. We look for natural materials, quality construction, earthy aesthetics, and designs that work in small spaces. If we wouldn\'t put it in our own home, we don\'t carry it.',
  },
  {
    question: "What's your return policy?",
    answer:
      "We offer a 30-day no-questions-asked return policy. If the product isn't perfect for your space, simply return it for a full refund. We want you to be completely satisfied with your purchase.",
  },
  {
    question: 'How long will shipping take?',
    answer:
      'All orders ship free. Most orders arrive within 7-15 business days. You\'ll receive tracking information via email once your order ships so you can follow its journey to your door.',
  },
  {
    question: 'How should I care for this product?',
    answer:
      'Care instructions vary by product material. Generally, we recommend gentle cleaning with a damp cloth for most items. Specific care details are included in the product description and will be included with your order. Quality materials mean less maintenance overall!',
  },
  {
    question: 'What makes Bambana different?',
    answer:
      'We\'re not a marketplace with 50,000 listings. We carry a curated selection of pieces we personally love, with free shipping on everything and real human support.',
  },
];

// Product-specific FAQ items - keyed by product ID patterns or variant IDs
const productSpecificFaqs: Record<string, { question: string; answer: string }[]> = {
  // 7-Tier Plant Stand (variant ID 10190245757217)
  'plant_stand_tall': [
    {
      question: 'How much weight can each shelf hold?',
      answer:
        'Each shelf is designed to safely hold up to 15 lbs, for a total capacity of 105 lbs across all 7 tiers. This easily accommodates most potted plants, including larger terracotta and ceramic planters. The reinforced metal frame distributes weight evenly for maximum stability.',
    },
    {
      question: 'How difficult is assembly?',
      answer:
        'The stand arrives partially assembled with the main frame intact. Final assembly takes approximately 15-25 minutes and requires only a Phillips head screwdriver (included). Clear step-by-step instructions with diagrams are provided. Most customers complete setup in under 20 minutes.',
    },
    {
      question: 'Is the particle board durable?',
      answer:
        'We use premium-grade particle board with a moisture-resistant laminate finish, reinforced by the powder-coated steel frame. This combination is rated for 10+ years of indoor use. The shelves resist warping, water rings, and everyday wear far better than standard particle board.',
    },
    {
      question: 'How tall is the stand and will it fit my space?',
      answer:
        'The stand measures 70.9 inches (approximately 5\'11") tall, making it ideal for corners, beside windows, or any vertical space. The compact 9.5" x 9.5" footprint means it takes up minimal floor space while maximizing your plant display. We recommend having at least 6 feet of ceiling clearance.',
    },
    {
      question: 'Does it come with floor protectors?',
      answer:
        'Yes! Adjustable leveling feet with built-in floor protectors are included. These help stabilize the stand on uneven floors and prevent scratching on hardwood, tile, or laminate surfaces.',
    },
  ],
};

// Function to detect product type and return appropriate FAQs
function getProductFaqs(productId?: string, productTitle?: string): { question: string; answer: string }[] {
  const titleLower = productTitle?.toLowerCase() || '';

  // Check for plant stand
  if (
    titleLower.includes('plant stand') ||
    titleLower.includes('plant shelf') ||
    titleLower.includes('7 tier') ||
    titleLower.includes('7-tier') ||
    productId?.includes('10190245757217')
  ) {
    return [...productSpecificFaqs['plant_stand_tall'], ...defaultFaqItems];
  }

  return defaultFaqItems;
}

export default function ProductFAQ({ productTitle, productId }: ProductFAQProps) {
  const faqItems = getProductFaqs(productId, productTitle);

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`} data-testid={`faq-item-${idx}`}>
            <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="text-xs text-muted-foreground">
        Have more questions?{' '}
        <Link href="/pages/return-policy" className="text-primary hover:underline">
          View our policies
        </Link>{' '}
        or{' '}
        <a href="mailto:livebambana@gmail.com" className="text-primary hover:underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
}
