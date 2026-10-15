import { Link } from "react-router-dom";
import GuestLayout from "../layout/Guest";
import Pricing from "./price";
import Faqs from "../Components/Faqs/Faqs";
import {
  FeaturesSection,
  FinalCta,
  HowItWorksSection,
  ImpactSection,
  LandingHero,
  RoiSection,
  SavingsCalculator,
  TrustSection,
} from "../Components/Landing";
import { PATH_PAGES } from "../routes";
import classes from "../styles/Home.module.scss";

export default function Home() {
  return (
    <>
      <>
        <title>Runanalytic Invoice</title>
        <meta
          name="description"
          content="Explore our versatile dashboard website template featuring a stunning array of themes and meticulously crafted components. Elevate your web project with seamless integration, customizable themes, and a rich variety of components for a dynamic user experience. Effortlessly bring your data to life with our intuitive dashboard template, designed to streamline development and captivate users. Discover endless possibilities in design and functionality today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo (2).jpg" />
      </>
      <GuestLayout variant="landing">
        <LandingHero />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RoiSection />
        <ImpactSection />
        <SavingsCalculator />

        <section
          id="pricing"
          className={`${classes.section} ${classes.pricingSection} ${classes.bgBase}`}
          aria-labelledby="pricing-title"
        >
          <Pricing />
        </section>

        <section
          className={`${classes.section} ${classes.bgBase}`}
          aria-labelledby="faq-title"
        >
          <Faqs />
        </section>

        <section
          id="support"
          className={`${classes.section} ${classes.bgBase}`}
          aria-labelledby="support-title"
        >
          <div className={classes.support}>
            <h2 id="support-title" className={classes.supportTitle}>
              Still have questions?
            </h2>
            <div className={classes.supportActions}>
              <Link to={PATH_PAGES.contact} className={classes.supportLink}>
                Contact us <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link to={PATH_PAGES.privacy} className={classes.supportLink}>
                Privacy policy <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        <FinalCta />
      </GuestLayout>
    </>
  );
}
