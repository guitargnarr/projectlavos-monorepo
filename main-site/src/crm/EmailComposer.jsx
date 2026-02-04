import { useState, useMemo } from 'react';
import { endpoints } from './api';

function buildEmail(biz) {
  // Fall back to 'there' for generic/non-name contacts
  const rawName = biz.contact_name || '';
  const genericPatterns = /\b(ownership|management|staff|unidentified)\b/i;
  const name = (rawName && !genericPatterns.test(rawName)) ? rawName : 'there';
  const bizName = biz.name || '';
  const demoUrl = biz.demo_url || '';
  const existingUrl = biz.existing_website || '';
  const notes = biz.notes || '';
  const dvp = biz.demo_value_prop || '';
  const q = biz.website_quality || 0;
  const platform = (biz.platform || '').toLowerCase();

  // Extract DVP as a single clean summary (first meaningful sentence)
  // and separate feature list items
  const dvpClean = dvp.replace(/\s+/g, ' ').trim();
  const dvpFeatures = [];
  // Look for feature-like phrases (capitalized items after commas in the DVP)
  const featureMatch = dvpClean.match(/with (.+)/i);
  if (featureMatch) {
    const featurePart = featureMatch[1];
    // Split on commas but keep phrases that belong together
    featurePart.split(',').forEach((f) => {
      const cleaned = f.replace(/\.$/, '').trim();
      if (cleaned.length > 5 && cleaned.length < 80) {
        // Capitalize first letter
        dvpFeatures.push(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
      }
    });
  }
  // Use first 3 features max
  const features = dvpFeatures.slice(0, 3);

  // Extract the best hook from notes
  // Prefer Pitch:-prefixed content (written to be prospect-facing)
  // Then fall back to keyword-matched sentences from general notes
  let hook = '';
  // First pass: extract full Pitch: content from raw notes (before sentence splitting)
  const pitchMatch = notes.match(/Pitch:\s*['"]?(.+?)['"]?\s*$/im);
  if (pitchMatch) {
    hook = pitchMatch[1].trim();
  }

  const notesSentences = notes
    .split(/(?<=[.!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);
  // Fallback: if no Pitch: content, find a keyword-matched sentence
  if (!hook) {
    const pitchKeywords = [
      'potential clients', 'clients research', 'customers', 'first impression',
      'comparing', 'looking online', 'need professional', 'searching',
      'competitive', 'booking', 'visibility', 'trust'
    ];
    for (const sentence of notesSentences) {
      const lower = sentence.toLowerCase();
      if (pitchKeywords.some((kw) => lower.includes(kw))) {
        hook = sentence.replace(/^['"]|['"]$/g, '');
        break;
      }
    }
  }
  // Discard hooks that are internal notes, not prospect-facing
  if (hook) {
    const internalPrefixes = /^(pitch angle:|show the demo|approach:|strategy:|note:)/i;
    const hasPlaceholder = /\$[A-Z]/;
    if (internalPrefixes.test(hook.trim()) || hasPlaceholder.test(hook)) {
      hook = '';
    }
  }
  // Soften internal-sounding language into conversational tone
  if (hook) {
    hook = hook
      // Strip stray quotes anywhere in the hook
      .replace(/['']/g, '')
      // "X NEED Y" -> "A strong Y makes a real difference for X"
      .replace(/(\w[\w\s]+?) NEED (\w[\w\s]+?)(?:\s*[-–—]\s*)/i, (_, who, what) =>
        `A strong ${what.trim().toLowerCase()} makes a real difference for ${who.trim().toLowerCase()} - `)
      // Remove clinical all-caps emphasis
      .replace(/\b[A-Z]{4,}\b/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      // "clients research X extensively" -> "people research X carefully"
      .replace(/clients research/gi, 'people research')
      // "before calling" -> "before reaching out"
      .replace(/before calling/gi, 'before reaching out')
      // "Trust signals are everything" -> softer version
      .replace(/trust signals are everything/gi, 'trust and credibility matter')
      // Clean up any double spaces
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  // Build platform-aware issue description
  let siteIssue = '';
  if (platform.includes('wix')) siteIssue = 'loads slowly and limits what you can do with it';
  else if (platform.includes('squarespace')) siteIssue = 'uses a template that looks similar to competitors';
  else if (platform.includes('wordpress')) siteIssue = 'could use a speed and design refresh';
  else if (platform.includes('facebook') || platform.includes('google')) siteIssue = 'means you\'re relying on social media instead of your own site';
  else if (q <= 1) siteIssue = 'doesn\'t reflect the quality of what you actually do';
  else if (q <= 2) siteIssue = 'could be working a lot harder for you';

  // Determine template type - treat junk existing_website values as no website
  const existingIsReal = existingUrl && !existingUrl.toLowerCase().includes('verify') && !existingUrl.toLowerCase().includes('none') && existingUrl.includes('.');
  let templateType = 'no_website';
  if (existingIsReal && q <= 2) templateType = 'outdated_website';
  else if (existingIsReal) templateType = 'enhancement';

  // Build personalized subject line
  let subject = '';
  if (templateType === 'no_website') {
    subject = `I built ${bizName} a website - take a look`;
  } else if (templateType === 'outdated_website') {
    subject = `${bizName} deserves a website that matches your reputation`;
  } else {
    subject = `A modern refresh for ${bizName}'s online presence`;
  }

  // Build the body
  let body = `Hi ${name},\n\n`;

  if (templateType === 'no_website') {
    body += `I'm a web developer based in Louisville, and I noticed ${bizName} doesn't have a dedicated website yet. So I went ahead and built one for you.\n\n`;
    body += `Take a look: ${demoUrl}\n\n`;
    if (hook) {
      body += `${hook}\n\n`;
    } else {
      body += `A professional site helps new customers find you and builds trust before they even walk through the door.\n\n`;
    }
    if (features.length > 0) {
      body += `Here's what I included:\n`;
      for (const f of features) body += `- ${f}\n`;
      body += '\n';
    }
  } else if (templateType === 'outdated_website') {
    body += `I'm a web developer in Louisville, and I came across ${bizName} while looking at local businesses. You clearly run a great operation`;
    if (siteIssue) {
      body += `, but your current website ${siteIssue}.\n\n`;
    } else {
      body += `, but I think your website could be doing more for you.\n\n`;
    }
    if (hook) {
      body += `${hook}\n\n`;
    }
    body += `I built a modern alternative: ${demoUrl}\n\n`;
    if (features.length > 0) {
      body += `What's different:\n`;
      for (const f of features) body += `- ${f}\n`;
      body += '\n';
    }
  } else {
    body += `I'm a Louisville-based web developer, and I came across ${bizName} while researching local businesses. Your site does a lot right, but I noticed a few areas where it could convert more visitors into customers.\n\n`;
    body += `I built a concept that addresses those gaps: ${demoUrl}\n\n`;
    if (hook) {
      body += `${hook}\n\n`;
    }
    if (features.length > 0) {
      body += `Key improvements:\n`;
      for (const f of features) body += `- ${f}\n`;
      body += '\n';
    }
  }

  body += `This is yours to preview, no strings attached. If you like what you see, I can have it live on your own domain within a week.\n\n`;
  body += `Worth a 15-minute look? Just reply to this email and I'll walk you through it.\n\n`;
  body += `Matthew Scott\nWeb Developer - Louisville, KY\nmatthewdscott7@gmail.com | projectlavos.com`;

  // Flag emails that lack personalization - these shouldn't be sent as-is
  const needsResearch = !hook && features.length === 0;

  return { subject, body, templateType, needsResearch };
}

// Quick generic templates as fallback when user wants a different angle
const ALT_TEMPLATES = {
  no_website: {
    label: 'No Website',
    subject: 'I built {Business} a website - take a look',
    body: `Hi {Owner},

I'm a web developer based in Louisville, and I noticed {Business} doesn't currently have a website. So I built you one.

Take a look: {Demo URL}

This demo includes mobile-friendly design, clear calls to action, and everything a customer needs to find and contact you.

This is yours to preview, no strings attached. If you like it, I can have it live on your own domain within a week.

Worth a 15-minute look? Just reply to this email and I'll walk you through it.

Matthew Scott
Web Developer - Louisville, KY
matthewdscott7@gmail.com | projectlavos.com`,
  },
  outdated_website: {
    label: 'Outdated Site',
    subject: '{Business} deserves a website as good as your service',
    body: `Hi {Owner},

I'm a web developer in Louisville, and I came across {current website}. You clearly run a great business, but your website isn't doing it justice.

I took the liberty of building a modern alternative: {Demo URL}

The new version is faster, mobile-friendly, and designed to convert visitors into customers.

I'm not trying to sell you anything complicated. Just a better online presence that matches the quality of what you actually do.

Worth a 15-minute look? Just reply to this email and I'll walk you through it.

Matthew Scott
Web Developer - Louisville, KY
matthewdscott7@gmail.com | projectlavos.com`,
  },
  enhancement: {
    label: 'Enhancement',
    subject: 'A modern refresh for {Business}\'s website',
    body: `Hi {Owner},

I'm a Louisville-based web developer, and I came across {Business} while researching local businesses. Your site does a lot right, but I noticed a few areas where it could convert more visitors into customers.

I built a concept that addresses those gaps: {Demo URL}

This is yours to preview, no strings attached. If you like it, I can have it live on your own domain within a week.

Worth a 15-minute look? Just reply to this email and I'll walk you through it.

Matthew Scott
Web Developer - Louisville, KY
matthewdscott7@gmail.com | projectlavos.com`,
  },
};

function fillGenericTemplate(template, biz) {
  let subject = template.subject;
  let body = template.body;
  const replacements = {
    '{Business}': biz.name || '',
    '{Owner}': biz.contact_name || 'there',
    '{Demo URL}': biz.demo_url || '',
    '{current website}': biz.existing_website || '',
  };
  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replaceAll(key, value);
    body = body.replaceAll(key, value);
  }
  return { subject, body };
}

export default function EmailComposer({ biz, onClose }) {
  const [mode, setMode] = useState('smart'); // 'smart' or 'generic'
  const smart = useMemo(() => buildEmail(biz), [biz]);
  const [genericType, setGenericType] = useState(smart.templateType);
  const [copied, setCopied] = useState(null);
  const [sendState, setSendState] = useState('idle'); // idle | confirm | sending | sent | error
  const [sendError, setSendError] = useState('');

  const generic = useMemo(
    () => fillGenericTemplate(ALT_TEMPLATES[genericType], biz),
    [biz, genericType]
  );

  const { subject, body, needsResearch } = mode === 'smart' ? smart : { ...generic, needsResearch: false };

  const canSend = biz.contact_email && !needsResearch && sendState !== 'sending' && sendState !== 'sent';

  const handleSend = async () => {
    if (sendState === 'idle') {
      setSendState('confirm');
      return;
    }
    if (sendState !== 'confirm') return;

    setSendState('sending');
    setSendError('');
    const token = localStorage.getItem('outreach_token');
    try {
      const res = await fetch(endpoints.sendEmail(biz.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          body,
          to_email: biz.contact_email,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      setSendState('sent');
      setTimeout(() => onClose(), 2000);
    } catch (e) {
      setSendError(e.message);
      setSendState('error');
    }
  };

  const handleCopy = async (text, field) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  const mailtoUrl = `mailto:${biz.contact_email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-white font-semibold">Compose Email</h2>
            <p className="text-slate-500 text-xs">{biz.name} - {biz.category}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg">&times;</button>
        </div>

        {/* Mode toggle + template selector */}
        <div className="flex items-center gap-3 px-6 pt-4">
          <div className="flex gap-1 bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setMode('smart')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                mode === 'smart' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Personalized
            </button>
            <button
              onClick={() => setMode('generic')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                mode === 'generic' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Generic
            </button>
          </div>

          {mode === 'generic' && (
            <div className="flex gap-1">
              {Object.entries(ALT_TEMPLATES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setGenericType(key)}
                  className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                    genericType === key
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {mode === 'smart' && (biz.notes || biz.demo_value_prop) && (
            <span className="text-xs text-teal-500 ml-auto">Uses research intel</span>
          )}
          {mode === 'smart' && !biz.notes && !biz.demo_value_prop && (
            <span className="text-xs text-orange-400 ml-auto">No research data - using defaults</span>
          )}
        </div>

        {/* Needs research warning */}
        {mode === 'smart' && needsResearch && (
          <div className="mx-6 mt-3 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-orange-400 text-xs font-medium">Needs research before sending</p>
            <p className="text-orange-400/70 text-xs mt-1">This email has no personalized hook or feature bullets. It reads generic and will likely be deleted. Add notes or a demo_value_prop to this business first.</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {/* To */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 w-12 shrink-0">To:</span>
            <span className="text-white">{biz.contact_email || 'No email on file'}</span>
          </div>

          {/* Subject */}
          <div className="flex items-start gap-2 text-sm">
            <span className="text-slate-500 w-12 shrink-0 mt-0.5">Subj:</span>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-white flex-1">{subject}</span>
              <button
                onClick={() => handleCopy(subject, 'subject')}
                className="text-slate-500 hover:text-teal-400 text-xs shrink-0"
              >
                {copied === 'subject' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative">
            <pre className="text-slate-300 text-sm whitespace-pre-wrap bg-slate-800/50 border border-slate-700 rounded-lg p-4 font-sans leading-relaxed max-h-[50vh] overflow-y-auto">
              {body}
            </pre>
            <button
              onClick={() => handleCopy(body, 'body')}
              className="absolute top-2 right-2 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
            >
              {copied === 'body' ? 'Copied' : 'Copy body'}
            </button>
          </div>
        </div>

        {/* Send confirmation / success / error bar */}
        {sendState === 'confirm' && (
          <div className="mx-6 mt-0 mb-0 px-4 py-3 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-center justify-between">
            <p className="text-teal-400 text-xs">Send to <span className="font-medium">{biz.contact_email}</span>?</p>
            <div className="flex gap-2">
              <button onClick={handleSend} className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium rounded transition-colors">
                Confirm Send
              </button>
              <button onClick={() => setSendState('idle')} className="px-3 py-1 text-slate-400 hover:text-white text-xs transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
        {sendState === 'sent' && (
          <div className="mx-6 mt-0 mb-0 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-xs font-medium">Email sent successfully. Closing...</p>
          </div>
        )}
        {sendState === 'error' && (
          <div className="mx-6 mt-0 mb-0 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between">
            <p className="text-red-400 text-xs">Failed: {sendError}</p>
            <button onClick={() => { setSendState('confirm'); }} className="px-3 py-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-800">
          {canSend && (
            <button
              onClick={handleSend}
              disabled={sendState === 'sending'}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
            >
              {sendState === 'sending' && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {sendState === 'sending' ? 'Sending...' : 'Send Email'}
            </button>
          )}
          {biz.contact_email && (
            <a
              href={mailtoUrl}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded transition-colors"
            >
              Open in Mail
            </a>
          )}
          <button
            onClick={() => handleCopy(`Subject: ${subject}\n\n${body}`, 'all')}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded transition-colors"
          >
            {copied === 'all' ? 'Copied' : 'Copy All'}
          </button>
          <button onClick={onClose} className="ml-auto text-slate-500 hover:text-white text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
