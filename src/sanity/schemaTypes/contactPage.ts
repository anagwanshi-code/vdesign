import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page Content",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Page Heading",
      type: "string",
      initialValue: "Let's Start a Conversation",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      initialValue:
        "Ready to elevate your brand? Fill out the form below or reach out directly.",
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Office Address",
      type: "text",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number",
      type: "string",
      initialValue: "+91 99982 19882",
    }),
    defineField({
      name: "workingHours",
      title: "Working Hours",
      type: "string",
      initialValue: "Mon - Sat: 10:00 AM - 7:00 PM",
    }),
    defineField({
      name: "googleMapUrl",
      title: "Google Map Embed URL (src)",
      type: "url",
      description: "Paste the src URL from Google Maps embed code",
    }),
    defineField({
      name: "offices",
      title: "Office Locations",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Office Title",
              type: "string",
              description: "e.g., Head Office — Surat",
            }),
            defineField({
              name: "address",
              title: "Full Address",
              type: "text",
            }),
          ],
        },
      ],
      initialValue: [
        {
          title: "Head Office — Surat",
          address:
            "6/78, Opp. Vigneshwar Mahadev, Kolsawad, B/s. Limra Hotel, Manchnharpura, Surat-395 003.",
        },
        {
          title: "Branch Office — Mumbai",
          address:
            "Office No. 12, 3rd Floor, Kupar Estate, Andheri East, Mumbai-400 069.",
        },
        {
          title: "Branch Office — Ahmedabad",
          address: "A-301, Safal Profitare, S.G. Highway, Ahmedabad-380 054.",
        },
      ],
    }),
  ],
});
