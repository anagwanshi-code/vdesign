import type { TestimonialDocument } from "@/types/testimonial";

export const FALLBACK_TESTIMONIALS: TestimonialDocument[] = [
  {
    _id: "fallback-en-1",
    name: "Priya S.",
    designation: "Business Owner",
    review:
      "V Design transformed our brand identity. The bespoke packaging is absolutely world-class! Highly recommended.",
    rating: 5,
  },
  {
    _id: "fallback-hi-1",
    name: "Rahul V.",
    designation: "Groom",
    review:
      "इनकी डिज़ाइन और प्रिंट क्वालिटी बहुत ही शानदार है। हमारी वेडिंग स्टेशनरी देखकर हर कोई तारीफ कर रहा था।",
    rating: 5,
  },
  {
    _id: "fallback-gu-1",
    name: "Amit P.",
    designation: "Retailer",
    review:
      "વી ડિઝાઇનનું કામ ખૂબ જ પ્રીમિયમ છે. તેમના પેકેજિંગથી અમારી પ્રોડક્ટ્સ વધુ આકર્ષક લાગે છે.",
    rating: 5,
  },
  {
    _id: "fallback-en-2",
    name: "Dr. S. Mehta",
    designation: "Clinic Founder",
    review:
      "The attention to detail is unmatched. V Design created cinematic brand identities that elevated our entire product line.",
    rating: 5,
  },
  {
    _id: "fallback-hi-2",
    name: "Vikram Singh",
    designation: "Jeweler",
    review:
      "कस्टम पैकेजिंग के लिए V Design से बेहतर कोई नहीं। डिलीवरी टाइम और क्वालिटी दोनों लाजवाब हैं।",
    rating: 5,
  },
  {
    _id: "fallback-gu-2",
    name: "Neha & Kunal",
    designation: "Couple",
    review:
      "લગ્નની કંકોત્રી અને ગિફ્ટ બોક્સનું કામ ખૂબ જ સુંદર હતું. બધા મહેમાનોએ વખાણ કર્યા.",
    rating: 5,
  },
  {
    _id: "fallback-en-3",
    name: "R. Desai",
    designation: "Marketing Head",
    review:
      "A seamless experience from consultation to dispatch. The premium print quality speaks for itself.",
    rating: 5,
  },
];

export function resolveTestimonials(
  testimonials: TestimonialDocument[] | null | undefined,
): TestimonialDocument[] {
  if (testimonials && testimonials.length > 0) {
    return testimonials;
  }
  return FALLBACK_TESTIMONIALS;
}
