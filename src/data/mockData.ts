// All people, organisations and posts here are fictional.
// Dates are generated relative to "now" so the demo always has some
// connections due for reflection.
import type { Connection, Conversation, Invitation, MetEntry, Person, Post } from '../types';
import { addDays, daysAgo, hoursAgo, monthsAgo } from '../lib/utils';

export const ME_ID = 'me';

export const PEOPLE: Person[] = [
  {
    id: ME_ID,
    name: 'Jane Bennet',
    headline: 'MPhil in Technology Policy, University of Cambridge | Previously Research Intern at Lumen Labs',
    location: 'Cambridge, England, United Kingdom',
    avatarColor: 'bg-indigo-600',
    about:
      'I study how platform design shapes professional life. Interested in human–AI interaction, digital labour, and the politics of metrics. Previously built accessibility evaluation tools at Lumen Labs.',
    experience: [
      { title: 'Research Intern', org: 'Lumen Labs', period: 'Jun 2025 – Sep 2025', description: 'Co-built an accessibility evaluation toolkit for conversational interfaces.' },
      { title: 'Data Analyst Intern', org: 'Northwind Analytics', period: 'Jun 2023 – Aug 2023', description: 'Dashboards for the client insights team.' },
    ],
    education: [
      { school: 'University of Cambridge', degree: 'MPhil, Technology Policy', period: '2025 – 2026' },
      { school: 'University of Edinburgh', degree: 'BSc, Computer Science', period: '2021 – 2025' },
    ],
    skills: ['Qualitative research', 'Python', 'Science & technology studies', 'UX research'],
    followers: 306, // followers outside the mock network; mock-network followers are counted from state
    spectrum: { deep: 0, working: 0, light: 0 },
  },
  {
    id: 'p1',
    name: 'Priya Raman',
    headline: 'Senior Research Engineer at Lumen Labs | Human–AI Interaction',
    location: 'London, England, United Kingdom',
    avatarColor: 'bg-rose-600',
    about: 'I build tools that help teams evaluate conversational systems for accessibility and fairness. Previously at the Open Interfaces Lab.',
    experience: [
      { title: 'Senior Research Engineer', org: 'Lumen Labs', period: '2022 – Present' },
      { title: 'Research Engineer', org: 'Open Interfaces Lab', period: '2019 – 2022' },
    ],
    education: [{ school: 'University College London', degree: 'MSc, Human–Computer Interaction', period: '2017 – 2019' }],
    skills: ['Accessibility', 'TypeScript', 'Evaluation design'],
    followers: 4210,
    spectrum: { deep: 24, working: 140, light: 380 },
  },
  {
    id: 'p2',
    name: 'Daniel Okafor',
    headline: 'Policy Fellow, Oakridge Policy Institute | Digital competition & labour markets',
    location: 'London, England, United Kingdom',
    avatarColor: 'bg-amber-700',
    about: 'I research how digital platforms reshape labour markets. Formerly a civil servant working on competition policy.',
    experience: [
      { title: 'Policy Fellow', org: 'Oakridge Policy Institute', period: '2023 – Present' },
      { title: 'Policy Advisor', org: 'Department for Digital Markets (fictional)', period: '2018 – 2023' },
    ],
    education: [{ school: 'London School of Economics', degree: 'MSc, Public Policy', period: '2016 – 2017' }],
    skills: ['Competition policy', 'Labour economics', 'Policy writing'],
    followers: 2890,
    spectrum: { deep: 15, working: 90, light: 610 },
  },
  {
    id: 'p3',
    name: 'Sofia Lindqvist',
    headline: 'Professor of Science & Technology Studies, University of Edinburgh',
    location: 'Edinburgh, Scotland, United Kingdom',
    avatarColor: 'bg-teal-700',
    about: 'I study infrastructures, classification and the quiet politics of standards.',
    experience: [{ title: 'Professor of STS', org: 'University of Edinburgh', period: '2012 – Present' }],
    education: [{ school: 'Uppsala University', degree: 'PhD, Sociology', period: '2003 – 2008' }],
    skills: ['Science & technology studies', 'Ethnography', 'Supervision'],
    followers: 6120,
    spectrum: { deep: 41, working: 230, light: 120 },
  },
  {
    id: 'p4',
    name: 'Marcus Chen',
    headline: 'Product Manager at Northwind Analytics',
    location: 'Manchester, England, United Kingdom',
    avatarColor: 'bg-sky-700',
    about: 'Product manager for analytics tooling. I like simple dashboards and complicated coffee.',
    experience: [
      { title: 'Product Manager', org: 'Northwind Analytics', period: '2021 – Present' },
      { title: 'Business Analyst', org: 'Calder & Finch', period: '2018 – 2021' },
    ],
    education: [{ school: 'University of Manchester', degree: 'BSc, Economics', period: '2015 – 2018' }],
    skills: ['Product management', 'SQL', 'Roadmapping'],
    followers: 1340,
    spectrum: { deep: 9, working: 210, light: 290 },
  },
  {
    id: 'p5',
    name: 'Amara Nwosu',
    headline: 'UX Researcher at Helix Health | MPhil candidate, Cambridge',
    location: 'Cambridge, England, United Kingdom',
    avatarColor: 'bg-fuchsia-700',
    about: 'Researching patient experience with digital health services.',
    experience: [{ title: 'UX Researcher (part-time)', org: 'Helix Health', period: '2024 – Present' }],
    education: [
      { school: 'University of Cambridge', degree: 'MPhil, Technology Policy', period: '2025 – 2026' },
      { school: 'University of Lagos', degree: 'BSc, Psychology', period: '2018 – 2022' },
    ],
    skills: ['UX research', 'Interviewing', 'Health tech'],
    followers: 870,
    spectrum: { deep: 12, working: 85, light: 110 },
  },
  {
    id: 'p6',
    name: 'Liam O’Connell',
    headline: 'Founder & CEO at Quillstack | Building tools for writers',
    location: 'Dublin, Ireland',
    avatarColor: 'bg-lime-700',
    about: 'Founder of Quillstack. Writing about startups, craft and tools.',
    experience: [{ title: 'Founder & CEO', org: 'Quillstack', period: '2022 – Present' }],
    education: [{ school: 'Trinity College Dublin', degree: 'BA, English Literature', period: '2012 – 2016' }],
    skills: ['Entrepreneurship', 'Product strategy', 'Writing'],
    followers: 15400,
    spectrum: { deep: 6, working: 40, light: 2100 },
  },
  {
    id: 'p7',
    name: 'Hana Sato',
    headline: 'Data Scientist at Meridian Transit',
    location: 'Bristol, England, United Kingdom',
    avatarColor: 'bg-cyan-700',
    about: 'Transport data, forecasting, and making maps that people actually read.',
    experience: [{ title: 'Data Scientist', org: 'Meridian Transit', period: '2020 – Present' }],
    education: [{ school: 'University of Bristol', degree: 'MSc, Data Science', period: '2018 – 2019' }],
    skills: ['Forecasting', 'GIS', 'Python'],
    followers: 990,
    spectrum: { deep: 11, working: 70, light: 160 },
  },
  {
    id: 'p8',
    name: 'Rafael Mendes',
    headline: 'Senior Tech Recruiter at TalentBridge | Hiring across Europe',
    location: 'Lisbon, Portugal',
    avatarColor: 'bg-orange-600',
    about: 'Connecting great engineers with great teams. Always happy to chat!',
    experience: [{ title: 'Senior Tech Recruiter', org: 'TalentBridge', period: '2019 – Present' }],
    education: [{ school: 'University of Lisbon', degree: 'BA, Psychology', period: '2012 – 2015' }],
    skills: ['Recruiting', 'Talent acquisition'],
    followers: 22000,
    spectrum: { deep: 3, working: 25, light: 8900 },
  },
  {
    id: 'p9',
    name: 'Elena Petrova',
    headline: 'PhD Candidate, Department of Computer Science and Technology, University of Cambridge',
    location: 'Cambridge, England, United Kingdom',
    avatarColor: 'bg-violet-700',
    about: 'Algorithmic governance, auditing, and public-sector AI. Co-organiser of the Algorithms & Society reading group.',
    experience: [{ title: 'Teaching Assistant', org: 'University of Cambridge', period: '2023 – Present' }],
    education: [
      { school: 'University of Cambridge', degree: 'PhD, Computer Science', period: '2022 – Present' },
      { school: 'ETH Zürich', degree: 'MSc, Computer Science', period: '2020 – 2022' },
    ],
    skills: ['Algorithmic auditing', 'Machine learning', 'Public policy'],
    followers: 1520,
    spectrum: { deep: 18, working: 120, light: 95 },
  },
  {
    id: 'p10',
    name: 'Tomás Herrera',
    headline: 'Software Engineer at Lumen Labs',
    location: 'London, England, United Kingdom',
    avatarColor: 'bg-emerald-700',
    about: 'Frontend engineer. Accessibility nerd.',
    experience: [
      { title: 'Software Engineer', org: 'Lumen Labs', period: '2025 – Present' },
      { title: 'Software Engineering Intern', org: 'Lumen Labs', period: 'Summer 2025' },
    ],
    education: [{ school: 'Imperial College London', degree: 'MEng, Computing', period: '2021 – 2025' }],
    skills: ['React', 'Accessibility', 'Testing'],
    followers: 410,
    spectrum: { deep: 7, working: 60, light: 80 },
  },
  {
    id: 'p11',
    name: 'Grace Whitfield',
    headline: 'Partner at Brightwater Ventures | Investing in civic tech',
    location: 'London, England, United Kingdom',
    avatarColor: 'bg-pink-700',
    about: 'Early-stage investor in civic and climate technology.',
    experience: [{ title: 'Partner', org: 'Brightwater Ventures', period: '2019 – Present' }],
    education: [{ school: 'University of Oxford', degree: 'MBA', period: '2012 – 2013' }],
    skills: ['Venture capital', 'Civic tech'],
    followers: 9800,
    spectrum: { deep: 30, working: 150, light: 1400 },
  },
  {
    id: 'p12',
    name: 'Kwame Asante',
    headline: 'Senior Product Designer at Fieldnote Studio',
    location: 'Cambridge, England, United Kingdom',
    avatarColor: 'bg-yellow-700',
    about: 'Designer working on research tools. Hackathon regular.',
    experience: [{ title: 'Senior Product Designer', org: 'Fieldnote Studio', period: '2021 – Present' }],
    education: [{ school: 'Kingston University', degree: 'BA, Graphic Design', period: '2013 – 2016' }],
    skills: ['Product design', 'Prototyping', 'Design systems'],
    followers: 1700,
    spectrum: { deep: 14, working: 95, light: 300 },
  },
  {
    id: 'p13',
    name: 'Isabel Moreau',
    headline: 'Talent Acquisition Partner at Vireo Consulting',
    location: 'Paris, France',
    avatarColor: 'bg-red-700',
    about: 'Growing teams at Vireo Consulting.',
    experience: [{ title: 'Talent Acquisition Partner', org: 'Vireo Consulting', period: '2021 – Present' }],
    education: [{ school: 'Sciences Po', degree: 'Master, Human Resources', period: '2017 – 2019' }],
    skills: ['Recruiting', 'Employer branding'],
    followers: 6400,
    spectrum: { deep: 4, working: 30, light: 4700 },
  },
  {
    id: 'p14',
    name: 'Noah Feldman',
    headline: 'Research Scientist at Parallax AI | Interpretability',
    location: 'Zürich, Switzerland',
    avatarColor: 'bg-slate-700',
    about: 'Interpretability and evaluation of large models.',
    experience: [{ title: 'Research Scientist', org: 'Parallax AI', period: '2023 – Present' }],
    education: [{ school: 'ETH Zürich', degree: 'PhD, Computer Science', period: '2018 – 2023' }],
    skills: ['Interpretability', 'Machine learning'],
    followers: 5300,
    spectrum: { deep: 19, working: 110, light: 420 },
    suggestionReason: 'You both attended NeurIPS 2025',
  },
  {
    id: 'p15',
    name: 'Aisha Karim',
    headline: 'Head of Responsible Technology at Civic Commons',
    location: 'Birmingham, England, United Kingdom',
    avatarColor: 'bg-blue-800',
    about: 'Leading responsible technology practice at a civic non-profit.',
    experience: [{ title: 'Head of Responsible Technology', org: 'Civic Commons', period: '2022 – Present' }],
    education: [{ school: 'University of Cambridge', degree: 'MPhil, Technology Policy', period: '2017 – 2018' }],
    skills: ['Responsible tech', 'Governance', 'Strategy'],
    followers: 7100,
    spectrum: { deep: 27, working: 160, light: 540 },
    suggestionReason: 'Also studied Technology Policy at Cambridge',
  },
  {
    id: 'p16',
    name: 'Oliver Grant',
    headline: 'Lecturer in Digital Sociology, London School of Economics',
    location: 'London, England, United Kingdom',
    avatarColor: 'bg-stone-700',
    about: 'Platforms, work and the sociology of professional identity.',
    experience: [{ title: 'Lecturer in Digital Sociology', org: 'London School of Economics', period: '2020 – Present' }],
    education: [{ school: 'University of Warwick', degree: 'PhD, Sociology', period: '2014 – 2019' }],
    skills: ['Digital sociology', 'Teaching'],
    followers: 3300,
    spectrum: { deep: 22, working: 180, light: 260 },
    suggestionReason: 'Followed by Sofia Lindqvist and 3 others you know',
  },
  {
    id: 'p17',
    name: 'Mei Lin Zhou',
    headline: 'Engineering Manager at Meridian Transit',
    location: 'Bristol, England, United Kingdom',
    avatarColor: 'bg-purple-800',
    about: 'Leading the journey-planning platform team.',
    experience: [{ title: 'Engineering Manager', org: 'Meridian Transit', period: '2021 – Present' }],
    education: [{ school: 'University of Edinburgh', degree: 'BSc, Computer Science', period: '2010 – 2014' }],
    skills: ['Engineering management', 'Distributed systems'],
    followers: 2100,
    spectrum: { deep: 16, working: 140, light: 230 },
    suggestionReason: 'Also studied Computer Science at Edinburgh',
  },
];

const byId = new Map(PEOPLE.map((p) => [p.id, p]));
export const getPerson = (id: string): Person => byId.get(id)!;

export function initialConnections(): Connection[] {
  return [
    { personId: 'p1', type: 'collaborator', context: 'Co-built the accessibility evaluation toolkit during my 2025 internship at Lumen Labs', theirType: 'collaborator', theirContext: 'Built our accessibility toolkit together', since: monthsAgo(16), lastReviewed: monthsAgo(3) },
    { personId: 'p3', type: 'mentor', context: 'Supervised my undergraduate dissertation on classification systems', theirType: 'mentor', theirContext: 'I supervised Jane’s dissertation', since: monthsAgo(30), lastReviewed: monthsAgo(10) },
    { personId: 'p9', type: 'collaborator', context: 'Co-organise the Algorithms & Society reading group', theirType: 'classmate', theirContext: 'We’re both at Cambridge', since: monthsAgo(8), lastReviewed: monthsAgo(8) },
    { personId: 'p10', type: 'mentee', context: 'Mentored him through his first frontend project at Lumen Labs', theirType: 'mentee', theirContext: 'Jane mentored me during my internship', since: monthsAgo(15), lastReviewed: monthsAgo(4) },
    { personId: 'p5', type: 'classmate', context: 'Same MPhil Technology Policy cohort', theirType: 'classmate', since: monthsAgo(2), lastReviewed: monthsAgo(2) },
    { personId: 'p4', type: 'colleague', context: 'Both at Northwind Analytics in summer 2023 — different teams', theirType: 'met-briefly', theirContext: 'Met at a Northwind all-hands', since: monthsAgo(40), lastReviewed: monthsAgo(14) },
    { personId: 'p2', type: 'met-briefly', context: 'Talked for ten minutes after a panel at the Digital Futures Summit 2024', theirType: 'met-briefly', since: monthsAgo(25), lastReviewed: monthsAgo(14) },
    { personId: 'p6', type: 'online-only', context: 'We commented on each other’s posts about writing tools', theirType: 'online-only', since: monthsAgo(9), lastReviewed: monthsAgo(9) },
    // Connections made "before the redesign" — one click, no description.
    { personId: 'p7', type: 'unspecified', context: '', theirType: null, since: monthsAgo(44), lastReviewed: monthsAgo(44) },
    { personId: 'p8', type: 'unspecified', context: '', theirType: null, since: monthsAgo(28), lastReviewed: monthsAgo(28) },
  ];
}

export function initialInvitations(): Invitation[] {
  return [
    { id: 'inv1', personId: 'p12', direction: 'incoming', type: 'collaborator', context: 'We were on the same team at HackCambridge 2026 — built the transit accessibility prototype', note: 'Great working with you all weekend! Let’s keep in touch.', sentAt: daysAgo(2) },
    { id: 'inv2', personId: 'p11', direction: 'incoming', type: 'met-briefly', context: 'We spoke after your panel at the Cambridge Tech Ethics Forum', note: 'Enjoyed your question about metrics — would love to stay in touch.', sentAt: daysAgo(5) },
    { id: 'inv3', personId: 'p13', direction: 'incoming', type: 'online-only', context: 'I came across your profile', note: 'Hi Jane, I’d like to add you to my professional network.', sentAt: daysAgo(9) },
  ];
}

export function initialFollowing(): string[] {
  return ['p1', 'p3', 'p9', 'p15'];
}

// People who follow Jane without being connected.
const NON_CONNECTION_FOLLOWERS = ['p13', 'p17'];

/** Connections follow each other; a few non-connections follow Jane too. */
export function initialFollowers(connections: Connection[]): string[] {
  return [...connections.map((c) => c.personId), ...NON_CONNECTION_FOLLOWERS];
}

export function initialMetList(): MetEntry[] {
  const metAt = daysAgo(2);
  return [{ personId: 'p16', metAt, expiresAt: addDays(metAt, 7) }];
}

export function initialPosts(): Post[] {
  return [
    {
      id: 'post1',
      authorId: 'p1',
      createdAt: hoursAgo(3),
      content:
        'We just open-sourced our accessibility evaluation toolkit for conversational interfaces. 🎉\n\nHuge thanks to everyone who contributed over the last year — especially the interns who stress-tested every screen-reader flow we could think of.',
      likes: 214,
      comments: 31,
      reposts: 12,
    },
    {
      id: 'post2',
      authorId: 'p15',
      createdAt: hoursAgo(6),
      content:
        'A question I keep returning to: what does a platform *count*, and what does that counting make invisible?\n\nWe measure “engagement” and “reach” because they’re easy to measure, not because they describe what matters.',
      likes: 488,
      comments: 64,
      reposts: 40,
    },
    {
      id: 'post3',
      authorId: 'p8',
      createdAt: hoursAgo(9),
      content:
        '🚀 We’re hiring! 12 open roles across backend, data and ML in Lisbon, Berlin and remote. DM me if you or someone in your network might be interested. #hiring #opentowork',
      likes: 97,
      comments: 18,
      reposts: 22,
    },
    {
      id: 'post4',
      authorId: 'p3',
      createdAt: daysAgo(1),
      content:
        'New paper out with colleagues: “Sorting Things In” — on how classification systems in workplace software quietly reshape what counts as a skill. Open access link in comments.',
      likes: 356,
      comments: 27,
      reposts: 51,
    },
    {
      id: 'post5',
      authorId: 'p9',
      createdAt: daysAgo(2),
      content:
        'This term’s Algorithms & Society reading group starts Thursday. We’re reading on auditing public-sector algorithms. All welcome — no prerequisites, just curiosity.',
      likes: 63,
      comments: 9,
      reposts: 4,
    },
    {
      id: 'post6',
      authorId: 'p6',
      createdAt: daysAgo(3),
      content:
        'Three years of building Quillstack, three lessons:\n\n1. Talk to users weekly.\n2. Ship the boring version first.\n3. Your network is not your customer base.',
      likes: 1290,
      comments: 140,
      reposts: 88,
    },
    {
      id: 'post7',
      authorId: 'p2',
      createdAt: daysAgo(4),
      content:
        'Our new report on platform work and job quality is out. Key finding: workers value predictability of hours more than headline pay rates.',
      likes: 205,
      comments: 22,
      reposts: 30,
    },
  ];
}

export const CONVERSATIONS: Conversation[] = [
  {
    personId: 'p1',
    messages: [
      { from: 'them', text: 'Hey Jane! The toolkit is finally public 🎉', at: hoursAgo(5) },
      { from: 'me', text: 'Amazing!! Congrats to the whole team.', at: hoursAgo(4) },
      { from: 'them', text: 'Couldn’t have done the screen-reader tests without you. Coffee next time you’re in London?', at: hoursAgo(4) },
    ],
  },
  {
    personId: 'p9',
    messages: [
      { from: 'them', text: 'Can you bring the printed readings on Thursday?', at: daysAgo(1) },
      { from: 'me', text: 'Yes, will do.', at: daysAgo(1) },
    ],
  },
  {
    personId: 'p8',
    messages: [
      { from: 'them', text: 'Hi Jane, I came across your profile and think you’d be a great fit for a senior backend role…', at: daysAgo(12) },
    ],
  },
];
