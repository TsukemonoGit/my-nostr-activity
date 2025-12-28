const { NostrFetcher } = require('nostr-fetch');
const fs = require('fs');

const { RELAYS, PUBKEYS } = require('./config');

const START_YEAR = 2025;
const CURRENT_DATE = new Date();

async function fetchNostrActivity() {
  const fetcher = NostrFetcher.init();
  
  console.log('Fetching Nostr text notes (kind 1) for 2025 using nostr-fetch...');

  let allEvents = [];
  const startMonth = 0; // Jan
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  for (let month = startMonth; month <= currentMonth; month++) {
    const monthLabel = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
    const since = Math.floor(new Date(currentYear, month, 1).getTime() / 1000);
    const until = Math.floor(new Date(currentYear, month + 1, 1).getTime() / 1000);

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
    const uniqueEvents = Array.from(new Map(allEvents.map(ev => [ev.id, ev])).values());
    
    // Sort chronologically (ascending)
    uniqueEvents.sort((a, b) => a.created_at - b.created_at);

    console.log(`Total unique events: ${uniqueEvents.length}`);
    fs.writeFileSync('nostr_activity.json', JSON.stringify(uniqueEvents, null, 2), 'utf-8');
    console.log('Saved result to nostr_activity.json');

  } catch (err) {
    console.error('Error processing events:', err.message);
  } finally {
    fetcher.shutdown();
  }
}

fetchNostrActivity();
