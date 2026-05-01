import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type Body = {
  fullName?: string;
  mobile?: string;
  email?: string;
  message?: string;
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
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

  try {
    const host = requiredEnv("SMTP_HOST");
    const port = Number(process.env.SMTP_PORT || "587");
    const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    const user = requiredEnv("SMTP_USERNAME");
    const pass = requiredEnv("SMTP_PASSWORD");
    const from = process.env.SMTP_FROM || user;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: "Konfirmim: Mesazhi juaj u pranua",
      text: [
        `Përshëndetje ${fullName},`,
        "",
        "Faleminderit! Mesazhi juaj u pranua me sukses.",
        "",
        "Detajet:",
        `- Emri: ${fullName}`,
        `- Celular: ${mobile}`,
        `- Email: ${email}`,
        message ? "" : undefined,
        message ? "Mesazhi:" : undefined,
        message ? message : undefined,
        "",
        "Iatromedia Group",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact-email] send failed", err);
    return NextResponse.json(
      { error: "Nuk u dërgua email-i. Kontrollo konfigurimin e SMTP." },
      { status: 502 }
    );
  }
}

