const fs = require('fs');
const path = require('path');

/**
 * Mechanically generates a Nostr activity summary Markdown file
 * based on the outputs of fetch and analysis scripts.
 */
function generateSummary() {
  console.log('Generating Nostr Summary (Markdown)...');

  try {
    // 1. Load data
    if (!fs.existsSync('nostr_activity.json') || !fs.existsSync('nostr_engagement.json') || !fs.existsSync('nostr_viral_insights.json')) {
      console.error('Error: Required JSON files (activity, engagement, viral_insights) not found.');
      console.error('Please run fetch and analysis scripts first.');
      return;
    }

    const activity = JSON.parse(fs.readFileSync('nostr_activity.json', 'utf-8'));
    const engagement = JSON.parse(fs.readFileSync('nostr_engagement.json', 'utf-8'));
    const viral = JSON.parse(fs.readFileSync('nostr_viral_insights.json', 'utf-8'));

    // Load prefix from config
    const { NOSTR_LINK_PREFIX } = require('./config');

    // 2. Compute aggregate statistics
    const k7 = engagement.filter(e => e.kind === 7).length;
    const k6 = engagement.filter(e => e.kind === 6).length;
    const k9735 = engagement.filter(e => e.kind === 9735).length;
    const totalEngagement = engagement.length;

    // 3. Construct Markdown
    let md = `# Nostr Activity Review 2025\n\n`;
    md += `### 📊 統計サマリー (Aggregate Statistics)\n`;
    md += `- **総投稿数 (Total Notes):** ${activity.length.toLocaleString()}件\n`;
    md += `- **総リアクション数 (Total Reactions):** ${k7.toLocaleString()}件\n`;
    md += `- **総リポスト数 (Total Reposts):** ${k6.toLocaleString()}件\n`;
    md += `- **総Zap数 (Total Zaps):** ${k9735.toLocaleString()}件\n`;
    md += `- **総エンゲージメント数 (Total Interactions):** ${totalEngagement.toLocaleString()}件\n\n`;
    md += `---\n\n`;

    md += `## 🗓️ 月間ダイジェスト (Monthly Highlights)\n\n`;

    const months = Object.keys(viral).sort();
    if (months.length === 0) {
      md += `*No engagement data available for highlighting.*\n`;
    }

    months.forEach(month => {
      md += `### 📅 ${month}\n`;
      md += `- **🌟 月間トップ投稿:**\n`;
      
      const topPosts = viral[month];
      topPosts.forEach(post => {
        // Clean up content for preview
        const cleanContent = post.content.replace(/\r?\n/g, ' ').trim();
        const contentSnippet = cleanContent.substring(0, 60) + (cleanContent.length > 60 ? '...' : '');
        
        md += `  - **「${contentSnippet}」**\n`;
        md += `    - 統計: Total ${post.stats.total} (Reactions: ${post.stats.reactions}, Reposts: ${post.stats.reposts}, Zaps: ${post.stats.zaps})\n`;
        
        if (NOSTR_LINK_PREFIX === 'nostr:') {
          md += `    - nostr:${post.id}\n`;
        } else {
          const link = `${NOSTR_LINK_PREFIX}${post.id}`;
          md += `    - [Link](${link})\n`;
        }
      });
      md += `\n`;
    });

    md += `---\n`;
    md += `**Note:** This report was generated mechanically from local JSON data.\n`;
    md += `*Generated on: ${new Date().toLocaleString()}*\n`;
    md += `\nThis report was created by [my-nostr-activity](https://github.com/TsukemonoGit/my-nostr-activity).\n`;

    // 4. Save file
    const outputPath = 'nostr_summary_2025.md';
    fs.writeFileSync(outputPath, md, 'utf-8');
    console.log(`Successfully generated ${outputPath}`);

  } catch (err) {
    console.error('Error during generation:', err.message);
  }
}

generateSummary();
