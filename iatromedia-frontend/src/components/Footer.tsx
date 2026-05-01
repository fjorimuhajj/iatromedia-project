import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1240px] px-4">

        {/* Powered by - lart djathtas */}
        <div className="flex justify-end py-3">
          <p className="text-sm text-gray-500">
            Mundësuar nga{" "}
            <a href="https://nexmedia.gr" className="font-semibold underline">
              nexmedia.gr
            </a>
          </p>
        </div>

        {/* Viza ndarëse */}
        <hr className="border-gray-300" />

        {/* Logo - poshtë majtas */}
        <div className="flex items-center justify-start py-6">
          <Link href="/">
            <Image
              src="/iatromedia-logo.png"
              alt="Iatromedia Group"
              width={980}
              height={255}
              className="h-auto w-[250px] md:w-[320px]"
            />
          </Link>
        </div>

      </div>
    </footer>
  );
}