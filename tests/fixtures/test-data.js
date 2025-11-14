// Test data fixtures for E2E tests

const restaurants = [
  { name: "Jack Fry's", type: "Upscale Southern", icon: "🍽️" },
  { name: "Proof on Main", type: "Contemporary American", icon: "🥂" },
  { name: "Hammerheads", type: "Gastropub", icon: "🍺" },
  { name: "Bourbon Raw", type: "Seafood & Sushi", icon: "🍣" },
  { name: "Milkwood", type: "Modern American", icon: "🍷" }
];

const sampleEmails = {
  good: {
    subject: "Cut Your Restaurant's Review Analysis Time by 10 Hours/Week",
    body: `Hi Sarah,

I noticed Proof on Main has over 500 Google reviews - that's fantastic! But I imagine analyzing all that feedback to find actionable insights takes your team hours each week.

Would you be interested in a free 15-minute demo next Tuesday or Thursday?

Best,
Matthew Scott`
  },
  bad: {
    subject: "Revolutionary AI Solution for Your Business!!!",
    body: `Dear Sir/Madam,

Greetings!

We are excited to introduce our cutting-edge, revolutionary AI platform!

Click here to schedule a demo: [suspicious link]

Best Regards,
John Smith`
  }
};

const apiEndpoints = {
  local: 'http://localhost:8000',
  staging: 'https://projectlavos-backend-staging.onrender.com',
  production: 'https://projectlavos-backend.onrender.com'
};

const subdomains = {
  main: 'https://projectlavos.com',
  demos: 'https://demos.projectlavos.com',
  about: 'https://about.projectlavos.com',
  services: 'https://services.projectlavos.com'
};

const errorScenarios = [
  {
    name: 'Network Error',
    mockResponse: { status: 0, body: null },
    expectedMessage: /cannot connect|network/i
  },
  {
    name: 'Server Error (500)',
    mockResponse: { status: 500, body: { error: 'Internal Server Error' } },
    expectedMessage: /server error/i
  },
  {
    name: 'Rate Limit (429)',
    mockResponse: { status: 429, body: { error: 'Too Many Requests' } },
    expectedMessage: /too many requests/i
  },
  {
    name: 'Bad Gateway (502)',
    mockResponse: { status: 502, body: { error: 'Bad Gateway' } },
    expectedMessage: /server error/i
  }
];

module.exports = {
  restaurants,
  sampleEmails,
  apiEndpoints,
  subdomains,
  errorScenarios
};
