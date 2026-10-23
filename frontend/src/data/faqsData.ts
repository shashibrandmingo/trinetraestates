export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export const faqsData: FaqItem[] = [
  {
    id: "faq-1",
    question: "Which sectors in Noida are best for IT and corporate office space?",
    answer:
      "Sector 62 (near Electronic City Metro), Sector 63, Sector 132, Sector 135, and Sector 142 along the Noida-Greater Noida Expressway are the top commercial hubs offering Grade-A corporate campuses, modern amenities, 24/7 power backup, and seamless metro connectivity.",
    category: "Locations & Sectors",
  },
  {
    id: "faq-2",
    question: "What types of commercial office space in Noida do you offer?",
    answer:
      "Our verified portfolio includes fully furnished plug-and-play offices, managed corporate suites, flexible coworking setups, and commercial bare-shell spaces suitable for teams of all sizes across Noida.",
    category: "Space Types",
  },
  {
    id: "faq-3",
    question: "Are all commercial properties listed on your platform legally verified?",
    answer:
      "Yes, 100% of properties in our directory undergo physical inspection, title verification, occupancy certificate (OC) checks, and developer authenticity audits before listing.",
    category: "Verification & Trust",
  },
  {
    id: "faq-4",
    question: "Can we get customized office layouts and dedicated team cabins in Noida?",
    answer:
      "Yes, we provide built-to-suit and customized workspace layouts. You can request specific workstation counts, executive cabins, conference rooms, server setups, and reception layouts tailored to your company's workflow.",
    category: "Customization",
  },
  {
    id: "faq-5",
    question: "How can I schedule a guided site visit for office spaces in Noida?",
    answer:
      "You can easily schedule a guided site inspection by sharing your requirements through our online form. Our Noida commercial property specialist will arrange priority walkthroughs at your convenience.",
    category: "Site Visits",
  },
  {
    id: "faq-6",
    question: "Do you provide end-to-end leasing assistance and documentation support?",
    answer:
      "Yes, we offer complete end-to-end support including space shortlisting, commercial terms negotiation, legal lease deed drafting, stamp duty guidance, and final possession handover.",
    category: "Leasing Support",
  },
];
