"use strict"

/**
 * Manual Make.com webhook tester.
 *
 * Usage examples:
 *   node scripts/test-make-webhook.js --submission 646cbff1-2945-4717-bc11-e36b196620ec
 *   node scripts/test-make-webhook.js --email richard@example.co --phone 07123456789 --loan 250000
 *
 * It either fetches an existing assessment submission from Supabase (when --submission is provided)
 * or fabricates a realistic payload from CLI flags/defaults. In both cases it POSTs the payload to
 * MAKE_WEBHOOK_URL using the same shape as the live webhook.
 */

import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const { MAKE_WEBHOOK_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = process.env

if (!MAKE_WEBHOOK_URL) {
  console.error("❌ Missing MAKE_WEBHOOK_URL in environment.")
  process.exit(1)
}

const cliArgs = parseArgs(process.argv.slice(2))

try {
  const submission =
    (await maybeLoadSubmission(cliArgs.submission)) ?? buildSyntheticSubmission(cliArgs)

  const payload = buildPayload(submission)

  console.log("📤 Sending payload to Make.com webhook…")
  const response = await fetch(MAKE_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  console.log(`✅ Webhook responded with ${response.status} ${response.statusText}`)
  const bodyText = await safeReadBody(response)
  if (bodyText) {
    console.log("ℹ️ Response body:", bodyText)
  }

  console.log("Payload submitted:")
  console.dir(payload, { depth: null })
} catch (error) {
  console.error("❌ Failed to trigger webhook:", error)
  process.exit(1)
}

function parseArgs(argv) {
  const result = {}
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg.startsWith("--")) continue
    const key = arg.slice(2)
    const value = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true
    if (value === true) {
      result[key] = true
    } else {
      result[key] = value
      i += 1
    }
  }
  return result
}

async function maybeLoadSubmission(submissionId) {
  if (!submissionId) {
    return null
  }

  if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase credentials missing; cannot load submission.")
  }

  console.log(`🔎 Fetching submission ${submissionId} from Supabase…`)
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const { data, error } = await supabase
    .from("assessment_submissions")
    .select("*")
    .eq("id", submissionId)
    .single()

  if (error) {
    throw new Error(`Supabase fetch failed: ${error.message || error.code}`)
  }

  if (!data) {
    throw new Error(`Submission ${submissionId} not found.`)
  }

  return data
}

function buildSyntheticSubmission(overrides = {}) {
  const loanAmount = Number.parseInt(overrides.loan ?? "250000", 10)
  const turnover = Number.parseInt(overrides.turnover ?? "750000", 10)

  return {
    id: overrides.id ?? `test-${Date.now()}`,
    first_name: overrides.first ?? "Test",
    last_name: overrides.last ?? "User",
    email: overrides.email ?? "test.lead@example.com",
    phone: overrides.phone ?? "07123456789",
    consent_given: true,
    business_owner: true,
    loan_amount: loanAmount,
    trading_time: overrides.trading ?? "24+ months",
    annual_turnover: turnover,
    company_type: overrides.companyType ?? "Limited company",
    finance_purpose: overrides.financePurpose ?? "Working capital",
    credit_profile: overrides.credit ?? "Good",
    homeowner: overrides.homeowner ? overrides.homeowner === "true" : true,
    score: overrides.score ? Number.parseInt(overrides.score, 10) : 72,
    qualification_status: "qualified",
    company_name: overrides.companyName ?? "Acme Holdings Ltd",
    company_number: overrides.companyNumber ?? "12345678",
    company_address: {
      address_line_1: overrides.address1 ?? "1 Lead Street",
      address_line_2: overrides.address2 ?? "",
      locality: overrides.locality ?? "London",
      postal_code: overrides.postcode ?? "EC1A 1AA",
      country: overrides.country ?? "United Kingdom",
    },
    director_role: overrides.directorRole ?? "Director",
    question_2_loan_amount: loanAmount,
    question_4_annual_turnover: turnover,
  }
}

function buildPayload(submission) {
  const fullName = [submission.first_name, submission.last_name].filter(Boolean).join(" ") || null

  return {
    meta: {
      triggered_at: new Date().toISOString(),
      source: "assessment_funnel_manual_test",
    },
    submission,
    derived: {
      full_name: fullName,
      registered_address: formatCompanyAddress(submission.company_address),
    },
  }
}

function formatCompanyAddress(address) {
  if (!address || typeof address !== "object") {
    return null
  }

  const parts = [
    address.address_line_1,
    address.address_line_2,
    address.locality,
    address.postal_code,
    address.country,
  ].filter(Boolean)

  return parts.length ? parts.join(", ") : null
}

async function safeReadBody(response) {
  try {
    return await response.text()
  } catch (_) {
    return null
  }
}


