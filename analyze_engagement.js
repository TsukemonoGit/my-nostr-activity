const fs = require('fs');
const { nip19 } = require('nostr-tools');

const { RELAYS } = require('./config');

function hexToNevent(hex) {
    try {
        return nip19.neventEncode({ id: hex, relays: RELAYS });
    } catch (e) {
        return hex;
    }
}

function analyzeEngagement() {
  const notes = JSON.parse(fs.readFileSync('nostr_activity.json', 'utf-8'));
  const engagementEvents = JSON.parse(fs.readFileSync('nostr_engagement.json', 'utf-8'));

  const engagementStats = {};
  notes.forEach(n => {
    engagementStats[n.id] = { reactions: 0, reposts: 0, zaps: 0, total: 0 };
  });

  engagementEvents.forEach(ev => {
    const targetEventId = ev.tags.find(t => t[0] === 'e')?.[1];
    if (targetEventId && engagementStats[targetEventId]) {
      if (ev.kind === 7) engagementStats[targetEventId].reactions++;
      else if (ev.kind === 6) engagementStats[targetEventId].reposts++;
      else if (ev.kind === 9735) engagementStats[targetEventId].zaps++;
      engagementStats[targetEventId].total++;
    }
  });

  const sortedNotes = notes
    .map(n => ({ ...n, stats: engagementStats[n.id] }))
    .filter(n => n.stats.total > 0)
    .sort((a, b) => b.stats.total - a.stats.total);

  const monthlyEngagement = {};
  sortedNotes.forEach(n => {
    const d = new Date(n.created_at * 1000);
    // Use local time grouping: YYYY-MM
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyEngagement[month]) monthlyEngagement[month] = [];
    monthlyEngagement[month].push(n);
  });

  const viralInsights = {};
  Object.keys(monthlyEngagement).sort().forEach(month => {
    viralInsights[month] = monthlyEngagement[month].slice(0, 3).map(n => ({
      id: hexToNevent(n.id), // Store as nevent1 for convenience
      content: n.content,
      stats: n.stats,
      date: new Date(n.created_at * 1000).toISOString()
    }));
  });

  fs.writeFileSync('nostr_viral_insights.json', JSON.stringify(viralInsights, null, 2), 'utf-8');
  console.log('Viral insights generated.');
}

analyzeEngagement();
