import { defineField, defineType } from "sanity";

export const guestOtp = defineType({
  name: "guestOtp",
  title: "Guest OTP (temporary)",
  type: "document",
  readOnly: true,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "code",
      title: "OTP Code",
      type: "string",
      validation: (Rule) => Rule.required().length(4),
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
