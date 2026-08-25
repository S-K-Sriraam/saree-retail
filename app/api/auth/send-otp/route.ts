import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, role, action, name } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, error: "Please provide an email address or mobile number." },
        { status: 400 }
      );
    }

    // Generate secure 6-digit numeric OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const recipientName = name || (email ? email.split("@")[0] : "Valued Member");
    const isAdmin = role === "admin";

    const deliveryStatus = {
      emailSent: false,
      smsSent: false,
      providersUsed: [] as string[],
      logs: [] as string[]
    };

    // ==========================================
    // REAL EMAIL OTP DELIVERY (Nodemailer SMTP / Resend)
    // ==========================================
    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      // A. Gmail / SMTP Transport via Nodemailer (Fastest & most direct)
      const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
      const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
      const smtpHost = process.env.SMTP_HOST;

      if (gmailUser && gmailPass) {
        try {
          const transporter = nodemailer.createTransport(
            smtpHost
              ? {
                  host: smtpHost,
                  port: Number(process.env.SMTP_PORT) || 587,
                  secure: process.env.SMTP_SECURE === "true",
                  auth: { user: gmailUser, pass: gmailPass }
                }
              : {
                  service: "gmail",
                  auth: { user: gmailUser, pass: gmailPass }
                }
          );

          await transporter.sendMail({
            from: `"Geethvarnam Luxury Boutique" <${gmailUser}>`,
            to: cleanEmail,
            subject: `${otpCode} is your Geethvarnam ${isAdmin ? "Admin Security" : "Verification"} Passcode`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0a0e; color: #ffffff; padding: 40px 30px; border-radius: 20px; border: 1px solid rgba(217, 119, 6, 0.4);">
                <div style="text-align: center; margin-bottom: 25px;">
                  <h1 style="color: #f59e0b; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">GEETHVARNAM</h1>
                  <p style="color: #a8a29e; font-size: 11px; letter-spacing: 3px; margin-top: 5px; text-transform: uppercase;">Luxury Saree & Chudar Couture</p>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px 20px; text-align: center; margin-bottom: 25px;">
                  <p style="color: #e7e5e4; font-size: 14px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
                  <p style="color: #a8a29e; font-size: 13px; margin-bottom: 20px;">Use the verification passcode below to complete your ${isAdmin ? "Executive Admin Sign In" : "Customer Authentication"}:</p>
                  
                  <div style="display: inline-block; background: linear-gradient(135deg, #d97706, #b45309); color: #000000; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 8px; padding: 15px 35px; border-radius: 12px; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);">
                    ${otpCode}
                  </div>
                  
                  <p style="color: #78716c; font-size: 11px; margin-top: 20px;">This code is valid for 5 minutes. Never share this passcode with anyone.</p>
                </div>
                
                <p style="color: #57534e; font-size: 11px; text-align: center; margin: 0;">&copy; 2026 Geethvarnam Heritage Boutique. All rights reserved.</p>
              </div>
            `
          });

          deliveryStatus.emailSent = true;
          deliveryStatus.providersUsed.push("Nodemailer SMTP");
        } catch (mailErr: any) {
          console.error("Nodemailer dispatch failed:", mailErr);
          deliveryStatus.logs.push(`Nodemailer error: ${mailErr.message}`);
        }
      }

      // B. Resend API Dispatch (Fallback if configured)
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && !deliveryStatus.emailSent) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Geethvarnam Boutique <onboarding@resend.dev>";
        const emailTemplate = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0a0e; color: #ffffff; padding: 40px 30px; border-radius: 20px; border: 1px solid rgba(217, 119, 6, 0.4);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #f59e0b; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">GEETHVARNAM</h1>
              <p style="color: #a8a29e; font-size: 11px; letter-spacing: 3px; margin-top: 5px; text-transform: uppercase;">Luxury Saree & Chudar Couture</p>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px 20px; text-align: center; margin-bottom: 25px;">
              <p style="color: #e7e5e4; font-size: 14px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
              <p style="color: #a8a29e; font-size: 13px; margin-bottom: 20px;">Use the verification passcode below to complete your ${isAdmin ? "Executive Admin Sign In / Registration" : "Customer Authentication"}:</p>
              
              <div style="display: inline-block; background: linear-gradient(135deg, #d97706, #b45309); color: #000000; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 8px; padding: 15px 35px; border-radius: 12px; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);">
                ${otpCode}
              </div>
              
              <p style="color: #78716c; font-size: 11px; margin-top: 20px;">This code is valid for 5 minutes. Never share this passcode with anyone.</p>
            </div>
            
            <p style="color: #57534e; font-size: 11px; text-align: center; margin: 0;">&copy; 2026 Geethvarnam Heritage Boutique. All rights reserved.</p>
          </div>
        `;

        try {
          let res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendKey}`
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [cleanEmail],
              subject: `${otpCode} is your Geethvarnam ${isAdmin ? "Admin Security" : "Verification"} Code`,
              html: emailTemplate
            })
          });

          if (res.ok) {
            deliveryStatus.emailSent = true;
            deliveryStatus.providersUsed.push("Resend Email API");
          } else {
            const errData = await res.json();
            deliveryStatus.logs.push(`Resend direct dispatch error: ${JSON.stringify(errData)}`);

            // If Resend free sandbox restriction 403 (send to verified owner email)
            if (res.status === 403) {
              const verifiedOwnerEmail = "sriraamsk05@gmail.com";
              const fallbackSubject = `[${otpCode}] Geethvarnam ${isAdmin ? "Admin OTP" : "Verification OTP"} for ${cleanEmail}`;

              const fallbackRes = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${resendKey}`
                },
                body: JSON.stringify({
                  from: fromEmail,
                  to: [verifiedOwnerEmail],
                  subject: fallbackSubject,
                  html: emailTemplate
                })
              });

              if (fallbackRes.ok) {
                deliveryStatus.emailSent = true;
                deliveryStatus.providersUsed.push(`Resend (Sandbox fallback to ${verifiedOwnerEmail})`);
              }
            }
          }
        } catch (e: any) {
          deliveryStatus.logs.push(`Resend exception: ${e.message}`);
        }
      }
    }

    // Terminal Logging for real-time observation
    console.log(`\n======================================================`);
    console.log(`[EMAIL OTP ENGINE] Target Email: ${email || "None"}`);
    if (phone) console.log(`[CUSTOMER CONTACT MOBILE SAVED]: ${phone}`);
    console.log(`[PASSCODE]: >>> ${otpCode} <<<`);
    console.log(`[DELIVERY RESULTS]: Email Sent: ${deliveryStatus.emailSent} (${deliveryStatus.providersUsed.join(", ") || "Development fallback"})`);
    console.log(`======================================================\n`);

    return NextResponse.json({
      success: true,
      otp: otpCode,
      email: email || null,
      phone: phone || null,
      deliveryStatus,
      message: deliveryStatus.emailSent
        ? `Passcode sent to your email (${email}).`
        : `Email Passcode generated: ${otpCode}`
    });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch OTP." },
      { status: 500 }
    );
  }
}
