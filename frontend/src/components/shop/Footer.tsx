'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api-client';

interface SocialSettings {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [social, setSocial] = useState<SocialSettings>({});

  useEffect(() => {
    fetchSocialSettings();
  }, []);

  const fetchSocialSettings = async () => {
    try {
      const response = await api.settings.get() as any;
      if (response.social) {
        setSocial(response.social);
      }
    } catch (error) {
      console.error('Failed to fetch social settings:', error);
    }
  };

  // Count how many social links are enabled
  const hasSocialLinks = !!(social.facebook || social.instagram || social.twitter);

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <Image
                src="/images/fomer_logo.png"
                alt="Former Mobilya"
                width={160}
                height={50}
                className="h-12 w-auto mb-4"
              />
              <p className="text-muted-foreground">
                Modern ve kaliteli mobilya çözümleri ile hayalinizdeki mekanları yaratıyoruz.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-muted-foreground hover:text-foreground">
                  Mağazalarımız
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Müşteri Hizmetleri</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/delivery" className="text-muted-foreground hover:text-foreground">
                  Teslimat & Montaj
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                  İade & Garanti
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">İletişim</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="tel:+905551234567" className="hover:text-foreground">
                  +90 555 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:info@fomermobilya.com" className="hover:text-foreground">
                  info@fomermobilya.com
                </a>
              </li>
              {hasSocialLinks && (
                <li className="pt-2">
                  <div className="flex gap-4">
                    {social.instagram && (
                      <a 
                        href={social.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-foreground transition-colors" 
                        aria-label="Instagram"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                    {social.facebook && (
                      <a 
                        href={social.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-foreground transition-colors" 
                        aria-label="Facebook"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                    {social.twitter && (
                      <a 
                        href={social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-foreground transition-colors" 
                        aria-label="X (Twitter)"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <p>© {currentYear} Fomer Mobilya. Tüm hakları saklıdır.</p>
            <span className="text-muted-foreground/50">•</span>
            <Link href="/login?redirect=/admin" className="text-muted-foreground/70 hover:text-foreground transition-colors text-xs">
              Admin
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">
              Kullanım Koşulları
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Gizlilik Politikası
            </Link>
            <Link href="/kvkk" className="hover:text-foreground">
              KVKK
            </Link>
            <Link href="/distance-sales" className="hover:text-foreground">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
