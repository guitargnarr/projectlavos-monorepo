import { useState } from 'react';

const TEMPLATES = {
  no_website: {
    label: 'No Website',
    subject: 'I built {Business} a website - take a look',
    body: `Hi {Owner},

I'm a web developer based in Louisville, and I noticed {Business} doesn't currently have a website. So I built you one.

Take a look: {Demo URL}

I searched "{search term}" and {Business} didn't come up - which means potential customers can't find you online. This demo includes:

- {Feature 1}
- {Feature 2}

This is yours to preview, no strings attached. If you like it, I can get it live with a custom domain for a very reasonable rate.

Happy to chat anytime.

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

A few things I noticed on your current site:
- {specific issue}

The new version includes:
- {Improvement 1}
- {Improvement 2}

I'm not trying to sell you anything complicated. Just a better online presence that matches the quality of what you actually do.

Would love to show you a quick walkthrough.

Matthew Scott
Web Developer - Louisville, KY
matthewdscott7@gmail.com | projectlavos.com`,
  },
  enhancement: {
    label: 'Enhancement',
    subject: 'A modern refresh for {Business}\'s website',
    body: `Hi {Owner},

I'm a Louisville-based web developer, and I was impressed by what {Business} is doing. Your current site works, but I think there's room to make it really stand out.

I put together a concept: {Demo URL}

A couple enhancements I had in mind:
- {Enhancement 1}
- {Enhancement 2}

This is just a preview to show what's possible. No pressure at all - if it sparks any ideas, I'd be happy to discuss.

Matthew Scott
Web Developer - Louisville, KY
matthewdscott7@gmail.com | projectlavos.com`,
  },
};

function getTemplateType(biz) {
  const q = biz.website_quality || 0;
  if (!biz.existing_website || biz.existing_website.trim() === '') return 'no_website';
  if (q <= 2) return 'outdated_website';
  return 'enhancement';
}

function fillTemplate(template, biz) {
  let subject = template.subject;
  let body = template.body;
  const replacements = {
    '{Business}': biz.name || '',
    '{Owner}': biz.contact_name || 'there',
    '{Demo URL}': biz.demo_url || '',
    '{current website}': biz.existing_website || '',
    '{search term}': `${biz.category?.toLowerCase() || 'business'} Louisville`,
    '{specific issue}': 'The design feels dated and isn\'t mobile-friendly',
    '{Feature 1}': 'Mobile-responsive design that looks great on any device',
    '{Feature 2}': 'Modern layout with clear calls to action',
    '{Improvement 1}': 'Clean, modern design with faster load times',
    '{Improvement 2}': 'Mobile-first layout that works on every device',
    '{Enhancement 1}': 'Refreshed visual design with modern typography',
    '{Enhancement 2}': 'Improved mobile experience and page speed',
  };
  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replaceAll(key, value);
    body = body.replaceAll(key, value);
  }
  return { subject, body };
}

export default function EmailComposer({ biz, onClose }) {
  const templateType = getTemplateType(biz);
  const [activeType, setActiveType] = useState(templateType);
  const template = TEMPLATES[activeType];
  const { subject, body } = fillTemplate(template, biz);
  const [copied, setCopied] = useState(null);

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
            <p className="text-slate-500 text-xs">{biz.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-lg">&times;</button>
        </div>

        {/* Template selector */}
        <div className="flex gap-1 px-6 pt-4">
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeType === key
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

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

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-800">
          {biz.contact_email && (
            <a
              href={mailtoUrl}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded transition-colors"
            >
              Open in Email
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
