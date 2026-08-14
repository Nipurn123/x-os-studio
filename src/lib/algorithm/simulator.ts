import { TimelineSimulationState } from "../types";
import { PRODUCTION_ALGO_WEIGHTS } from "./weights";

export function simulateTimelineDistribution(params: {
  authorFollowers: number;
  isMutualFollow: boolean;
  postAgeHours: number;
  hasVideo10s: boolean;
  userCredibilityScore: number; // 0 - 100
  auditScore: number; // 0 - 100
  candidateSource: "thunder_in_network" | "phoenix_two_tower" | "simclusters";
}): TimelineSimulationState {
  const {
    authorFollowers,
    isMutualFollow,
    postAgeHours,
    hasVideo10s,
    userCredibilityScore,
    auditScore,
    candidateSource,
  } = params;

  // 1. Age check (Drop if >48 hours)
  const hydrationPassed = postAgeHours <= 48;

  // 2. Visibility filter check (Drop if user credibility is flagged < 20 or extreme spam)
  const visibilityPassed = hydrationPassed && userCredibilityScore >= 20;

  // 3. Cold start eligibility (<= 1,000 followers and age <= 24h)
  const isColdStartEligible = authorFollowers <= 1000 && postAgeHours <= 24;

  // 4. Candidate Source base score & Out-of-network discount
  let sourceMultiplier = 1.0;
  if (candidateSource === "thunder_in_network") {
    sourceMultiplier = 1.25; // In-network bonus
  } else if (candidateSource === "phoenix_two_tower") {
    sourceMultiplier = PRODUCTION_ALGO_WEIGHTS.oon_weight_factor; // 0.75 OON factor
  } else {
    sourceMultiplier = 0.65; // SimClusters factor
  }

  // 5. Mutual follow boost (+15.0 boost)
  const mutualMultiplier = isMutualFollow ? 1.45 : 1.0;

  // 6. Video VQV bonus
  const videoMultiplier = hasVideo10s ? 1.15 : 1.0;

  // 7. Base retrieval score
  const rawRetrieval = (auditScore / 100) * 45 * sourceMultiplier * mutualMultiplier * videoMultiplier;
  const retrievalScore = Math.min(100, Math.max(0, Number(rawRetrieval.toFixed(2))));

  // 8. Feed position slot calculation
  let slot = 80;
  if (!visibilityPassed) {
    slot = 999; // Dropped
  } else if (isColdStartEligible) {
    // Boosted directly into slot 15-16
    slot = Math.floor(Math.random() * 2) + 15;
  } else if (retrievalScore >= 40) {
    slot = Math.max(1, Math.round(100 - retrievalScore * 2));
  } else {
    slot = Math.min(150, Math.round(150 - retrievalScore * 1.2));
  }

  // Estimated reach multiplier vs baseline post
  let reachMultiplier = Number(((retrievalScore / 20) * (isMutualFollow ? 1.8 : 1.0)).toFixed(2));
  if (!visibilityPassed) reachMultiplier = 0;

  return {
    authorFollowers,
    isMutualFollow,
    isColdStartEligible,
    postAgeHours,
    hasVideo10s,
    candidateSource,
    retrievalScore,
    hydrationPassed,
    visibilityPassed,
    finalRank: slot,
    feedPositionSlot: slot,
    reachMultiplier,
  };
}
