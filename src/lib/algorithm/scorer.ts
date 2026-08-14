import { PostAuditResult, PredictedProbabilities, ScoreBreakdownItem } from "../types";
import { PRODUCTION_ALGO_WEIGHTS, MULTIPLIERS } from "./weights";
import { analyzeNegativeRisks } from "./penalties";

export function auditPost(content: string): PostAuditResult {
  const text = content.trim();
  const charCount = content.length;
  const words = text.length > 0 ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // Reading time (average 220 words per minute)
  const readingTimeSeconds = Math.max(1, Math.round((wordCount / 220) * 60));

  // Extract first 7 words for hook velocity analysis
  const first7Words = words.slice(0, 7).join(" ");

  // Heuristic analysis
  const hasOutboundLink = /(https?:\/\/[^\s]+)/gi.test(text);
  const hasQuestionPrompt = /[?？]/.test(text) || /\b(what do you think|how do you|why do|thoughts\?)\b/i.test(text);
  const hasListFormatting = /^[\s]*[-•*0-9.]/m.test(text) || text.includes("\n-") || text.includes("\n•") || text.includes("\n1.");
  const hasMediaMention = /\b(video|screenshot|image|graph|chart|visual)\b/i.test(text);
  const hasCuriosityWords = /\b(secret|mistake|revealed|framework|blueprint|cheat sheet|breakdown|teardown|truth|uncovered|nobody talks about)\b/i.test(text);
  const hasNumbersInHook = /\b[0-9]+(%|\$|k|x|h|hrs|days|steps|tools|lessons|rules)?\b/i.test(first7Words);
  const hasSavePrompt = /\b(bookmark|save this|revisit|steal this|cheatsheet|guide)\b/i.test(text);
  const hasMutualEngagementPrompt = /\b(comment|reply|drop your|let's connect|tag a friend|tell me)\b/i.test(text);

  // Line break scannability (whitespaces)
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const whitespaceRatio = lines.length > 1 ? Math.min(1, lines.length / Math.max(2, wordCount / 12)) : 0.2;
  const whitespaceIndex = Math.round(whitespaceRatio * 100);

  // Hook stopping score (0 - 100)
  let hookScore = 30; // baseline
  if (hasCuriosityWords) hookScore += 25;
  if (hasNumbersInHook) hookScore += 20;
  if (first7Words.length > 0 && first7Words.length < 50) hookScore += 15; // concise hook
  if (lines.length > 1 && lines[0].length < 65) hookScore += 10; // short punchy opening line
  const hookStoppingScore = Math.min(100, Math.max(10, hookScore));

  // Negative risk analysis
  const { alerts, totalPenaltyEstimate, sentimentRiskScore } = analyzeNegativeRisks(text);

  // Estimated action probabilities based on text features
  const probabilities: PredictedProbabilities = {
    favorite: Math.min(0.85, 0.15 + (hasListFormatting ? 0.2 : 0) + (hasCuriosityWords ? 0.15 : 0) + (wordCount > 15 ? 0.1 : 0)),
    reply: Math.min(0.75, 0.05 + (hasQuestionPrompt ? 0.35 : 0) + (hasMutualEngagementPrompt ? 0.2 : 0)),
    bidirectional_reply: Math.min(0.65, 0.08 + (hasQuestionPrompt ? 0.3 : 0) + (hasMutualEngagementPrompt ? 0.2 : 0)),
    retweet: Math.min(0.6, 0.05 + (hasListFormatting ? 0.2 : 0) + (hasSavePrompt ? 0.15 : 0)),
    quote: Math.min(0.55, 0.04 + (hasCuriosityWords ? 0.15 : 0) + (hasQuestionPrompt ? 0.15 : 0)),
    share: Math.min(0.5, 0.03 + (hasSavePrompt ? 0.2 : 0) + (hasListFormatting ? 0.15 : 0)),
    share_via_dm: Math.min(0.45, 0.02 + (hasSavePrompt ? 0.2 : 0) + (hasCuriosityWords ? 0.1 : 0)),
    share_via_copy_link: Math.min(0.7, 0.04 + (hasSavePrompt ? 0.35 : 0) + (hasListFormatting ? 0.2 : 0) + (hasCuriosityWords ? 0.1 : 0)),
    click: Math.min(0.8, 0.1 + (charCount > 120 ? 0.3 : 0) + (hasListFormatting ? 0.2 : 0)),
    open_link: hasOutboundLink ? 0.45 : 0.0,
    profile_click: Math.min(0.4, 0.05 + (hasCuriosityWords ? 0.15 : 0) + (wordCount > 30 ? 0.1 : 0)),
    vqv: hasMediaMention ? 0.4 : 0.05,
    dwell_time_seconds: Math.min(60, readingTimeSeconds * (whitespaceIndex > 60 ? 1.4 : 1.0)),
    follow_author: Math.min(0.3, 0.02 + (hasListFormatting ? 0.1 : 0) + (hasSavePrompt ? 0.1 : 0)),
    // Negatives
    not_interested: Math.min(0.4, 0.02 + (sentimentRiskScore > 40 ? 0.25 : 0) + (hasOutboundLink ? 0.1 : 0)),
    block_author: Math.min(0.2, 0.005 + (sentimentRiskScore > 60 ? 0.15 : 0)),
    mute_author: Math.min(0.25, 0.01 + (sentimentRiskScore > 50 ? 0.2 : 0)),
    report: Math.min(0.1, 0.001 + (sentimentRiskScore > 75 ? 0.08 : 0)),
    not_dwelled: Math.max(0.05, 0.45 - (hookStoppingScore / 100) * 0.35),
  };

  // Compute breakdown and linear weighted totals
  const breakdown: ScoreBreakdownItem[] = [
    {
      id: "share_copy_link",
      name: "Share via Copy Link (Bookmarks/Shares)",
      weight: PRODUCTION_ALGO_WEIGHTS.share_via_copy_link,
      probability: probabilities.share_via_copy_link,
      contribution: PRODUCTION_ALGO_WEIGHTS.share_via_copy_link * probabilities.share_via_copy_link,
      type: "positive",
      explanation: "Highest positive ranking signal (+20.0). 40x the algorithmic weight of a standard like.",
      multiplierVsLike: MULTIPLIERS.COPY_LINK_VS_LIKE,
    },
    {
      id: "bidirectional_reply",
      name: "Mutual Follower Reply Boost",
      weight: PRODUCTION_ALGO_WEIGHTS.bidirectional_follow_reply,
      probability: probabilities.bidirectional_reply,
      contribution: PRODUCTION_ALGO_WEIGHTS.bidirectional_follow_reply * probabilities.bidirectional_reply,
      type: "positive",
      explanation: "Mutual follows replying to each other receives a massive +15.0 boost (+20.0 total weight).",
      multiplierVsLike: MULTIPLIERS.MUTUAL_REPLY_VS_LIKE,
    },
    {
      id: "reply",
      name: "Standard Conversation Replies",
      weight: PRODUCTION_ALGO_WEIGHTS.reply,
      probability: probabilities.reply,
      contribution: PRODUCTION_ALGO_WEIGHTS.reply * probabilities.reply,
      type: "positive",
      explanation: "Comments drive thread depth and feed distribution (+5.0 weight, 10x Like).",
      multiplierVsLike: MULTIPLIERS.REPLY_VS_LIKE,
    },
    {
      id: "quote",
      name: "Quote Post Amplification",
      weight: PRODUCTION_ALGO_WEIGHTS.quote,
      probability: probabilities.quote,
      contribution: PRODUCTION_ALGO_WEIGHTS.quote * probabilities.quote,
      type: "positive",
      explanation: "High-value distribution signal (+5.0 weight, 10x Like).",
      multiplierVsLike: MULTIPLIERS.QUOTE_VS_LIKE,
    },
    {
      id: "share_via_dm",
      name: "Share via Direct Message (Dark Social)",
      weight: PRODUCTION_ALGO_WEIGHTS.share_via_dm,
      probability: probabilities.share_via_dm,
      contribution: PRODUCTION_ALGO_WEIGHTS.share_via_dm * probabilities.share_via_dm,
      type: "positive",
      explanation: "Users sending post to private groups/chats (+5.0 weight, 10x Like).",
      multiplierVsLike: MULTIPLIERS.DM_SHARE_VS_LIKE,
    },
    {
      id: "follow_author",
      name: "Follow Author Conversion",
      weight: PRODUCTION_ALGO_WEIGHTS.follow_author,
      probability: probabilities.follow_author,
      contribution: PRODUCTION_ALGO_WEIGHTS.follow_author * probabilities.follow_author,
      type: "positive",
      explanation: "Post directly converts a reader into a new follower (+4.0 weight, 8x Like).",
      multiplierVsLike: MULTIPLIERS.FOLLOW_VS_LIKE,
    },
    {
      id: "retweet",
      name: "Repost / Retweet",
      weight: PRODUCTION_ALGO_WEIGHTS.retweet,
      probability: probabilities.retweet,
      contribution: PRODUCTION_ALGO_WEIGHTS.retweet * probabilities.retweet,
      type: "positive",
      explanation: "Broadcast distribution to followers (+1.0 weight, 2x Like).",
      multiplierVsLike: MULTIPLIERS.RETWEET_VS_LIKE,
    },
    {
      id: "favorite",
      name: "Favorite / Like",
      weight: PRODUCTION_ALGO_WEIGHTS.favorite,
      probability: probabilities.favorite,
      contribution: PRODUCTION_ALGO_WEIGHTS.favorite * probabilities.favorite,
      type: "positive",
      explanation: "Baseline positive engagement signal (+0.5 weight, 1x standard baseline).",
      multiplierVsLike: 1,
    },
    {
      id: "dwell_time",
      name: "Continuous Reading Dwell Time",
      weight: PRODUCTION_ALGO_WEIGHTS.cont_dwell_time,
      probability: probabilities.dwell_time_seconds,
      contribution: PRODUCTION_ALGO_WEIGHTS.cont_dwell_time * probabilities.dwell_time_seconds,
      type: "positive",
      explanation: "+0.004 score added per second reader spends stopped on your tweet.",
      multiplierVsLike: 0.1,
    },
    {
      id: "click",
      name: "Post Expand / Click",
      weight: PRODUCTION_ALGO_WEIGHTS.click,
      probability: probabilities.click,
      contribution: PRODUCTION_ALGO_WEIGHTS.click * probabilities.click,
      type: "positive",
      explanation: "User clicks to view replies or expand full body text (+0.4 weight).",
      multiplierVsLike: 0.8,
    },
    {
      id: "open_link",
      name: "Outbound Link Click",
      weight: PRODUCTION_ALGO_WEIGHTS.open_link,
      probability: probabilities.open_link,
      contribution: PRODUCTION_ALGO_WEIGHTS.open_link * probabilities.open_link,
      type: "neutral",
      explanation: "Outbound clicks score only +0.2 weight and frequently kill dwell time by exiting the app.",
      multiplierVsLike: 0.4,
    },
    // Negative penalties
    {
      id: "not_interested",
      name: "Not Interested Signal Penalty",
      weight: PRODUCTION_ALGO_WEIGHTS.not_interested,
      probability: probabilities.not_interested,
      contribution: PRODUCTION_ALGO_WEIGHTS.not_interested * probabilities.not_interested,
      type: "negative",
      explanation: "Downranks post by -43.2 points (wiping out ~86 likes).",
      multiplierVsLike: -86,
    },
    {
      id: "mute_author",
      name: "Mute Author Penalty",
      weight: PRODUCTION_ALGO_WEIGHTS.mute_author,
      probability: probabilities.mute_author,
      contribution: PRODUCTION_ALGO_WEIGHTS.mute_author * probabilities.mute_author,
      type: "negative",
      explanation: "Downranks account by -58.8 points (wiping out ~117 likes).",
      multiplierVsLike: -117,
    },
    {
      id: "report",
      name: "Report / Safety Violation",
      weight: PRODUCTION_ALGO_WEIGHTS.report,
      probability: probabilities.report,
      contribution: PRODUCTION_ALGO_WEIGHTS.report * probabilities.report,
      type: "negative",
      explanation: "Severe penalty of -234.0 points (wiping out ~468 likes).",
      multiplierVsLike: -468,
    },
  ];

  const positiveTotal = breakdown
    .filter((b) => b.type === "positive")
    .reduce((sum, b) => sum + b.contribution, 0);

  const negativePenaltyTotal = Math.abs(
    breakdown
      .filter((b) => b.type === "negative")
      .reduce((sum, b) => sum + b.contribution, 0)
  );

  const rawScore = Number((positiveTotal - negativePenaltyTotal).toFixed(2));

  // Scale score to 0 - 100 range (Optimal high quality score baseline is ~28.0)
  const optimalScoreBaseline = 28.0;
  const scaledScore = Math.min(
    100,
    Math.max(0, Math.round((Math.max(0, rawScore) / optimalScoreBaseline) * 100))
  );

  // Letter Grade
  let letterGrade: PostAuditResult["letterGrade"] = "C";
  if (scaledScore >= 92) letterGrade = "S";
  else if (scaledScore >= 82) letterGrade = "A+";
  else if (scaledScore >= 72) letterGrade = "A";
  else if (scaledScore >= 58) letterGrade = "B";
  else if (scaledScore >= 42) letterGrade = "C";
  else if (scaledScore >= 25) letterGrade = "D";
  else letterGrade = "F";

  // Actionable Suggestions
  const suggestions: string[] = [];
  if (!hasSavePrompt && !hasListFormatting) {
    suggestions.push("Add a bookmark cue or bullet-point checklist to trigger 'Share via Copy Link' (+20.0, 40x like power).");
  }
  if (!hasQuestionPrompt) {
    suggestions.push("End with an open-ended debate question to trigger Conversation Replies (+5.0, 10x like power).");
  }
  if (hasOutboundLink) {
    suggestions.push("Remove external link from primary tweet and put in reply 1 to prevent dwell time drop.");
  }
  if (whitespaceIndex < 45) {
    suggestions.push("Use more single-line punches and vertical spacing to increase reading dwell time (+0.004/s).");
  }
  if (hookStoppingScore < 60) {
    suggestions.push("Strengthen the first 7 words with high-curiosity verbs, numbers, or contrarian framing.");
  }

  return {
    rawScore,
    scaledScore,
    letterGrade,
    positiveTotal: Number(positiveTotal.toFixed(2)),
    negativePenaltyTotal: Number(negativePenaltyTotal.toFixed(2)),
    probabilities,
    breakdown,
    negativeAlerts: alerts,
    metrics: {
      characterCount: charCount,
      wordCount,
      readingTimeSeconds,
      first7Words,
      hookStoppingScore,
      whitespaceIndex,
      hasOutboundLink,
      outboundLinkPenaltyPercent: hasOutboundLink ? 80 : 0,
      hasMediaMention,
      hasQuestionPrompt,
      hasListFormatting,
      hasHighValueKeywords: hasCuriosityWords,
      sentimentRiskScore,
    },
    suggestions,
  };
}
