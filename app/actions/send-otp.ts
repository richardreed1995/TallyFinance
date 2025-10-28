"use server"

import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

const client = twilio(accountSid, authToken)

export async function sendOTP(phoneNumber: string) {
  try {
    if (!accountSid || !authToken || !verifyServiceSid) {
      console.error("[v0] Twilio credentials not configured")
      return {
        success: false,
        error: "SMS service not configured",
      }
    }

    // Format phone number to E.164 format if needed
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+44${phoneNumber.replace(/^0/, "")}`

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: formattedPhone,
        channel: "sms",
      })

    console.log("[v0] Twilio OTP sent:", verification.status)

    return {
      success: true,
      data: {
        sid: verification.sid,
        status: verification.status,
      },
    }
  } catch (error) {
    console.error("[v0] Error sending OTP:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send OTP",
    }
  }
}

export async function verifyOTP(phoneNumber: string, code: string) {
  try {
    if (!accountSid || !authToken || !verifyServiceSid) {
      console.error("[v0] Twilio credentials not configured")
      return {
        success: false,
        error: "SMS service not configured",
      }
    }

    // Format phone number to E.164 format if needed
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+44${phoneNumber.replace(/^0/, "")}`

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: formattedPhone,
        code: code,
      })

    console.log("[v0] Twilio OTP verification:", verificationCheck.status)

    return {
      success: verificationCheck.status === "approved",
      data: {
        status: verificationCheck.status,
      },
    }
  } catch (error) {
    console.error("[v0] Error verifying OTP:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to verify OTP",
    }
  }
}





