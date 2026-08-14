import { NegativeRiskAlert } from "../types";

export function analyzeNegativeRisks(text: string): {
  alerts: NegativeRiskAlert[];
  totalPenaltyEstimate: number;
  sentimentRiskScore: number; // 0 - 100
} {
  const alerts: NegativeRiskAlert[] = [];
  let totalPenalty = 0;
  let riskScore = 5; // baseline calm
  const lower = text.toLowerCase();

  // 1. Extreme Polarization / Bait Detection (Triggers "Not Interested" & "Mute")
  const hateBaitPatterns = [
    /\b(stupid|idiot|moron|retarded|scam|hate|trash|loser|clown)\b/i,
    /\b(wake up sheep|you're all brainwashed|crypto is dead|everyone is dumb)\b/i,
  ];
  if (hateBaitPatterns.some((pattern) => pattern.test(text))) {
    alerts.push({
      id: "ragebait_alert",
      severity: "high",
      title: "Rage-Bait & Hostility Signal Detected",
      description: "Aggressive insult words trigger fast 'Mute Author' (-58.8) and 'Not Interested' (-43.2) reactions.",
      penaltyScore: 58.8,
      recommendation: "Rephrase critique constructively. Critique ideas or processes rather than attacking people.",
    });
    totalPenalty += 58.8;
    riskScore += 45;
  }

  // 2. Outbound Link Trap (Kills Dwell Time & receives 0.2 downweight)
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const urls = text.match(urlRegex) || [];
  if (urls.length > 0) {
    alerts.push({
      id: "outbound_link_penalty",
      severity: "medium",
      title: "Outbound Link Dwell Trap",
      description: "Links open external browsers, destroying continuous dwell time and scoring only 0.2 weight (vs 20.0 for copy-link).",
      penaltyScore: 25.0,
      recommendation: "Move links to the 1st reply or a follow-up thread. Keep the primary post 100% self-contained.",
    });
    totalPenalty += 25.0;
    riskScore += 25;
  }

  // 3. Spammy Hashtag / Mention Stuffing
  const hashtags = (text.match(/#\w+/g) || []).length;
  const mentions = (text.match(/@\w+/g) || []).length;
  if (hashtags > 3 || mentions > 3) {
    alerts.push({
      id: "hashtag_stuffing",
      severity: "medium",
      title: "Hashtag & Mention Clutter",
      description: "More than 2 hashtags or multiple unsolicited mentions flag botmaker and spam filters.",
      penaltyScore: 35.0,
      recommendation: "Reduce to 0-1 relevant hashtags. Natural text performs significantly higher in the semantic retrieval model.",
    });
    totalPenalty += 35.0;
    riskScore += 30;
  }

  // 4. Low-Effort One-Liners (Scroll-by Not-Dwelled penalty)
  if (text.trim().length > 0 && text.trim().length < 35 && !urls.length) {
    alerts.push({
      id: "fast_scroll_drop",
      severity: "low",
      title: "Low Dwell Time Risk",
      description: "Ultra-short posts are passed in <0.5s, failing to register continuous dwell time (+0.004/s).",
      penaltyScore: 5.0,
      recommendation: "Add 1-2 punchy context lines or a takeaway to hold attention for at least 3-5 seconds.",
    });
    totalPenalty += 5.0;
    riskScore += 15;
  }

  // 5. ALL CAPS Aggression
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 20) {
    const uppercaseCount = text.replace(/[^A-Z]/g, "").length;
    if (uppercaseCount / letters.length > 0.55) {
      alerts.push({
        id: "excessive_caps",
        severity: "medium",
        title: "Excessive All-Caps Formatting",
        description: "Heavy caps increase 'Not Interested' and 'Report' triggers from viewers seeking signal.",
        penaltyScore: 20.0,
        recommendation: "Use sentence case with bold Unicode headers or strategic emojis for visual emphasis.",
      });
      totalPenalty += 20.0;
      riskScore += 20;
    }
  }

  return {
    alerts,
    totalPenaltyEstimate: totalPenalty,
    sentimentRiskScore: Math.min(100, riskScore),
  };
}
