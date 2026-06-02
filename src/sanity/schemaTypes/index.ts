import { type SchemaTypeDefinition } from "sanity";

import { schemaTypes } from "../schemas";
import { aboutPage } from "./aboutPage";
import { category } from "./category";
import { contactPage } from "./contactPage";
import { downloadResource } from "./downloadResource";
import { guestOtp } from "./guestOtp";
import { homePage } from "./homePage";
import { founder } from "./founder";
import { industry } from "./industry";
import { portfolio } from "./portfolio";
import { post } from "./post";
import { industriesPage } from "./industriesPage";
import { order } from "./order";
import { portfolioPage } from "./portfolioPage";
import { resourcesPage } from "./resourcesPage";
import { service } from "./service";
import { servicesPage } from "./servicesPage";
import { shopPage } from "./shopPage";
import { testimonial } from "./testimonial";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    ...schemaTypes,
    category,
    industry,
    portfolio,
    founder,
    post,
    aboutPage,
    resourcesPage,
    downloadResource,
    contactPage,
    service,
    servicesPage,
    portfolioPage,
    industriesPage,
    shopPage,
    order,
    guestOtp,
    testimonial,
    homePage,
  ],
};
