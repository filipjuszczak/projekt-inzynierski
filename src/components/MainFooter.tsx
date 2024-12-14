import Link from "next/link";

export default function MainFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">O nas</h3>
            <ul className="space-y-1">
              <li>
                <FooterLink href="/nasza-historia">Nasza historia</FooterLink>
              </li>
              <li>
                <FooterLink href="/kariera">Kariera</FooterLink>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Pomoc</h3>
            <ul className="space-y-1">
              <li>
                <FooterLink href="/faq">FAQ</FooterLink>
              </li>
              <li>
                <FooterLink href="/kontakt">Skontakuj się z nami</FooterLink>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Polityka prywatności</h3>
            <ul className="space-y-1">
              <li>
                <FooterLink href="/warunki-korzystania">
                  Warunki korzystania z usług
                </FooterLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-sm text-muted-foreground">
          © {currentYear} Sunema. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps extends React.PropsWithChildren {
  href: string;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link href={href} className="text-sm hover:underline">
      {children}
    </Link>
  );
}
