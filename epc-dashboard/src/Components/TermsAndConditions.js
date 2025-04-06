import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p>Effective Date: March 2025</p>
      </div>

      <div className="terms-content">
        <h2>1. Introduction</h2>
        <p>
          Welcome to EPCity. By accessing our website and services, you agree to the 
          following terms and conditions. If you do not agree, please discontinue use 
          of our platform.
        </p>

        <h2>2. User Responsibilities</h2>
        <p>By using EPCity, you agree that:</p>
        <ul>
          <li><strong>1.</strong> You will provide accurate and lawful information when registering an account.</li>
          <li><strong>2.</strong> You will not use our platform for fraudulent or illegal activities.</li>
          <li><strong>3.</strong> You will not engage in harmful behaviour such as hacking, spamming, or misusing property listings.</li>
          <li><strong>4.</strong> You are responsible for safeguarding your login credentials.</li>
        </ul>

        <h2>3. Property Listings & Accuracy</h2>
        <p>
          While we strive to provide accurate property data, EPCity does not guarantee the 
          completeness, reliability, or accuracy of property listings.
        </p>
        <p>
          Property details provided by third parties including: 
        </p>
        <ul>
          <li><strong>1. EPC Open Data Communities</strong></li>
          <li><strong>2. Google Maps API</strong></li>
          <li><strong>3.Office of National Statistics</strong> </li>
        </ul>
        <p>
          Users should ensure they conduct independent research before making final decisions.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          EPCity may contain links to third-party websites. We are not responsible for 
          the content or services provided by external sites and advise users to review 
          their policies before engaging.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          EPCity is not liable for any direct, indirect, or incidental damages resulting 
          from the use of our platform, including but not limited to loss of data, 
          financial loss, or system downtime.
        </p>

        <h2>6. Account Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these 
          Terms & Conditions without prior notice.
        </p>

        <h2>7. Governing Law</h2>
        <p>
          These terms are governed by UK law. Any disputes shall be subject to the 
          jurisdiction of the courts of England and Wales.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about these Terms & Conditions, please contact us at: 
          <a href="mailto:support@epcity.co.uk"> support@epcity.co.uk</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
