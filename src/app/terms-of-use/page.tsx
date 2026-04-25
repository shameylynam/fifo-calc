import { TextPageLayout } from "@/components/ui/TextPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use – FIFO Calculator",
  description: "Terms of use for FIFO Calculator.",
};

export default function TermsOfUse() {
  return (
    <TextPageLayout title="Terms of Use">
      <p>
        <strong>Last updated: April 2025</strong>
      </p>

      <h2>Acceptance of terms</h2>
      <p>
        By accessing or using FIFO Calculator (&ldquo;the site&rdquo;,
        &ldquo;the calculator&rdquo;), you agree to be bound by these Terms of
        Use. If you do not agree, please do not use the site.
      </p>

      <h2>Description of service</h2>
      <p>
        FIFO Calculator is a free, browser-based tool that provides estimated
        after-tax pay calculations for FIFO workers in Australia. All
        calculations are performed locally in your browser and are intended for
        informational and illustrative purposes only.
      </p>

      <h2>Not financial or tax advice</h2>
      <p>
        The results provided by FIFO Calculator are estimates only and do not
        constitute financial, tax, legal, or professional advice. Actual pay may
        differ due to allowances, bonuses, employer-specific rules, salary
        sacrifice arrangements, PAYG withholding variations, and other factors.
        You should consult a qualified accountant or financial adviser before
        making any decisions based on figures from this tool.
      </p>

      <h2>No data storage</h2>
      <p>
        FIFO Calculator does not collect or store any data you enter. All inputs are
        processed entirely within your browser and are not transmitted to any
        server.
      </p>

      <h2>Accuracy and availability</h2>
      <p>
        We strive to keep the tax tables and calculation logic up to date, but
        we make no warranties, express or implied, regarding the accuracy,
        completeness, or fitness for purpose of the calculator results. The site
        is provided &ldquo;as is&rdquo; and may be unavailable from time to time
        due to maintenance or factors outside our control.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this site, including text, code, and design, is owned by
        or licensed to FIFO Calculator. You may not reproduce, distribute, or create
        derivative works without prior written permission, except as permitted
        by applicable law.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, FIFO Calculator and its operators
        will not be liable for any direct, indirect, incidental, or
        consequential loss or damage arising from your use of, or reliance on,
        this site or its results.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Australia. Any disputes will be
        subject to the exclusive jurisdiction of the courts of Australia.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the site
        after changes are posted constitutes your acceptance of the revised
        terms.
      </p>
    </TextPageLayout>
  );
}
