import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontakt | Iatromedia Group",
  description: "Na kontaktoni përmes formës së kontaktit.",
};

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Header />

      <div className="bg-sky-600 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-6">
          <h1 className="text-[22px] font-semibold tracking-tight md:text-[28px]">
            Kontakt
          </h1>
          <nav className="text-[13px] text-white/95 md:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">
              Kreu
            </Link>
            <span className="mx-2 text-white/70">/</span>
            <span className="font-medium">Kontakt</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-4 text-[15px] leading-[1.75] text-gray-600">
          <p>
            Iatromedia Group ofron një portali mjekësor me përmbajtje të besueshme, intervista,
            publikime të zgjedhura dhe informacion të specializuar për profesionistët shëndetësorë
            dhe publikun e gjerë.
          </p>
          <p>
            Për çdo pyetje, sugjerim ose bashkëpunim, mund të na shkruani përmes formës më poshtë.
            Ekipi ynë do t’ju përgjigjet sa më shpejt të jetë e mundur.
          </p>
        </div>

        <h2 className="mx-auto mt-12 mb-8 max-w-xl text-center text-[20px] font-semibold text-sky-600 md:text-[22px]">
          Forma e kontaktit
        </h2>

        <ContactForm />
      </section>

      <Footer />
    </main>
  );
}
