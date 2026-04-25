import { TextPageLayout } from "@/components/ui/TextPageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – FIFO Calculator",
  description: "Privacy policy for FIFO Calculator.",
};

export default function PrivacyPolicy() {
  return (
    <TextPageLayout title="Privacy Policy">
      <p>
        <strong>Last updated: April 2025</strong>
      </p>

      <h2>Overview</h2>
      <p>
        FIFO Calculator (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a
        free, browser-based pay estimator for FIFO workers in Australia. We are
        committed to protecting your privacy. This policy explains what
        information we collect (if any) and how we use it.
      </p>

      <h2>No personal data collected</h2>
      <p>
        FIFO Calculator does not collect, store, or transmit any personal information.
        All calculations run entirely in your browser. No pay figures, tax
        settings, or roster details you enter are sent to any server or saved
        anywhere.
      </p>

      <h2>No accounts or registration</h2>
      <p>
        There are no user accounts, sign-ups, or login systems on this site.
        You do not need to provide any personal information to use the
        calculator.
      </p>

      <h2>Infrastructure</h2>
      <p>
        This site is hosted on{" "}
        <a
          href="https://aws.amazon.com/amplify/"
          target="_blank"
          rel="noopener noreferrer"
        >
          AWS Amplify
        </a>{" "}
        and uses{" "}
        <a
          href="https://www.cloudflare.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cloudflare
        </a>{" "}
        for DNS. Cloudflare may collect aggregated, anonymised traffic data
        (such as the number of requests to the site) as part of its standard DNS
        and network services. This data is not linked to any individual user and
        is governed by{" "}
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cloudflare&apos;s Privacy Policy
        </a>
        . AWS Amplify hosting is governed by the{" "}
        <a
          href="https://aws.amazon.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          AWS Privacy Notice
        </a>
        .
      </p>

      <h2>Cookies and tracking</h2>
      <p>
        FIFO Calculator does not use cookies, tracking pixels, analytics scripts, or
        any third-party tracking technology.
      </p>

      <h2>Third-party links</h2>
      <p>
        This site may contain links to external websites. We are not responsible
        for the privacy practices of those sites and encourage you to review
        their policies separately.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Any changes will be
        reflected on this page with an updated date at the top.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions about this privacy policy, you can reach us at <a href="mailto:info@fifocalculator.net">info@fifocalculator.net</a>.
      </p>
    </TextPageLayout>
  );
}
