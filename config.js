/**
 * Nostr Configuration
 *
 * You can edit the values below directly or set environment variables.
 */
const YEAR = "2024";

const RELAYS = process.env.NOSTR_RELAYS
  ? process.env.NOSTR_RELAYS.split(",")
  : ["wss://yabu.me", "wss://x.kojira.io", "wss://nos.lol"];

const PUBKEYS = process.env.NOSTR_PUBKEYS
  ? process.env.NOSTR_PUBKEYS.split(",")
  : [
      "84b0c46ab699ac35eb2ca286470b85e081db2087cdef63932236c397417782f5", // npub1sjcvg...
      "5650178597525e90ea16a4d7a9e33700ac238a1be9dbf3f5093862929d9a1e60", // npub12egp0...
    ];

const NOSTR_LINK_PREFIX = process.env.NOSTR_LINK_PREFIX || "nostr:";

module.exports = {
  RELAYS,
  PUBKEYS,
  NOSTR_LINK_PREFIX,
  YEAR,
};
