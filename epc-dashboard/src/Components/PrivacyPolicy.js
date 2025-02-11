import React from 'react';
import './PrivacyPolicy.css';
import translations from '../locales/translations_privacypolicy';
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png';  // Importing the EPCity logo

const PrivacyPolicy = ({ language }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="privacy-policy-container">
      {/* EPCity Logo */}
      <img src={epcLogo} alt="EPCity Logo" className="epc-logo" />

      <h1>{t.footerPrivacyPolicy}</h1>

      <section>
        <h2>{t.dataCollection || "Data Collection"}</h2>
        <p>
          {t.dataCollectionContent ||
            "We collect personal information such as your name, email address, and property preferences when you register on our platform."}
        </p>
      </section>

      <section>
        <h2>{t.dataUsage || "How We Use Your Data"}</h2>
        <p>
          {t.dataUsageContent ||
            "Your data is used to improve your user experience, personalize property recommendations, and ensure platform security."}
        </p>
      </section>

      <section>
        <h2>{t.thirdPartySharing || "Third-Party Sharing"}</h2>
        <p>
          {t.thirdPartySharingContent ||
            "We do not share your personal data with third parties without your consent, except where required by law."}
        </p>
      </section>

      <section>
        <h2>{t.dataProtection || "Data Protection"}</h2>
        <p>
          {t.dataProtectionContent ||
            "We employ strong security measures to protect your personal information from unauthorized access."}
        </p>
      </section>

      <section>
        <h2>{t.contactUs || "Contact Us"}</h2>
        <p>
          {t.contactUsContent ||
            "If you have any questions regarding this privacy policy, please contact us at support@epcity.com."}
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
