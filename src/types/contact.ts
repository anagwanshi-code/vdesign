export type ContactOffice = {
  title?: string | null;
  address?: string | null;
};

export type ContactPageContent = {
  heading?: string | null;
  subheading?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  whatsapp?: string | null;
  workingHours?: string | null;
  googleMapUrl?: string | null;
  offices?: ContactOffice[] | null;
};

export type ContactOfficeItem = {
  id: string;
  title: string;
  address: string;
  mapLabel: string;
};

export type ContactInfoCardsProps = {
  email?: string;
  phone?: string;
  address?: string;
  whatsapp?: string;
  workingHours?: string;
};

export type ContactLayoutProps = {
  googleMapUrl?: string | null;
  offices?: ContactOffice[] | null;
};
