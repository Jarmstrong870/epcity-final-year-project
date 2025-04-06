import React from 'react';
import './PrivacyPolicy.css';
import translations from '../locales/translations_privacypolicy';
import epcLogo from '../assets/EPCITY-LOGO-UPDATED.png';  // Importing the EPCity logo

const PrivacyPolicy = ({ language }) => {
  const t = translations[language] || translations.en;

  return (
    <div className="privacy-policy-container">
      {/* EPCity Logo */}
      <img src={epcLogo} alt="EPCity Logo" className="privacy-epc-logo" />

      <h1>{t.footerPrivacyPolicy}</h1>

      <section>
        <h2>{t.dataCollection || "Data Collection"}</h2>
        <p>
          {t.dataCollectionContent ||
            "To help personalise your experience, we collect personal information including your name, email address, and property preferences when you register on our platform."}
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
            "We do not share your personal data with third parties without your consent unless it is necessary to devlier our services or required by law."}
        <p>
            {
              "All third-party partners are subject to strict confidentiality obligations."
            }
        </p>
          
      </p>
      </section>

      <section>
        <h2>{t.dataProtection || "Data Protection"}</h2>
        <p>
          {"Your privacy is our top focus."}
        <p>
          {
            "We employ industry standard security measures to comply with GDPR regulations and safeguard your personal information against unauthorized access, loss or misuse."
          }
        </p>
        </p>
      </section>

      <section>
        <h2>{t.contactUs || "Contact Us"}</h2>
        <p>
           If you have any questions or concerns regarding our privacy practices, please reach out to us at <strong>support@epcity.com</strong>
        </p>

        <p>
           Here at EPCity, we are happy to help!
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
