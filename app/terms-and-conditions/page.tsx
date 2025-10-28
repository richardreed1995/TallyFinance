import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsAndConditionsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
          
          <div className="prose prose-sm text-gray-700 leading-relaxed space-y-6">
            <div className="space-y-4">
              <p>
                These Terms & Conditions of Use (the Terms) set out the terms by which you may make use of our website www.tallyfinance.co.uk (the Website). Use of the Website includes accessing, browsing, or making an enquiry via the Website.
              </p>
              <p>
                It is important that you carefully read these Terms before you use the Website, as they apply to your use of the Website. Please feel free to download or print a copy of these Terms for your own future reference. It is your responsibility to ensure you are aware of the nature of these Terms and how they may affect your use of the Website.
              </p>
              <p>
                By using the Website, you confirm that you accept these Terms and that you agree to comply with them. If you do not agree to these Terms, you should exit the Website immediately and we request that you do not use our service.
              </p>
              <p>
                For information on how we use personal data that we may collect through the Website and/or in relation to the services that we provide via the Website, please see our Privacy Policy. For details on our use of Cookies, please see our Cookies Policy. Both our Privacy Policy and our Cookies Policy are incorporated by reference into this document.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. About Us</h2>
              <p>TallyFinance is a trading name of Surf Marketing Ltd, who function as a lead generator.</p>
              <p>Company Registration: Surf Marketing Ltd is registered in England and Wales, company number 14952633.</p>
              <p>ICO Registration: Surf Marketing Ltd is registered with the Information Commissioner's Office (ICO).</p>
              <p>Registered Office Address: Office Suite 5, 5th Floor, City Reach, 5 Greenwich View Place, London, United Kingdom, E14 9NN</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Our Service</h2>
              <p>The Website is owned and operated by Surf Marketing Ltd.</p>
              <p>By submitting an enquiry through our form, you will be giving your consent for Surf Marketing Ltd to match your enquiry with our panel of regulated brokers and lenders. We will present your enquiry in real-time to our panel of regulated brokers and lenders. If a regulated broker or lender accepts your enquiry, you will be contacted directly by them to discuss your needs.</p>
              <p>It is also important to understand that we may be paid a fee by the regulated brokers and lenders for introducing you to them.</p>
              <p>You should read their terms and conditions carefully and make a responsible decision on whether you believe their service is right for you. If you have any questions or are unsure, you should contact the regulated broker or lender before taking out any service with them.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Accessing the Website</h2>
              <p>Access to the Website is permitted on a temporary basis, and we reserve the right to withdraw or amend the service which we provide on the Website without notice (see below). We will not be liable if for any reason the Website is unavailable at any time or for any period.</p>
              <p>From time to time, we may restrict access to some parts of the Website, or the entire Website, to users who have submitted enquiries with us.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property Rights</h2>
              <p>All Intellectual Property Rights (including, without limitation, all database rights, rights in designs, rights in know-how, patents and rights in inventions (in all cases whether registered or unregistered and including all rights to apply for registration) and all other intellectual or industrial property rights in any jurisdiction) in any information, content, materials, data or processes contained in or to this Website belong to Surf Marketing Ltd or its licensed source. All rights of Surf Marketing Ltd in such Intellectual Property Rights are hereby reserved.</p>
              <p>You may print off a copy, and may download extracts, of any page(s) from the Website for your personal use.</p>
              <p>You must not modify the paper or digital copies of any materials you have printed off or downloaded in any way, and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from any accompanying text.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Accuracy of Information</h2>
              <p>Surf Marketing Ltd does not represent that the information contained in this Website is accurate, comprehensive, verified or complete, and shall accept no liability for the accuracy or completeness of the information contained in this Website or for any reliance placed by any person on the information.</p>
              <p>We aim to update our site regularly and may change the content at any time. If the need arises, we may suspend access to our site, or close it indefinitely.</p>
              <p>We reserve the right to change these terms and conditions at any time by posting changes on the Website. It is your responsibility to review the Website terms and conditions regularly to ensure you are aware of the latest terms and conditions. Your use of this Website after a change has been posted will be deemed to signify your acceptance of the modified terms and conditions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Liability</h2>
              <p>To the extent permitted by law, we exclude all conditions, warranties, representations, or other terms which may apply to the Website or any content on it, whether express or implied.</p>
              <p>We cannot guarantee that the regulated brokers or lenders will authorise any particular enquiry. This may be as a result, directly or indirectly, of a systems problem, issues which are unforeseeable or outside of our control or that of the regulated brokers or lenders, or because information has been provided incorrectly.</p>
              <p>We shall not be liable for any loss you may suffer unless we have been negligent or not acted in accordance with these Terms and Conditions or unless otherwise required by UK law. In the event that you do not use this form with reasonable care and in accordance with these terms and conditions, or we discover or are notified that you are using this form fraudulently, we, the lender, broker, or service provider reserve the right to charge you for any reasonable costs that we may incur in taking action to stop you using the form and recover any monies owed as a result of your activities.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Communication and Marketing</h2>
              <p>Unless stated otherwise, we and our panel of regulated brokers and lenders will contact you via email and SMS to provide information and alerts relating to your enquiry and/or services we think may be of interest to you.</p>
              <p>Soft opt-in is an exception to the general requirement to obtain consent before sending direct marketing to you by electronic means (such as email or text message, for example) and applies where you have previously engaged with us (for example, by submitting your contact details on our website to make an enquiry about Our Service), and we are marketing our similar products and services. Under the 'soft opt-in', we will assume you still want to hear about our other related products and services until you opt out or unsubscribe. For most customers, this is beneficial as it allows us to tell you about our other similar products and services that we think would be useful to you alongside the specific one you originally expressed an interest in.</p>
              <p>We will only contact you in response to a request or communication from you or under the soft opt-in. We will not send unsolicited marketing communications to you about any other types of products or services.</p>
              <p>You can opt out of any contact from us at any time by clicking on the links within the SMS/email or by emailing us at info@tallyfinance.co.uk.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Acceptable Use</h2>
              <p>You may only use our site and form for lawful purposes. You may not use our site/form:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>In any way that breaches any applicable local, national, or international law or regulation</li>
                <li>In any way that is unlawful or fraudulent or has any unlawful or fraudulent purpose or effect</li>
                <li>To upload or transmit through the form any computer viruses or anything else designed to interfere with, interrupt or disrupt the normal operating procedures of a computer</li>
                <li>To upload or transmit through the form any material which is defamatory, offensive or of an obscene character</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Links from the Website</h2>
              <p>Where our site contains links to other sites and resources provided by third parties, these links are provided for your information only. We have no control over the contents of those sites or resources and accept no responsibility for them or for any loss or damage that may arise from your use of them.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Jurisdiction</h2>
              <p>The Website and form are controlled and operated in the United Kingdom. These Terms and any non-contractual obligations arising out of or in connection with these Terms will be governed by the laws of England and Wales, and you irrevocably agree to submit to the exclusive jurisdiction of the English courts.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Your Right to be Forgotten / Erasure of Your Personal Information</h2>
              <p>Under the General Data Protection Regulation (GDPR), all individuals have the right to request the deletion or removal of personal data (the right to be forgotten) under the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Where the personal data is no longer necessary in relation to the purpose for which it was originally collected/processed</li>
                <li>When the individual withdraws consent</li>
                <li>When the individual objects to the processing and there is no overriding legitimate interest for continuing the processing</li>
                <li>The personal data was unlawfully processed (i.e. otherwise in breach of the GDPR)</li>
                <li>The personal data has to be erased in order to comply with a legal obligation</li>
                <li>The personal data is processed in relation to the offer of information society services to a child</li>
              </ul>
              <p>There are some circumstances where the right "to be forgotten" does not apply, i.e. where we need to comply with a legal obligation.</p>
              <p>If you wish to request your "right to be forgotten", please email: info@tallyfinance.co.uk</p>
              <p>You have certain rights under the General Data Protection Regulations. For example, we will always let you have a copy of the personal information we hold about you, if you request it from us in writing.</p>
              
              <p><strong>Right to be informed</strong> – when we collect your data, we have to tell you what we are going to do with it, primarily through this Privacy Policy and within the opt-in/consent statement.</p>
              
              <p><strong>Right to Object</strong> – because you have asked us to help you find a financial product or service, we need to process the personal information you give us to enable us to help you find the best product or service available amongst our panel of regulated brokers and lenders. You can object to this processing at any time by sending us an email at info@tallyfinance.co.uk. We will action any request you make promptly, although this will mean that we will not be able to help you find the financial product or service that you asked us to search for.</p>
              
              <p><strong>Right of Access</strong> – you can ask us at any time to confirm whether we hold your personal information, and if so, you can access it by emailing us at info@tallyfinance.co.uk.</p>
              
              <p><strong>Right to Rectification</strong> – if we hold personal information about you that is inaccurate, you can ask us to correct it, and we will do this as quickly as possible.</p>
              
              <p><strong>Right to Erasure</strong> – if it is no longer necessary for us to hold your personal information bearing in mind the reason why you provided it to us, you can ask us to delete it. If you ask us to do this, we will delete your personal information as soon as possible, although this will mean that we may not be able to help you find the financial product or service that you asked us to search for.</p>
              
              <p><strong>Right to restrict our use of your information</strong> – you can ask us to restrict our processing of your personal information if you think, for example, that the personal information you gave us is inaccurate. This may mean that we may not be able to help you find the financial product or service that you asked us to search for.</p>
              
              <p><strong>Right to data portability</strong> – this gives you the right to ask a holder of your information to transfer that information to another business. This right would most commonly be used if you were switching banks, insurance companies and utility companies.</p>
              
              <p><strong>Right related to automated decision-making including profiling</strong> – You have a right to object to automated decision-making, to express your point of view, ask for human intervention, and to be provided with an explanation of the decision with your option to challenge it. You can request this by emailing us at info@tallyfinance.co.uk.</p>
              
              <p><strong>Right to complain to the Information Commissioner's Office (ICO)</strong> – we will try to resolve any complaint that you may have in relation to data protection issues. If you are not happy with our final response, you have the right to have your complaint dealt with by the ICO. Please refer to our Complaints section below for further information.</p>
              
              <p>To make enquiries and/or exercise any of your rights set out in this Privacy Policy, please contact our Customer Services Team at info@tallyfinance.co.uk.</p>
              
              <p>Our marketing partners will also be informed of your right to be forgotten should you also request this.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Complaints</h2>
              <p>We always aim to be fair and honest in everything we do, so if you have a complaint about any aspect of our service, we're keen to resolve it as quickly as possible. You can contact us in any of the following ways:</p>
              <p>By Email: info@tallyfinance.co.uk</p>
              <p>By Post:<br />
              Surf Marketing Ltd<br />
              Office Suite 5, 5th Floor, City Reach<br />
              5 Greenwich View Place<br />
              London, United Kingdom<br />
              E14 9NN</p>
            </section>

            <section className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">Last Updated: 25th October 2025</p>
              <p className="mt-4 text-sm text-gray-600">© Surf Marketing Ltd 2025. All rights reserved. Registered with the Information Commissioner's Office (ICO). Registered in England and Wales, company number 14952633. Registered Office Address: Office Suite 5, 5th Floor, City Reach, 5 Greenwich View Place, London, United Kingdom, E14 9NN.</p>
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




