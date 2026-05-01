import { NextResponse } from "next/server";

type Body = {
  fullName?: string;
  mobile?: string;
  email?: string;
  message?: string;
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function strapiBaseUrl(): string {
  return (
    process.env.STRAPI_API_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337"
  );
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Kërkesë e pavlefshme" }, { status: 400 });
  }

  const fullName = (body.fullName || "").trim();
  const mobile = (body.mobile || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!fullName || !mobile || !email) {
    return NextResponse.json(
      { error: "Plotëso fushat e detyrueshme (emri, telefoni, email)." },
      { status: 400 }
    );
  }

  if (!emailOk(email)) {
    return NextResponse.json({ error: "Adresa e email-it nuk është e vlefshme." }, { status: 400 });
  }

  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.error(
      "[contact] Mungon STRAPI_API_TOKEN — vendose në .env (shiko .env.example)."
    );
    return NextResponse.json(
      {
        error:
          "Forma e kontaktit nuk është konfiguruar. Vendos STRAPI_API_TOKEN në server.",
      },
      { status: 503 }
    );
  }

  const base = strapiBaseUrl().replace(/\/$/, "");
  const strapiRes = await fetch(`${base}/api/contact-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        fullName,
        mobile,
        email,
        ...(message ? { message } : {}),
      },
    }),
  });

  if (!strapiRes.ok) {
    const errText = await strapiRes.text();
    console.error("[contact] Strapi error", strapiRes.status, errText);
    return NextResponse.json(
      { error: "Nuk u ruajt mesazhi. Provo më vonë ose na kontakto direkt." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
