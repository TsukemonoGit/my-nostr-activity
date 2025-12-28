const { NostrFetcher } = require("nostr-fetch");
const fs = require("fs");
const path = require("path");

const { RELAYS, PUBKEYS, YEAR } = require("./config");

async function fetchNostrActivity() {
  const fetcher = NostrFetcher.init();

  console.log(
    `Fetching Nostr text notes (kind 1) for ${YEAR} using nostr-fetch...`
  );

  let allEvents = [];
  const startMonth = 0; // Jan
  const now = new Date();
  const currentMonth = now.getMonth();

  for (let month = startMonth; month <= currentMonth; month++) {
    const monthLabel = `${YEAR}-${String(month + 1).padStart(2, "0")}`;
    const since = Math.floor(new Date(YEAR, month, 1).getTime() / 1000);
    const until = Math.floor(new Date(YEAR, month + 1, 1).getTime() / 1000);

    process.stdout.write(`- Fetching ${monthLabel}... `);

    try {
      const events = await fetcher.fetchAllEvents(
        RELAYS,
        { authors: PUBKEYS, kinds: [1] },
        { since, until },
        { sort: true }
      );
      allEvents = allEvents.concat(events);
      console.log(`Done (${events.length} events)`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  try {
    console.log(`Total events fetched: ${allEvents.length}`);

    // Final dedup (though nostr-fetch handles it, just in case)
    const uniqueEvents = Array.from(
      new Map(allEvents.map((ev) => [ev.id, ev])).values()
    );

    // Sort chronologically (ascending)
    uniqueEvents.sort((a, b) => a.created_at - b.created_at);

    console.log(`Total unique events: ${uniqueEvents.length}`);
    const outDir = path.join(__dirname, YEAR);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, "nostr_activity.json");
    fs.writeFileSync(outPath, JSON.stringify(uniqueEvents, null, 2), "utf-8");
    console.log(`Saved result to ${outPath}`);
  } catch (err) {
    console.error("Error processing events:", err.message);
  } finally {
    fetcher.shutdown();
  }
}

fetchNostrActivity();
