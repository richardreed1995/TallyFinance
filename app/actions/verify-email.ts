"use server"

export async function verifyEmailWithKitt(email: string) {
  try {
    // Zeruh API uses GET request with query parameters
    const apiKey = "bab915fb9d509a615f7bfcfe07d594fa281885252e1911e60cc206fdf0a495b9"
    const url = `https://api.zeruh.com/v1/verify?api_key=${apiKey}&email_address=${encodeURIComponent(email)}`

    const response = await fetch(url, {
      method: "GET",
    })

    if (!response.ok) {
      console.error("[v0] Zeruh API error:", response.status, response.statusText)
      return {
        success: false,
        error: "Failed to verify email",
      }
    }

    const data = await response.json()

    console.log("[v0] Zeruh API response:", data)

    // Check if the API call was successful and parse the result
    if (!data.success || !data.result) {
      return {
        success: false,
        error: "Failed to verify email",
      }
    }

    // Zeruh returns status: "deliverable", "risky", "undeliverable", or "unknown"
    // We'll accept "deliverable" as valid, and optionally "risky" for less strict validation
    const status = data.result.status
    const isValid = status === "deliverable"

    // Additional checks for disposable emails
    const isDisposable = data.result.validation_details?.disposable === true

    let errorMessage = "Email address is invalid or undeliverable"
    if (status === "undeliverable") {
      errorMessage = "This email address cannot receive emails"
    } else if (isDisposable) {
      errorMessage = "Disposable email addresses are not allowed"
    } else if (status === "risky") {
      errorMessage = "This email address may have delivery issues"
    }

    return {
      success: isValid && !isDisposable,
      data: data.result,
      error: isValid && !isDisposable ? undefined : errorMessage,
    }
  } catch (error) {
    console.error("[v0] Email verification error:", error)
    return {
      success: false,
      error: "Failed to verify email",
    }
  }
}
