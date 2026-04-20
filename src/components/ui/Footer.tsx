import Link from "next/link";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact-us", label: "Contact Us" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-16 lg:px-32">
        <div>
          <nav aria-label="Footer main links">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground md:justify-start">
              {primaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="md:justify-self-end">
          <nav aria-label="Footer legal links">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground md:justify-end">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
