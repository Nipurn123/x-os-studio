import { ScoringWeights } from "../types";

/**
 * Exact production weights extracted from X recommendation algorithm codebase
 * Reference: home-mixer/params/param.rs & home-mixer/scorers/ranking_scorer.rs
 */
export const PRODUCTION_ALGO_WEIGHTS: ScoringWeights = {
  // Positive Engagement Weights
  favorite: 0.5,                  // rust_home_mixer_favorite_weight: 0.5 (1x Baseline)
  reply: 5.0,                     // rust_home_mixer_reply_weight: 5.0 (10x Baseline)
  bidirectional_follow_reply: 20.0,// 5.0 base + 15.0 boost (rust_home_mixer_bidirectional_follow_reply_weight_boost: 15.0)
  retweet: 1.0,                   // rust_home_mixer_retweet_weight: 1.0 (2x Baseline)
  quote: 5.0,                     // rust_home_mixer_quote_weight: 5.0 (10x Baseline)
  share: 2.0,                     // rust_home_mixer_share_weight: 2.0 (4x Baseline)
  share_via_dm: 5.0,              // rust_home_mixer_share_via_dm_weight: 5.0 (10x Baseline)
  share_via_copy_link: 20.0,      // rust_home_mixer_share_via_copy_link_weight: 20.0 (40x Baseline - HIGHEST)
  click: 0.4,                     // rust_home_mixer_click_weight: 0.4
  open_link: 0.2,                 // rust_home_mixer_open_link_weight: 0.2 (Downranked relative to native)
  profile_click: 0.0,             // rust_home_mixer_profile_click_weight: 0.0
  vqv: 0.05,                      // rust_home_mixer_vqv_weight: 0.05 (Video Quality View >10s)
  dwell: 0.0,                     // rust_home_mixer_dwell_weight: 0.0
  cont_dwell_time: 0.004,         // rust_home_mixer_cont_dwell_time_weight: 0.004 per active second
  follow_author: 4.0,             // rust_home_mixer_follow_author_weight: 4.0 (8x Baseline)

  // Negative Feedback Penalties (Severe Downrankers)
  not_interested: -43.2,          // rust_home_mixer_not_interested_weight: -43.2 (~86 likes wiped out)
  block_author: -31.2,            // rust_home_mixer_block_author_weight: -31.2 (~62 likes wiped out)
  mute_author: -58.8,             // rust_home_mixer_mute_author_weight: -58.8 (~117 likes wiped out)
  report: -234.0,                 // rust_home_mixer_report_weight: -234.0 (~468 likes wiped out)
  not_dwelled: -0.02,             // rust_home_mixer_not_dwelled_weight: -0.02

  // Feed Discount Factors
  oon_weight_factor: 0.75,        // rust_home_mixer_oon_weight_factor: 0.75 (Out-of-network 25% discount)
};

export const MULTIPLIERS = {
  COPY_LINK_VS_LIKE: 40,
  MUTUAL_REPLY_VS_LIKE: 40,
  REPLY_VS_LIKE: 10,
  QUOTE_VS_LIKE: 10,
  DM_SHARE_VS_LIKE: 10,
  FOLLOW_VS_LIKE: 8,
  RETWEET_VS_LIKE: 2,
};
