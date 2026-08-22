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
    // 1. REAL EMAIL OTP DELIVERY
    // ==========================================
    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      // A. Gmail / SMTP Transport via Nodemailer
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
                  <p style="color: #a8a29e; font-size: 13px; margin-bottom: 20px;">Use the verification passcode below to complete your ${isAdmin ? "Executive Admin Sign In" : "Storefront Authentication"}:</p>
                  
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

      // B. Resend API Dispatch (if configured and not already sent)
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey && !deliveryStatus.emailSent) {
        try {
          const fromEmail = process.env.RESEND_FROM_EMAIL || "Geethvarnam Boutique <onboarding@resend.dev>";
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${resendKey}`
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [cleanEmail],
              subject: `${otpCode} is your Geethvarnam ${isAdmin ? "Admin Security" : "Verification"} Code`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0a0e; color: #ffffff; padding: 40px 30px; border-radius: 20px; border: 1px solid rgba(217, 119, 6, 0.4);">
                  <div style="text-align: center; margin-bottom: 25px;">
                    <h1 style="color: #f59e0b; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">GEETHVARNAM</h1>
                    <p style="color: #a8a29e; font-size: 11px; letter-spacing: 3px; margin-top: 5px; text-transform: uppercase;">Luxury Saree & Chudar Couture</p>
                  </div>
                  
                  <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px 20px; text-align: center; margin-bottom: 25px;">
                    <p style="color: #e7e5e4; font-size: 14px; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
                    <p style="color: #a8a29e; font-size: 13px; margin-bottom: 20px;">Use the verification passcode below to complete your ${isAdmin ? "Executive Admin Sign In" : "Storefront Authentication"}:</p>
                    
                    <div style="display: inline-block; background: linear-gradient(135deg, #d97706, #b45309); color: #000000; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 8px; padding: 15px 35px; border-radius: 12px; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.3);">
                      ${otpCode}
                    </div>
                    
                    <p style="color: #78716c; font-size: 11px; margin-top: 20px;">This code is valid for 5 minutes. Never share this passcode with anyone.</p>
                  </div>
                  
                  <p style="color: #57534e; font-size: 11px; text-align: center; margin: 0;">&copy; 2026 Geethvarnam Heritage Boutique. All rights reserved.</p>
                </div>
              `
            })
          });

          if (res.ok) {
            deliveryStatus.emailSent = true;
            deliveryStatus.providersUsed.push("Resend Email API");
          } else {
            const errData = await res.json();
            deliveryStatus.logs.push(`Resend error: ${JSON.stringify(errData)}`);
          }
        } catch (e: any) {
          deliveryStatus.logs.push(`Resend exception: ${e.message}`);
        }
      }
    }

    // ==========================================
    // 2. REAL MOBILE SMS OTP DELIVERY
    // ==========================================
    if (phone) {
      const cleanPhone = phone.replace(/[^\d+]/g, "");

      // A. Fast2SMS (Indian SMS Gateway - Fast & Direct)
      const fast2smsKey = process.env.FAST2SMS_API_KEY;
      if (fast2smsKey) {
        try {
          const mobileOnly = cleanPhone.replace("+91", "").replace(/\D/g, "");
          const fRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
            method: "POST",
            headers: {
              authorization: fast2smsKey,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              variables_values: otpCode,
              route: "otp",
              numbers: mobileOnly
            })
          });

          if (fRes.ok) {
            deliveryStatus.smsSent = true;
            deliveryStatus.providersUsed.push("Fast2SMS Gateway");
          } else {
            const err = await fRes.json();
            deliveryStatus.logs.push(`Fast2SMS error: ${JSON.stringify(err)}`);
          }
        } catch (e: any) {
          deliveryStatus.logs.push(`Fast2SMS exception: ${e.message}`);
        }
      }

      // B. Twilio SMS Gateway
      const twilioSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

      if (twilioSid && twilioToken && twilioPhone && !deliveryStatus.smsSent) {
        try {
          const authHeader = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
          const params = new URLSearchParams();
          params.append("To", cleanPhone.startsWith("+") ? cleanPhone : `+91${cleanPhone}`);
          params.append("From", twilioPhone);
          params.append("Body", `Geethvarnam Boutique: Your verification code is ${otpCode}. Valid for 5 mins.`);

          const twilioRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${authHeader}`,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: params.toString()
            }
          );

          if (twilioRes.ok) {
            deliveryStatus.smsSent = true;
            deliveryStatus.providersUsed.push("Twilio SMS");
          } else {
            const err = await twilioRes.json();
            deliveryStatus.logs.push(`Twilio error: ${JSON.stringify(err)}`);
          }
        } catch (e: any) {
          deliveryStatus.logs.push(`Twilio exception: ${e.message}`);
        }
      }
    }

    // Terminal Logging for real-time observation
    console.log(`\n======================================================`);
    console.log(`[OTP DISPATCH ENGINE] Target: ${email || ""} | ${phone || ""}`);
    console.log(`[PASSCODE]: >>> ${otpCode} <<<`);
    console.log(`[DELIVERY RESULTS]: Email Sent: ${deliveryStatus.emailSent}, SMS Sent: ${deliveryStatus.smsSent}`);
    if (deliveryStatus.providersUsed.length > 0) {
      console.log(`[PROVIDERS SUCCEEDED]: ${deliveryStatus.providersUsed.join(", ")}`);
    } else {
      console.log(`[NOTICE]: No email/SMS keys configured in .env.local yet.`);
    }
    console.log(`======================================================\n`);

    return NextResponse.json({
      success: true,
      otp: otpCode,
      email: email || null,
      phone: phone || null,
      deliveryStatus,
      message: deliveryStatus.emailSent || deliveryStatus.smsSent
        ? `Passcode sent to ${[deliveryStatus.emailSent && "Email", deliveryStatus.smsSent && "Mobile SMS"].filter(Boolean).join(" and ")}.`
        : `Passcode generated. (Configure SMTP/Resend or Fast2SMS in .env.local for live dispatch)`
    });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch OTP." },
      { status: 500 }
    );
  }
}
