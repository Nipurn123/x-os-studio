import { describe, expect, it } from "bun:test";
import { auditPost } from "../lib/algorithm/scorer";
import { PRODUCTION_ALGO_WEIGHTS } from "../lib/algorithm/weights";
import { generateAlgorithmicRewrites } from "../lib/copywriting/rewriter";
import { simulateTimelineDistribution } from "../lib/algorithm/simulator";
import { VIRAL_HOOK_TEMPLATES } from "../lib/copywriting/hooks";

describe("X Algorithm Scoring & Verification Engine", () => {
  it("verifies production weights match xai-org/x-algorithm codebase", () => {
    expect(PRODUCTION_ALGO_WEIGHTS.favorite).toBe(0.5);
    expect(PRODUCTION_ALGO_WEIGHTS.reply).toBe(5.0);
    expect(PRODUCTION_ALGO_WEIGHTS.bidirectional_follow_reply).toBe(20.0);
    expect(PRODUCTION_ALGO_WEIGHTS.share_via_copy_link).toBe(20.0);
    expect(PRODUCTION_ALGO_WEIGHTS.share_via_dm).toBe(5.0);
    expect(PRODUCTION_ALGO_WEIGHTS.follow_author).toBe(4.0);
    expect(PRODUCTION_ALGO_WEIGHTS.retweet).toBe(1.0);
    expect(PRODUCTION_ALGO_WEIGHTS.open_link).toBe(0.2);
    expect(PRODUCTION_ALGO_WEIGHTS.report).toBe(-234.0);
    expect(PRODUCTION_ALGO_WEIGHTS.mute_author).toBe(-58.8);
    expect(PRODUCTION_ALGO_WEIGHTS.not_interested).toBe(-43.2);
    expect(PRODUCTION_ALGO_WEIGHTS.block_author).toBe(-31.2);
    expect(PRODUCTION_ALGO_WEIGHTS.oon_weight_factor).toBe(0.75);
  });

  it("calculates high score for bookmarkable checklist with question prompt", () => {
    const draft = `7 high-signal tools that will save you 20 hours a week (bookmark this):

1. Claude Code - terminal coding
2. Bolt.new - instant prototypes
3. Cursor - fast refactoring

Which one is in your daily workflow?`;

    const result = auditPost(draft);
    expect(result.scaledScore).toBeGreaterThanOrEqual(75);
    expect(result.letterGrade).toMatch(/^(S|A\+|A)$/);
    expect(result.metrics.hasQuestionPrompt).toBe(true);
    expect(result.metrics.hasListFormatting).toBe(true);
    expect(result.metrics.hasOutboundLink).toBe(false);
    expect(result.negativeAlerts.length).toBe(0);
  });

  it("detects outbound link dwell penalty", () => {
    const draftWithLink = "Check out our new tool at https://example.com/app now!";
    const result = auditPost(draftWithLink);
    expect(result.metrics.hasOutboundLink).toBe(true);
    expect(result.metrics.outboundLinkPenaltyPercent).toBe(80);
    expect(result.negativeAlerts.some((a) => a.id === "outbound_link_penalty")).toBe(true);
  });

  it("detects ragebait and applies severe negative penalty alerts", () => {
    const hostileDraft = "You are all stupid idiots if you don't use this scam framework!";
    const result = auditPost(hostileDraft);
    expect(result.negativeAlerts.some((a) => a.id === "ragebait_alert")).toBe(true);
    expect(result.negativePenaltyTotal).toBeGreaterThan(0);
  });

  it("generates 4 valid algorithmic rewrites with positive delta", () => {
    const draft = "Here are some coding tools for developers.";
    const rewrites = generateAlgorithmicRewrites(draft);
    expect(rewrites.length).toBe(4);
    expect(rewrites.map((r) => r.mode)).toEqual([
      "copy_link",
      "reply_magnet",
      "dwell_extender",
      "derisk_negative",
    ]);
  });

  it("accurately simulates cold-start boost into slots 15-16", () => {
    const sim = simulateTimelineDistribution({
      authorFollowers: 350, // <= 1000
      isMutualFollow: true,
      postAgeHours: 4, // <= 24
      hasVideo10s: false,
      userCredibilityScore: 90,
      auditScore: 85,
      candidateSource: "phoenix_two_tower",
    });

    expect(sim.isColdStartEligible).toBe(true);
    expect(sim.visibilityPassed).toBe(true);
    expect(sim.feedPositionSlot).toBeGreaterThanOrEqual(15);
    expect(sim.feedPositionSlot).toBeLessThanOrEqual(16);
  });

  it("drops posts older than 48 hours in hydration stage", () => {
    const sim = simulateTimelineDistribution({
      authorFollowers: 5000,
      isMutualFollow: false,
      postAgeHours: 50, // > 48
      hasVideo10s: false,
      userCredibilityScore: 90,
      auditScore: 75,
      candidateSource: "phoenix_two_tower",
    });

    expect(sim.hydrationPassed).toBe(false);
    expect(sim.visibilityPassed).toBe(false);
    expect(sim.feedPositionSlot).toBe(999);
  });

  it("verifies 12 viral hook templates exist and are structured properly", () => {
    expect(VIRAL_HOOK_TEMPLATES.length).toBe(12);
    for (const hook of VIRAL_HOOK_TEMPLATES) {
      expect(hook.name).toBeDefined();
      expect(hook.hook).toBeDefined();
      expect(hook.whyItWorks).toBeDefined();
      expect(hook.example).toBeDefined();
    }
  });
});
