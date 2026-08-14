export interface ScoringWeights {
  favorite: number;
  reply: number;
  bidirectional_follow_reply: number;
  retweet: number;
  quote: number;
  share: number;
  share_via_dm: number;
  share_via_copy_link: number;
  click: number;
  open_link: number;
  profile_click: number;
  vqv: number;
  dwell: number;
  cont_dwell_time: number;
  follow_author: number;
  // Negative weights
  not_interested: number;
  block_author: number;
  mute_author: number;
  report: number;
  not_dwelled: number;
  // Out of network discount
  oon_weight_factor: number;
}

export interface PredictedProbabilities {
  favorite: number;
  reply: number;
  bidirectional_reply: number;
  retweet: number;
  quote: number;
  share: number;
  share_via_dm: number;
  share_via_copy_link: number;
  click: number;
  open_link: number;
  profile_click: number;
  vqv: number;
  dwell_time_seconds: number;
  follow_author: number;
  // Negative signals
  not_interested: number;
  block_author: number;
  mute_author: number;
  report: number;
  not_dwelled: number;
}

export interface ScoreBreakdownItem {
  id: string;
  name: string;
  weight: number;
  probability: number;
  contribution: number;
  type: "positive" | "negative" | "neutral";
  explanation: string;
  multiplierVsLike: number;
}

export interface NegativeRiskAlert {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  penaltyScore: number;
  recommendation: string;
}

export interface PostAuditResult {
  rawScore: number;
  scaledScore: number; // 0 - 100
  letterGrade: "S" | "A+" | "A" | "B" | "C" | "D" | "F";
  positiveTotal: number;
  negativePenaltyTotal: number;
  probabilities: PredictedProbabilities;
  breakdown: ScoreBreakdownItem[];
  negativeAlerts: NegativeRiskAlert[];
  metrics: {
    characterCount: number;
    wordCount: number;
    readingTimeSeconds: number;
    first7Words: string;
    hookStoppingScore: number; // 0 - 100
    whitespaceIndex: number; // 0 - 100
    hasOutboundLink: boolean;
    outboundLinkPenaltyPercent: number;
    hasMediaMention: boolean;
    hasQuestionPrompt: boolean;
    hasListFormatting: boolean;
    hasHighValueKeywords: boolean;
    sentimentRiskScore: number;
  };
  suggestions: string[];
}

export interface HookTemplate {
  id: string;
  name: string;
  category: "curiosity" | "contrarian" | "story" | "cheat_sheet" | "case_study" | "how_to" | "fomo" | "warning" | "before_after" | "advantage" | "question" | "resource";
  hook: string;
  description: string;
  whyItWorks: string;
  targetMetric: "Copy Link (40x)" | "Replies (10x)" | "Dwell Time" | "Quotes (10x)" | "Follows (8x)";
  example: string;
}

export interface RewriteOption {
  mode: "copy_link" | "reply_magnet" | "dwell_extender" | "derisk_negative";
  title: string;
  description: string;
  icon: string;
  color: string;
  rewrittenText: string;
  scoreDelta: number;
  scoreBefore: number;
  scoreAfter: number;
  keyChanges: string[];
}

export interface ThreadTweet {
  id: string;
  content: string;
  order: number;
  characterCount: number;
  predictedDropOffPct: number;
  role: "hook" | "context" | "meat" | "climax" | "cta";
}

export interface TimelineSimulationState {
  authorFollowers: number;
  isMutualFollow: boolean;
  isColdStartEligible: boolean;
  postAgeHours: number;
  hasVideo10s: boolean;
  candidateSource: "thunder_in_network" | "phoenix_two_tower" | "simclusters";
  retrievalScore: number;
  hydrationPassed: boolean;
  visibilityPassed: boolean;
  finalRank: number;
  feedPositionSlot: number;
  reachMultiplier: number;
}
