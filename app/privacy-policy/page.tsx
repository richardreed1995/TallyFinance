import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <span className="font-serif text-2xl font-bold text-gray-900">Tally</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          
          <div className="prose prose-sm text-gray-700 leading-relaxed space-y-6">
            <div className="space-y-4">
              <p>
                This Privacy Policy explains how TallyFinance (a trading name of Surf Marketing Ltd) collects, uses, stores, and protects your personal information when you use our website and services. We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR) and other applicable data protection legislation.
              </p>
              <p>
                Please read this Privacy Policy carefully. By using our website and services, you confirm that you accept this Privacy Policy and agree to comply with it. If you do not agree to this Privacy Policy, please do not use our website or services.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. About Us</h2>
              <p>TallyFinance</p>
              <p>TallyFinance is a trading name of Surf Marketing Ltd, who function as a lead generator.</p>
              <p>Company Registration: Surf Marketing Ltd is registered in England and Wales, company number 14952633.</p>
              <p>ICO Registration: Surf Marketing Ltd is registered with the Information Commissioner's Office (ICO).</p>
              <p>Registered Office Address: Office Suite 5, 5th Floor, City Reach, 5 Greenwich View Place, London, United Kingdom, E14 9NN</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
              <p>We may collect and process the following types of personal information about you:</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Information You Provide to Us</h3>
              <p>When you submit an enquiry through our website, you may provide us with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your name</li>
                <li>Contact details (email address, telephone number, postal address)</li>
                <li>Financial information relevant to your enquiry</li>
                <li>Business information (if applicable)</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Information We Collect Automatically</h3>
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Technical information including IP address, browser type and version, time zone setting, operating system and platform</li>
                <li>Information about your visit including pages you viewed, how you navigated the site, and time spent on pages</li>
                <li>Information collected through cookies and similar technologies (see our Cookies Policy for more details)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use your personal information for the following purposes:</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">To Provide Our Services</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>To match your enquiry with suitable regulated brokers and lenders from our panel</li>
                <li>To present your enquiry to relevant service providers</li>
                <li>To facilitate communication between you and potential service providers</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Communication</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>To contact you regarding your enquiry via email and SMS</li>
                <li>To provide you with information about our services and those of our partner organisations</li>
                <li>To send service updates and alerts relevant to your enquiry</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Marketing (Soft Opt-In)</h3>
              <p>Under the 'soft opt-in' exception, where you have engaged with us by submitting an enquiry, we may contact you about similar products and services that we believe may be of interest to you. We will assume you wish to receive these communications unless you opt out. You can opt out at any time by:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Clicking the unsubscribe link in any email</li>
                <li>Replying 'STOP' to SMS messages</li>
                <li>Emailing us at info@tallyfinance.co.uk</li>
              </ul>
              <p>We will not send unsolicited marketing communications about unrelated products or services.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Legal and Operational Requirements</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>To comply with legal obligations</li>
                <li>To prevent fraud and protect against unlawful activity</li>
                <li>To improve our website and services</li>
                <li>To monitor and analyse website usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Legal Basis for Processing</h2>
              <p>We process your personal information based on the following legal grounds:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Consent:</strong> When you submit an enquiry through our website, you provide consent for us to process your information and share it with our panel of regulated brokers and lenders</li>
                <li><strong>Legitimate Interests:</strong> To operate our business, improve our services, and communicate with you about similar services (soft opt-in)</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Sharing Your Information</h2>
              <p>We may share your personal information with:</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Regulated Brokers and Lenders</h3>
              <p>When you submit an enquiry, we will present your information in real-time to our panel of regulated brokers and lenders. If a broker or lender accepts your enquiry, they will contact you directly to discuss your requirements. These organisations may have their own privacy policies, and we encourage you to review them carefully.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Service Providers</h3>
              <p>We may share your information with trusted third-party service providers who assist us in operating our website and delivering our services, including IT service providers, payment processors, and marketing platforms. These providers are contractually obligated to keep your information secure and confidential.</p>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Legal Requirements</h3>
              <p>We may disclose your information if required by law, to comply with legal processes, to protect our rights and property, or to prevent fraud or illegal activity.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. International Data Transfers</h2>
              <p>Your personal information may be transferred to and processed in countries outside the United Kingdom and European Economic Area (EEA). Where we transfer your data internationally, we ensure appropriate safeguards are in place, such as standard contractual clauses approved by the European Commission or transfers to countries with adequacy decisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
              <p>We will retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>For the duration required to provide our services</li>
                <li>To comply with legal, regulatory, tax, accounting, or reporting requirements</li>
                <li>To establish, exercise, or defend legal claims</li>
              </ul>
              <p>When we no longer need your information, we will securely delete or anonymise it in accordance with our data retention policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Your Rights Under GDPR</h2>
              <p>Under the General Data Protection Regulation (GDPR), you have the following rights:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Right to be Informed:</strong> You have the right to clear information about how we collect and use your personal data</li>
                <li><strong>Right of Access:</strong> You can request a copy of the personal information we hold about you</li>
                <li><strong>Right to Rectification:</strong> You can ask us to correct inaccurate or incomplete personal information</li>
                <li><strong>Right to Erasure (Right to be Forgotten):</strong> You can request deletion of your personal data in certain circumstances</li>
                <li><strong>Right to Restrict Processing:</strong> You can ask us to restrict how we use your personal information</li>
                <li><strong>Right to Data Portability:</strong> You can request transfer of your personal data to another service provider</li>
                <li><strong>Right to Object:</strong> You can object to processing of your personal data for direct marketing purposes or based on legitimate interests</li>
                <li><strong>Rights Related to Automated Decision-Making:</strong> You have the right to object to automated decision-making and profiling</li>
              </ul>
              <p>To exercise any of these rights, please contact us at info@tallyfinance.co.uk. We will respond to your request within one month. Please note that exercising some of these rights may mean we are unable to continue providing our services to you.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Right to be Forgotten / Erasure</h2>
              <p>You have the right to request deletion of your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The personal data is no longer necessary for the purpose it was collected</li>
                <li>You withdraw your consent</li>
                <li>You object to processing and there is no overriding legitimate interest</li>
                <li>The personal data was unlawfully processed</li>
                <li>The personal data must be erased to comply with a legal obligation</li>
                <li>The personal data was collected in relation to information society services offered to a child</li>
              </ul>
              <p>Please note that this right does not apply in certain circumstances, such as where we need to retain your information to comply with a legal obligation.</p>
              <p>If you wish to exercise your right to be forgotten, please email us at info@tallyfinance.co.uk. We will inform our marketing partners of your request where applicable.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Security</h2>
              <p>We take the security of your personal information seriously and have implemented appropriate technical and organisational measures to protect it from unauthorised access, alteration, disclosure, or destruction. These measures include encryption, secure servers, access controls, and regular security assessments. However, please be aware that no method of transmission over the internet or electronic storage is completely secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Cookies</h2>
              <p>Our website uses cookies and similar tracking technologies to enhance your browsing experience and analyse website usage. For detailed information about the cookies we use and how to manage your cookie preferences, please see our Cookies Policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party websites you visit.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Children's Privacy</h2>
              <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it as soon as possible.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">14. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will post any changes on this page and, where appropriate, notify you by email or through a notice on our website. Please review this Privacy Policy regularly to stay informed about how we protect your information.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">15. Complaints</h2>
              <p>We are committed to resolving any concerns you may have about how we handle your personal data. If you wish to make a complaint, please contact us using the details below:</p>
              <p>By Email: info@tallyfinance.co.uk</p>
              <p>By Post: Surf Marketing Ltd, Office Suite 5, 5th Floor, City Reach, 5 Greenwich View Place, London, United Kingdom, E14 9NN</p>
              <p>If you are not satisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK's supervisory authority for data protection matters:</p>
              <p>Information Commissioner's Office<br />
              Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF<br />
              Telephone: 0303 123 1113<br />
              Website: www.ico.org.uk</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">16. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:</p>
              <p>Email: info@tallyfinance.co.uk<br />
              Post: Surf Marketing Ltd, Office Suite 5, 5th Floor, City Reach, 5 Greenwich View Place, London, United Kingdom, E14 9NN</p>
            </section>

            <section className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">Last Updated: 25th October 2025</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}




