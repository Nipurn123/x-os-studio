import { RewriteOption } from "../types";
import { auditPost } from "../algorithm/scorer";

export function generateAlgorithmicRewrites(originalText: string): RewriteOption[] {
  const auditBefore = auditPost(originalText);
  const text = originalText.trim();

  // 1. Maximize Copy-Link / Bookmark (Targeting +20.0 ShareViaCopyLink)
  const copyLinkRewritten = transformToCopyLink(text);
  const auditCopyLink = auditPost(copyLinkRewritten);

  // 2. Maximize Reply Velocity (Targeting +5.0 Reply / +20.0 Mutual)
  const replyMagnetRewritten = transformToReplyMagnet(text);
  const auditReply = auditPost(replyMagnetRewritten);

  // 3. Maximize Dwell Time (Targeting continuous reading time + hook stopping)
  const dwellRewritten = transformToDwellExtender(text);
  const auditDwell = auditPost(dwellRewritten);

  // 4. De-risk Negative Feedback (Targeting 0 penalties from Reports / Mutes)
  const deriskedRewritten = transformToDerisked(text);
  const auditDerisked = auditPost(deriskedRewritten);

  return [
    {
      mode: "copy_link",
      title: "Bookmark & Copy-Link Amplifier",
      description: "Restructures into a high-density, referenceable checklist designed to trigger the +20.0 (40x Like) Share-via-Copy-Link signal.",
      icon: "Bookmark",
      color: "emerald",
      rewrittenText: copyLinkRewritten,
      scoreBefore: auditBefore.scaledScore,
      scoreAfter: auditCopyLink.scaledScore,
      scoreDelta: auditCopyLink.scaledScore - auditBefore.scaledScore,
      keyChanges: [
        "Added explicit bookmarking and reference cues",
        "Formatted into scannable bullet points",
        "Removed raw outbound links into follow-up CTA",
      ],
    },
    {
      mode: "reply_magnet",
      title: "Conversation & Reply Magnet",
      description: "Injects open-ended trade-off debate questions to trigger thread depth (+5.0 Reply weight / +20.0 Mutual Follower reply boost).",
      icon: "MessageSquare",
      color: "blue",
      rewrittenText: replyMagnetRewritten,
      scoreBefore: auditBefore.scaledScore,
      scoreAfter: auditReply.scaledScore,
      scoreDelta: auditReply.scaledScore - auditBefore.scaledScore,
      keyChanges: [
        "Appended open-ended discussion question",
        "Highlighted contrasting viewpoints to spark commentary",
        "Encouraged peer insights and domain experience",
      ],
    },
    {
      mode: "dwell_extender",
      title: "Dwell Time & Scannability Maximizer",
      description: "Optimizes the first 7 words for stopping power and breaks up text walls to maximize continuous active viewing time (+0.004/s).",
      icon: "Clock",
      color: "purple",
      rewrittenText: dwellRewritten,
      scoreBefore: auditBefore.scaledScore,
      scoreAfter: auditDwell.scaledScore,
      scoreDelta: auditDwell.scaledScore - auditBefore.scaledScore,
      keyChanges: [
        "Sharpened opening hook to under 7 words",
        "Optimized vertical whitespace and rhythm",
        "Built narrative tension before the fold",
      ],
    },
    {
      mode: "derisk_negative",
      title: "Negative Downrank De-risker",
      description: "Softens polarizing hostility and spam triggers to safeguard against devastating -234.0 Report, -58.8 Mute, and -43.2 Not-Interested penalties.",
      icon: "ShieldAlert",
      color: "rose",
      rewrittenText: deriskedRewritten,
      scoreBefore: auditBefore.scaledScore,
      scoreAfter: auditDerisked.scaledScore,
      scoreDelta: auditDerisked.scaledScore - auditBefore.scaledScore,
      keyChanges: [
        "Replaced offensive or baiting words with constructive analysis",
        "Stripped hashtag clutter and excessive capitalization",
        "Framed critique around systems rather than individuals",
      ],
    },
  ];
}

function cleanLinks(t: string): string {
  return t.replace(/https?:\/\/[^\s]+/gi, "").trim();
}

function transformToCopyLink(original: string): string {
  const cleaned = cleanLinks(original);
  if (!cleaned) {
    return "7 high-signal lessons that will save you 20 hours this week (bookmark this):\n\n• Principle 1: Optimize for copy-link shares (40x weight)\n• Principle 2: End with discussion questions for replies\n• Principle 3: Maximize dwell time with vertical spacing\n\nSave this for your next draft.";
  }

  // If already contains bullet points, format with bookmark header
  const lines = cleaned.split("\n").filter((l) => l.trim().length > 0);
  const title = lines[0].replace(/[.!:]$/, "");

  return `The complete master breakdown on ${title.slice(0, 60)} (save this):\n\n${lines
    .slice(0, 4)
    .map((l, i) => `• Step ${i + 1}: ${l.replace(/^[-•*0-9.]\s*/, "")}`)
    .join("\n")}\n\nBookmark this checklist for future reference.`;
}

function transformToReplyMagnet(original: string): string {
  const cleaned = cleanLinks(original);
  if (!cleaned) {
    return "Most people optimize for Likes on X, but the algorithm gives 40x more weight to Copy-Link shares and 10x to Replies.\n\nWhat is the single biggest growth mistake you see creators making in 2026?";
  }

  const lines = cleaned.split("\n").filter(Boolean);
  const coreIdea = lines.slice(0, 3).join("\n\n");

  return `${coreIdea}\n\nI'm curious to hear your take:\nDo you agree with this approach, or do you have a different framework in your workflow?`;
}

function transformToDwellExtender(original: string): string {
  const cleaned = cleanLinks(original);
  if (!cleaned) {
    return "Stop scrolling.\n\nHere is what 99% of developers miss about the X algorithm:\n\n1. Outbound links cut dwell time by 65%\n2. 1 report destroys 468 likes worth of score\n3. Mutual follower replies get a +15.0 boost\n\nRead that again.";
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  const hook = words.slice(0, 7).join(" ");
  const remainder = words.slice(7).join(" ");

  return `${hook}:\n\nHere is the exact breakdown:\n\n${remainder
    .match(/[^.!?]+[.!?]+/g)
    ?.slice(0, 4)
    ?.map((sentence) => `• ${sentence.trim()}`)
    .join("\n") || `• ${remainder}`}\n\nTake 10 seconds to digest this.`;
}

function transformToDerisked(original: string): string {
  let cleaned = cleanLinks(original);
  // Replace toxic phrases
  cleaned = cleaned
    .replace(/\b(stupid|idiot|moron|hate|trash|loser|clown|scam)\b/gi, "flawed approach")
    .replace(/\b(wake up sheep|everyone is dumb)\b/gi, "here is an overlooked perspective")
    .replace(/#\w+/g, "") // strip hashtags
    .trim();

  if (!cleaned) {
    return "A constructive look at modern content distribution:\n\nFocusing on audience value and clear formatting creates sustainable long-term reach without relying on rage-bait.";
  }

  return `Constructive analysis:\n\n${cleaned}\n\nFocusing on transparent data and thoughtful dialogue is how long-term credibility is built.`;
}
