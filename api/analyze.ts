import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-ignore - pdf-parse types
import pdf from 'pdf-parse';

const GRADIENT_ENDPOINT = process.env.GRADIENT_ENDPOINT_URL;
const GRADIENT_API_KEY = process.env.GRADIENT_API_KEY;

const SYSTEM_PROMPT = `You are ContractGuard, a friendly AI helper that explains confusing contract language in super simple terms that anyone can understand - even a 5-year-old.

## YOUR JOB

People will show you scary legal text from contracts, leases, loans, and terms of service. Your job is to:
1. Explain what it REALLY means in plain, simple words
2. Tell them if it's fair or unfair (and how bad)
3. Point out the sneaky parts they might miss
4. Give them easy advice on what to do

## IMPORTANT RULES

1. **Talk like a friendly neighbor, not a lawyer**
   - BAD: "This clause constitutes a waiver of your statutory rights"
   - GOOD: "This says you're giving up your right to sue them, even if they mess up"

2. **Use everyday comparisons**
   - "It's like signing a paper that says the restaurant can charge your credit card whenever they want, for any amount"

3. **Be direct about problems**
   - Don't say "this may be concerning" - say "this is bad because..."

4. **Always explain the worst case**
   - "If things go wrong, here's what could happen to you..."

## OUTPUT FORMAT (FOLLOW EXACTLY)

You MUST respond in this EXACT format. Do not add extra sections or change the headers:

CLAUSE_TYPE: [One or two words: Lease Termination, Security Deposit, Late Fees, Privacy Policy, etc.]

RISK_SCORE: [Number 1-10]

RISK_LEVEL: [LOW if 1-3, MEDIUM if 4-6, HIGH if 7-10]

SIMPLE_EXPLANATION:
[2-4 sentences explaining what this means like you're talking to a friend who knows nothing about legal stuff. Use "you" and "they" language. No legal jargon.]

WORST_CASE:
[1-2 sentences: What's the worst that could happen if you sign this?]

RED_FLAGS:
- [Problem 1 in simple words]
- [Problem 2 in simple words]
- [Problem 3 if applicable]

WHAT_TO_DO:
- [Simple action 1]
- [Simple action 2]
- [Simple action 3 if applicable]

BOTTOM_LINE:
[One sentence summary: Should they sign this? How bad is it?]

## RISK SCORING GUIDE

- **1-3 (LOW):** Pretty normal, nothing to worry about
- **4-6 (MEDIUM):** Has some problems, try to change it if you can
- **7-8 (HIGH):** Really unfair, don't sign without changes
- **9-10 (CRITICAL):** This is a trap, might even be illegal, walk away

## REMEMBER

- No legal jargon
- Use "you" and "they"
- Be specific about what could go wrong
- Always give clear advice
- Follow the format EXACTLY`;

function parseAnalysisResponse(analysisText: string) {
  // Remove <think>...</think> tags from DeepSeek R1 responses
  const cleanText = analysisText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  const result = {
    clauseType: "General",
    riskScore: 5,
    riskLabel: "MEDIUM",
    plainEnglish: "",
    worstCase: "",
    redFlags: [] as string[],
    actions: [] as string[],
    verdict: "",
    rawAnalysis: cleanText
  };

  // Parse CLAUSE_TYPE
  const clauseMatch = cleanText.match(/CLAUSE_TYPE:\s*(.+?)(?:\n|$)/);
  if (clauseMatch) {
    result.clauseType = clauseMatch[1].trim();
  }

  // Parse RISK_SCORE
  const riskMatch = cleanText.match(/RISK_SCORE:\s*(\d+)/);
  if (riskMatch) {
    result.riskScore = parseInt(riskMatch[1], 10);
  }

  // Parse RISK_LEVEL
  const levelMatch = cleanText.match(/RISK_LEVEL:\s*(.+?)(?:\n|$)/);
  if (levelMatch) {
    result.riskLabel = levelMatch[1].trim();
  }

  // Parse SIMPLE_EXPLANATION
  const explanationMatch = cleanText.match(/SIMPLE_EXPLANATION:\s*([\s\S]+?)(?=WORST_CASE:|RED_FLAGS:|$)/);
  if (explanationMatch) {
    result.plainEnglish = explanationMatch[1].trim();
  }

  // Parse WORST_CASE
  const worstMatch = cleanText.match(/WORST_CASE:\s*([\s\S]+?)(?=RED_FLAGS:|WHAT_TO_DO:|$)/);
  if (worstMatch) {
    result.worstCase = worstMatch[1].trim();
  }

  // Parse RED_FLAGS
  const flagsMatch = cleanText.match(/RED_FLAGS:\s*([\s\S]+?)(?=WHAT_TO_DO:|BOTTOM_LINE:|$)/);
  if (flagsMatch) {
    const flags = flagsMatch[1].match(/[-•]\s*(.+?)(?=\n[-•]|\n\n|$)/g);
    if (flags) {
      result.redFlags = flags.map(f => f.replace(/^[-•]\s*/, '').trim()).filter(f => f);
    }
  }

  // Parse WHAT_TO_DO
  const actionsMatch = cleanText.match(/WHAT_TO_DO:\s*([\s\S]+?)(?=BOTTOM_LINE:|$)/);
  if (actionsMatch) {
    const actions = actionsMatch[1].match(/[-•]\s*(.+?)(?=\n[-•]|\n\n|$)/g);
    if (actions) {
      result.actions = actions.map(a => a.replace(/^[-•]\s*/, '').trim()).filter(a => a);
    }
  }

  // Parse BOTTOM_LINE
  const bottomMatch = cleanText.match(/BOTTOM_LINE:\s*([\s\S]+?)(?:\n\n|$)/);
  if (bottomMatch) {
    result.verdict = bottomMatch[1].trim();
  }

  // Ensure risk label matches score
  if (result.riskScore >= 7) {
    result.riskLabel = "HIGH";
  } else if (result.riskScore >= 4) {
    result.riskLabel = "MEDIUM";
  } else {
    result.riskLabel = "LOW";
  }

  return result;
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '16mb',
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let text = '';

  try {
    const { text: bodyText, file, fileType, fileName } = req.body;

    // Handle file upload (base64 encoded)
    if (file) {
      const buffer = Buffer.from(file, 'base64');

      if (fileType === 'application/pdf' || fileName?.toLowerCase().endsWith('.pdf')) {
        text = await extractTextFromPDF(buffer);
      } else if (fileType === 'text/plain' || fileName?.toLowerCase().endsWith('.txt')) {
        text = buffer.toString('utf-8');
      } else {
        return res.status(400).json({
          error: 'Unsupported file type. Please upload a PDF or TXT file.'
        });
      }

      // Combine with any additional text
      if (bodyText) {
        text = bodyText + '\n\n--- From uploaded file ---\n\n' + text;
      }
    } else if (bodyText) {
      text = bodyText;
    }

    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        error: 'Please provide a complete contract clause (at least 20 characters).'
      });
    }

    // Truncate if too long (keep first 10000 chars for analysis)
    if (text.length > 10000) {
      text = text.substring(0, 10000) + '\n\n[Document truncated - showing first 10,000 characters]';
    }

    // Check if Gradient AI is configured
    if (!GRADIENT_ENDPOINT || !GRADIENT_API_KEY) {
      // Return demo response if not configured
      return res.status(200).json({
        success: true,
        demoMode: true,
        data: {
          clauseType: "Demo Analysis",
          riskScore: 7,
          riskLabel: "HIGH",
          plainEnglish: "This is a demo response. Configure GRADIENT_ENDPOINT_URL and GRADIENT_API_KEY environment variables to enable real AI analysis.",
          worstCase: "Without real AI analysis, you might miss important red flags in your contract.",
          redFlags: [
            "Demo mode - no actual analysis performed",
            "Set up Gradient AI credentials for real results"
          ],
          actions: [
            "Add GRADIENT_ENDPOINT_URL to your environment variables",
            "Add GRADIENT_API_KEY to your environment variables",
            "Redeploy to enable real contract analysis"
          ],
          verdict: "Configure Gradient AI to unlock full contract analysis capabilities."
        }
      });
    }

    const response = await fetch(GRADIENT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GRADIENT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'agent',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Please analyze this contract clause and identify any potential issues:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gradient AI error:', errorText);
      return res.status(500).json({
        error: 'Failed to analyze contract. Please try again.'
      });
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content || '';

    if (!analysisText) {
      return res.status(500).json({
        error: 'No analysis returned. Please try again.'
      });
    }

    const parsed = parseAnalysisResponse(analysisText);

    return res.status(200).json({
      success: true,
      demoMode: false,
      data: parsed
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Analysis failed. Please try again.'
    });
  }
}
