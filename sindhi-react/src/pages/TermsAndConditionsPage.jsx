import React from 'react';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="font-display text-2xl font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">{title}</h2>
        {children}
    </div>
);

const SubSection = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-3">{title}</h3>
        {children}
    </div>
);

const P = ({ children }) => (
    <p className="text-neutral-600 leading-relaxed mb-3">{children}</p>
);

const TermsAndConditionsPage = () => {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-primary to-primary/80 py-16 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Terms and Conditions</h1>
                    <p className="text-white/70 text-sm">Last updated: June 15, 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-14">
                <P>Please read these terms and conditions carefully before using Our Service.</P>

                <Section title="Interpretation and Definitions">
                    <SubSection title="Interpretation">
                        <P>
                            The words whose initial letters are capitalized have meanings defined under the following conditions.
                            The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                        </P>
                    </SubSection>

                    <SubSection title="Definitions">
                        <P>For the purposes of these Terms and Conditions:</P>
                        <ul className="list-disc list-outside ml-5 space-y-3 text-neutral-600 leading-relaxed mb-3">
                            <li><strong>Affiliate</strong> means an entity that controls, is controlled by, or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
                            <li><strong>Country</strong> refers to: Haryana, India</li>
                            <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in these Terms and Conditions) refers to Sindhi Namkeen DryFruit.</li>
                            <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
                            <li><strong>Service</strong> refers to the Website.</li>
                            <li><strong>Terms and Conditions</strong> (also referred to as "Terms") means these Terms and Conditions, including any documents expressly incorporated by reference, which govern Your access to and use of the Service and form the entire agreement between You and the Company regarding the Service.</li>
                            <li><strong>Third-Party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third party that is displayed, included, made available, or linked to through the Service.</li>
                            <li><strong>Website</strong> refers to Sindhi Namkeen DryFruit, accessible from <span className="text-primary font-medium">sindhinamkeendryfruit.com</span>.</li>
                            <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                        </ul>
                    </SubSection>
                </Section>

                <Section title="Acknowledgment">
                    <P>
                        These are the Terms and Conditions governing the use of this Service and the agreement between You and
                        the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
                    </P>
                    <P>
                        Your access to and use of the Service is conditioned on Your acceptance of and compliance with these
                        Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
                    </P>
                    <P>
                        By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree
                        with any part of these Terms and Conditions then You may not access the Service.
                    </P>
                    <P>
                        You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
                    </P>
                    <P>
                        Your access to and use of the Service is also subject to Our Privacy Policy, which describes how We
                        collect, use, and disclose personal information. Please read Our Privacy Policy carefully before using Our Service.
                    </P>
                </Section>

                <Section title="Links to Other Websites">
                    <P>
                        Our Service may contain links to third-party websites or services that are not owned or controlled by the Company.
                    </P>
                    <P>
                        The Company has no control over, and assumes no responsibility for, the content, privacy policies, or
                        practices of any third-party websites or services. You further acknowledge and agree that the Company
                        shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to
                        be caused by or in connection with the use of or reliance on any such content, goods or services
                        available on or through any such websites or services.
                    </P>
                    <P>
                        We strongly advise You to read the terms and conditions and privacy policies of any third-party
                        websites or services that You visit.
                    </P>
                </Section>

                <Section title="Links from a Third-Party Social Media Service">
                    <P>
                        The Service may display, include, make available, or link to content or services provided by a
                        Third-Party Social Media Service. A Third-Party Social Media Service is not owned or controlled by
                        the Company, and the Company does not endorse or assume responsibility for any Third-Party Social Media Service.
                    </P>
                    <P>
                        You acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly,
                        for any damage or loss caused or alleged to be caused by or in connection with Your access to or use
                        of any Third-Party Social Media Service, including any content, goods, or services made available
                        through them. Your use of any Third-Party Social Media Service is governed by that Third-Party Social
                        Media Service's terms and privacy policies.
                    </P>
                </Section>

                <Section title="Termination">
                    <P>
                        We may terminate or suspend Your access immediately, without prior notice or liability, for any reason
                        whatsoever, including without limitation if You breach these Terms and Conditions.
                    </P>
                    <P>Upon termination, Your right to use the Service will cease immediately.</P>
                </Section>

                <Section title="Limitation of Liability">
                    <P>
                        Notwithstanding any damages that You might incur, the entire liability of the Company and any of its
                        suppliers under any provision of these Terms and Your exclusive remedy for all of the foregoing shall
                        be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased
                        anything through the Service.
                    </P>
                    <P>
                        To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be
                        liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not
                        limited to, damages for loss of profits, loss of data or other information, for business interruption,
                        for personal injury, loss of privacy arising out of or in any way related to the use of or inability
                        to use the Service, third-party software and/or third-party hardware used with the Service, or
                        otherwise in connection with any provision of these Terms), even if the Company or any supplier has
                        been advised of the possibility of such damages and even if the remedy fails of its essential purpose.
                    </P>
                    <P>
                        Some states do not allow the exclusion of implied warranties or limitation of liability for incidental
                        or consequential damages, which means that some of the above limitations may not apply. In these
                        states, each party's liability will be limited to the greatest extent permitted by law.
                    </P>
                </Section>

                <Section title='"AS IS" and "AS AVAILABLE" Disclaimer'>
                    <P>
                        The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without
                        warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own
                        behalf and on behalf of its Affiliates and its and their respective licensors and service providers,
                        expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to
                        the Service, including all implied warranties of merchantability, fitness for a particular purpose,
                        title and non-infringement, and warranties that may arise out of course of dealing, course of
                        performance, usage or trade practice.
                    </P>
                    <P>
                        Without limiting the foregoing, neither the Company nor any of the company's provider makes any
                        representation or warranty of any kind, express or implied: (i) as to the operation or availability
                        of the Service, or the information, content, and materials or products included thereon; (ii) that
                        the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency
                        of any information or content provided through the Service; or (iv) that the Service, its servers,
                        the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan
                        horses, worms, malware, timebombs or other harmful components.
                    </P>
                </Section>

                <Section title="Governing Law">
                    <P>
                        The laws of the Country, excluding its conflicts of law rules, shall govern these Terms and Your use
                        of the Service. Your use of the Application may also be subject to other local, state, national, or
                        international laws.
                    </P>
                </Section>

                <Section title="Disputes Resolution">
                    <P>
                        If You have any concern or dispute about the Service, You agree to first try to resolve the dispute
                        informally by contacting the Company.
                    </P>
                </Section>

                <Section title="For European Union (EU) Users">
                    <P>
                        If You are a European Union consumer, you will benefit from any mandatory provisions of the law of
                        the country in which You are resident.
                    </P>
                </Section>

                <Section title="United States Legal Compliance">
                    <P>
                        You represent and warrant that (i) You are not located in a country that is subject to the United
                        States government embargo, or that has been designated by the United States government as a "terrorist
                        supporting" country, and (ii) You are not listed on any United States government list of prohibited
                        or restricted parties.
                    </P>
                </Section>

                <Section title="Severability and Waiver">
                    <SubSection title="Severability">
                        <P>
                            If any provision of these Terms is held to be unenforceable or invalid, such provision will be
                            changed and interpreted to accomplish the objectives of such provision to the greatest extent
                            possible under applicable law and the remaining provisions will continue in full force and effect.
                        </P>
                    </SubSection>
                    <SubSection title="Waiver">
                        <P>
                            Except as provided herein, the failure to exercise a right or to require performance of an
                            obligation under these Terms shall not affect a party's ability to exercise such right or require
                            such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of
                            any subsequent breach.
                        </P>
                    </SubSection>
                </Section>

                <Section title="Translation Interpretation">
                    <P>
                        These Terms and Conditions may have been translated if We have made them available to You on our
                        Service. You agree that the original English text shall prevail in the case of a dispute.
                    </P>
                </Section>

                <Section title="Changes to These Terms and Conditions">
                    <P>
                        We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a
                        revision is material We will make reasonable efforts to provide at least 30 days' notice prior to
                        any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.
                    </P>
                    <P>
                        By continuing to access or use Our Service after those revisions become effective, You agree to be
                        bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop
                        using the Service.
                    </P>
                </Section>

                <Section title="Contact Us">
                    <P>If you have any questions about these Terms and Conditions, You can contact us:</P>
                    <div className="inline-flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3">
                        <span className="text-neutral-600">By email:</span>
                        <a
                            href="mailto:sindhinamkeen250@gmail.com"
                            className="text-primary font-semibold hover:underline"
                        >
                            sindhinamkeen250@gmail.com
                        </a>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
