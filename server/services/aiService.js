import { GoogleGenerativeAI } from "@google/generative-ai";

const categories = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
];
const priorities = ["Critical", "High", "Medium", "Low"];

const knowledgeBase = `
BookLeaf is a self-publishing company in India and the US.
Royalties: author gets 80% of net profit; net profit = MRP minus printing cost, platform commission, and shipping. Royalties are calculated quarterly and paid within 45 days after quarter end. Minimum payout is ₹1,000; lower amounts roll over. Payouts use bank transfer to linked dashboard bank details.
ISBN: each book receives a unique ISBN registered under BookLeaf's imprint. ISBN errors are high priority and escalated to production with a 48-hour timeline.
Printing: standard turnaround is 5–7 business days. Verified misprints, binding defects, or color issues qualify for a free reprint; request photos.
Distribution: listings usually go live within 7–10 business days after publication. Availability stock sync can be retriggered and usually takes 24–48 hours.
Production stages: Manuscript Received, Editing, Cover Design, Typesetting, Proofreading, ISBN Assignment, Printing, Distribution Setup, Published & Live. Delays can occur while waiting for cover approval or proofreading revisions.
Metadata updates usually reflect on platforms within 3–5 business days.
Tone: empathetic, professional, specific, own BookLeaf mistakes, give a clear next step and timeline. Never invent account-specific facts, payout dates, or statuses.
`;

const fallbackAnalysis = (subject, description) => {
  const text = `${subject} ${description}`.toLowerCase();
  let category = "General Inquiry";
  if (/royalt|payment|payout|earning|paid|money|bank/.test(text))
    category = "Royalty & Payments";
  else if (/isbn|metadata|author bio|description|title correction/.test(text))
    category = "ISBN & Metadata Issues";
  else if (/print|misprint|binding|blurry|quality|pages|reprint/.test(text))
    category = "Printing & Quality";
  else if (
    /amazon|flipkart|unavailable|distribution|listing|stock sync/.test(text)
  )
    category = "Distribution & Availability";
  else if (
    /production|status|typesetting|cover|proofreading|publishing|delay/.test(
      text,
    )
  )
    category = "Book Status & Production Updates";

  let priority = "Medium";
  if (
    /isbn|wrong book|duplicate|6 months|overdue|defect|misprint|no royalty|not received|serious/.test(
      text,
    )
  )
    priority = "High";
  if (/urgent|fraud|critical|legal|repeated failure/.test(text))
    priority = "Critical";
  if (/bio|how can i|can i update|general question/.test(text))
    priority = "Low";
  return { category, priority };
};

export const classifyTicket = async (subject, description) => {
  const fallback = fallbackAnalysis(subject, description);
  if (!process.env.GEMINI_API_KEY) return { ...fallback, source: "fallback" };
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    });
    const result = await model.generateContent(
      `Classify this BookLeaf support ticket. Return ONLY valid JSON with keys category and priority. ` +
        `category must be one of ${JSON.stringify(categories)}. priority must be one of ${JSON.stringify(priorities)}. ` +
        `Use Critical only for immediate severe cases, High for overdue payments/ISBN/quality issues, Medium for normal support, Low for minor requests.\n` +
        `Subject: ${subject}\nDescription: ${description}`,
    );
    const raw = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    const parsed = JSON.parse(raw);
    return {
      category: categories.includes(parsed.category)
        ? parsed.category
        : fallback.category,
      priority: priorities.includes(parsed.priority)
        ? parsed.priority
        : fallback.priority,
      source: "gemini",
    };
  } catch (error) {
    console.error(
      "Gemini classification failed; using fallback:",
      error.message,
    );
    return { ...fallback, source: "fallback" };
  }
};

export const draftReply = async (ticket) => {
  const fallback = `Hello ${ticket.authorName},\n\nThank you for reaching out about "${ticket.subject}". I'm sorry for the concern this has caused. Our support team is reviewing the details of your query under ${ticket.category}.\n\nWe will investigate and provide an update within 48 hours. If any additional information is needed, our team will contact you directly.\n\nNext step: please keep this ticket open while our team reviews it.\n\nBest regards,\nBookLeaf Support Team`;
  if (!process.env.GEMINI_API_KEY)
    return { draft: fallback, source: "fallback" };
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
    const result = await model.generateContent(
      `You are a BookLeaf Publishing support representative. Write a concise, empathetic, professional response to an author. ` +
        `Acknowledge the concern first, state only policy facts supported by the knowledge base, do not invent the author's account status, ` +
        `dates, sales, or payout details. If investigation is needed, promise an update within 48 hours. End with a clear next step. ` +
        `Use plain text, no markdown heading.\n\nKNOWLEDGE BASE:\n${knowledgeBase}\n\nTICKET:\nCategory: ${ticket.category}\nPriority: ${ticket.priority}\nBook: ${ticket.bookTitle}\nSubject: ${ticket.subject}\nDescription: ${ticket.description}`,
    );
    return { draft: result.response.text().trim(), source: "gemini" };
  } catch (error) {
    console.error("Gemini draft failed; using fallback:", error.message);
    return { draft: fallback, source: "fallback" };
  }
};
