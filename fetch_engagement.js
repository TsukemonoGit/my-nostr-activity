const { NostrFetcher } = require('nostr-fetch');
const fs = require('fs');

const { RELAYS, PUBKEYS } = require('./config');

const START_YEAR = 2025;
const CURRENT_DATE = new Date();

async function fetchNostrEngagement() {
  const fetcher = NostrFetcher.init();
  
  console.log('Fetching Nostr engagement (reactions, reposts, zaps) for 2025 using nostr-fetch...');

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
        { 
          kinds: [6, 7, 9735], // Repost, Reaction, Zap
          '#p': PUBKEYS 
        },
        { since, until },
        { sort: true }
      );
      allEvents = allEvents.concat(events);
      console.log(`Done (${events.length} engagement events)`);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  try {
    console.log(`Total engagement events fetched: ${allEvents.length}`);

    // Final dedup and sort (ascending by created_at)
    const uniqueEngagement = Array.from(new Map(allEvents.map(ev => [ev.id, ev])).values());
    uniqueEngagement.sort((a, b) => a.created_at - b.created_at);
    
    console.log(`Total unique engagement: ${uniqueEngagement.length}`);
    fs.writeFileSync('nostr_engagement.json', JSON.stringify(uniqueEngagement, null, 2), 'utf-8');
    console.log('Saved engagement to nostr_engagement.json');

  } catch (err) {
    console.error('Error processing engagement:', err.message);
  } finally {
    fetcher.shutdown();
  }
}

fetchNostrEngagement();
