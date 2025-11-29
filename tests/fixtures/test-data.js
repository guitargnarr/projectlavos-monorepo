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

// Mock API responses for success scenarios
const apiMocks = {
  restaurantAnalysis: {
    status: 200,
    contentType: 'application/json',
    body: {
      overall_rating: 4.5,
      total_reviews: 127,
      sentiment_summary: {
        positive: 65,
        neutral: 25,
        negative: 10
      },
      themes: [
        { name: 'Service', sentiment: 'positive', count: 48, percentage: 38 },
        { name: 'Food Quality', sentiment: 'positive', count: 42, percentage: 33 },
        { name: 'Atmosphere', sentiment: 'positive', count: 35, percentage: 28 },
        { name: 'Wait Time', sentiment: 'mixed', count: 15, percentage: 12 },
        { name: 'Price', sentiment: 'neutral', count: 12, percentage: 9 }
      ],
      recommendations: [
        'Great for date night',
        'Reserve ahead for weekends',
        'Try the signature bourbon cocktails'
      ],
      summary: 'Highly rated upscale dining with exceptional service and food quality. Minor concerns about wait times during peak hours.'
    }
  },
  emailScore: {
    status: 200,
    contentType: 'application/json',
    body: {
      score: 85,
      grade: 'A',
      feedback: [
        { category: 'Personalization', score: 90, comment: 'Good use of specific details' },
        { category: 'Value Proposition', score: 85, comment: 'Clear benefit stated' },
        { category: 'Call to Action', score: 80, comment: 'Specific time options provided' }
      ]
    }
  }
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
  apiMocks,
  errorScenarios
};
