/*
 * rules.js: the tracking-parameter denylist for Link Wash.
 *
 * This is a denylist on purpose. We only strip params we're sure are tracking
 * cruft and leave everything else alone. Leaving a tracker behind just means a
 * longer URL; stripping a functional param breaks the link, so we err toward
 * keeping things.
 *
 * To add a param, drop a `[name, explanation]` pair into the right group. The
 * explanation shows up verbatim in the popup's "Removed" list, so keep it plain.
 */

/* [key, explanation] tuples. Keys match case-insensitively (see cleaner.js). */
export const TRACKING_PARAMS = [
  /*
   * Generic UTM (Urchin/Google Analytics campaign tags).
   * Attribution only, never needed by the page.
   */
  ['utm_source', 'Tracks which site or app sent you'],
  ['utm_medium', 'Tracks the channel (email, social, ads…)'],
  ['utm_campaign', 'Tracks the marketing campaign name'],
  ['utm_term', 'Tracks the paid-search keyword'],
  ['utm_content', 'Tracks which specific link or ad you clicked'],
  ['utm_id', 'Campaign identifier for analytics'],
  ['utm_name', 'Campaign name for analytics'],
  ['utm_source_platform', 'Platform that drove the campaign'],
  ['utm_creative_format', 'Ad creative format for analytics'],
  ['utm_marketing_tactic', 'Marketing tactic label for analytics'],
  /* The utm_* prefix rule below also catches variants not listed here. */

  /* Click identifiers (per-click tokens from ad networks). */
  ['fbclid', 'Facebook click identifier'],
  ['gclid', 'Google Ads click identifier'],
  ['gclsrc', 'Google Ads click source'],
  ['gbraid', 'Google Ads click identifier (iOS app→web)'],
  ['wbraid', 'Google Ads click identifier (web→app)'],
  ['dclid', 'Google DoubleClick click identifier'],
  ['msclkid', 'Microsoft/Bing Ads click identifier'],
  ['twclid', 'Twitter/X click identifier'],
  ['ttclid', 'TikTok click identifier'],
  ['yclid', 'Yandex click identifier'],
  ['ysclid', 'Yandex click identifier'],
  ['igshid', 'Instagram share identifier'],
  ['igsh', 'Instagram share identifier'],
  ['rdt_cid', 'Reddit click identifier'],
  ['li_fat_id', 'LinkedIn click identifier'],
  ['epik', 'Pinterest click identifier'],
  ['cjevent', 'Commission Junction affiliate click'],
  ['irclickid', 'Impact affiliate click identifier'],

  /* Email-marketing / CRM trackers. */
  ['mc_eid', 'Mailchimp recipient identifier'],
  ['mc_cid', 'Mailchimp campaign identifier'],
  ['vero_id', 'Vero email recipient identifier'],
  ['vero_conv', 'Vero conversion identifier'],
  ['_hsenc', 'HubSpot email tracking token'],
  ['_hsmi', 'HubSpot email message identifier'],
  ['hsCtaTracking', 'HubSpot call-to-action tracking'],
  ['oly_enc_id', 'Omeda/Olytics encoded recipient ID'],
  ['oly_anon_id', 'Omeda/Olytics anonymous visitor ID'],
  ['ml_subscriber', 'MailerLite subscriber identifier'],
  ['ml_subscriber_hash', 'MailerLite subscriber hash'],
  ['mkt_tok', 'Marketo email tracking token'],

  /* Site analytics / vendor-specific. */
  ['s_cid', 'Adobe/site campaign identifier'],
  ['_ga', 'Google Analytics cross-domain visitor ID'],
  ['_gl', 'Google Analytics cross-domain linker'],
  ['pk_campaign', 'Matomo/Piwik campaign name'],
  ['pk_kwd', 'Matomo/Piwik keyword'],
  ['pk_source', 'Matomo/Piwik source'],
  ['pk_medium', 'Matomo/Piwik medium'],
  ['mtm_campaign', 'Matomo campaign name'],
  ['mtm_keyword', 'Matomo keyword'],
  ['mtm_source', 'Matomo source'],
  ['mtm_medium', 'Matomo medium'],
  ['piwik_campaign', 'Piwik campaign name'],
  ['piwik_keyword', 'Piwik keyword'],

  /*
   * Amazon / Alibaba / large e-commerce.
   * Attribution/session tags, not the product id, so safe to drop. Amazon's
   * product id lives in the path (/dp/ASIN), not in these params.
   */
  ['spm', 'Alibaba/Taobao traffic-source path tracker'],
  ['scm', 'Alibaba/Taobao recommendation tracker'],
  ['pd_rd_w', 'Amazon recommendation tracking'],
  ['pd_rd_wg', 'Amazon recommendation tracking'],
  ['pd_rd_r', 'Amazon recommendation tracking'],
  ['pf_rd_p', 'Amazon placement tracking'],
  ['pf_rd_r', 'Amazon placement tracking'],
  ['_encoding', 'Amazon redundant encoding hint'],
  ['psc', 'Amazon product-selection click flag'],
  ['th', 'Amazon variant-selection tracking'],

  /* Misc / cross-vendor. */
  ['__s', 'Drip email subscriber identifier'],
  ['wickedid', 'Wicked Reports tracking identifier'],
  ['hsa_cam', 'Google Ads (HubSpot) campaign'],
  ['hsa_grp', 'Google Ads (HubSpot) ad group'],
  ['hsa_ad', 'Google Ads (HubSpot) ad id'],
  ['guccounter', 'Yahoo consent-redirect counter'],
  ['guce_referrer', 'Yahoo consent-redirect referrer'],
  ['guce_referrer_sig', 'Yahoo consent-redirect signature'],
];

/*
 * Strip any param whose name starts with one of these. Catches the whole UTM
 * family (utm_anything) without listing every variant.
 */
export const TRACKING_PREFIXES = [
  ['utm_', 'Analytics campaign tag'],
  ['pk_', 'Matomo/Piwik analytics tag'],
  ['mtm_', 'Matomo analytics tag'],
  ['hsa_', 'Google Ads (HubSpot) tag'],
];

/*
 * Ambiguous "ref"-style params. Some sites actually route on these (a referral
 * program where ?ref=alice is functional), so we don't remove them by default.
 * Only stripped when the user turns on Aggressive mode.
 */
export const AGGRESSIVE_PARAMS = [
  ['ref', 'Referrer/share source (kept unless aggressive mode is on)'],
  ['ref_src', 'Referrer source'],
  ['ref_url', 'Referrer URL'],
  ['referrer', 'Referrer source'],
  ['source', 'Generic source tag'],
];

/*
 * Fragment trackers. We normally leave the #fragment alone since it often
 * drives in-page navigation (#section-2) or SPA routing. Only these known
 * tracking keys get stripped from a `#a=b&c=d` style fragment; plain text
 * fragments (#section) are always kept.
 */
export const FRAGMENT_TRACKERS = [
  ['Echobox', 'Echobox social-sharing tracker'],
  ['xtor', 'AT Internet (Xiti) tracker'],
];

/* Default explanation for params removed by a user's custom list. */
export const CUSTOM_PARAM_REASON = 'Removed by your custom rule';
