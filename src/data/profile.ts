export const profile = {
  name: "Mehmet Melih Kalli",
  location: "Istanbul, Türkiye",
  headline: "Technical Lead & Product Owner",
  contact: {
    email: "melihkalli@hotmail.com",
    linkedin: "linkedin.com/in/mehmet-melih-kalli-aa0a3a17b",
  },
  roles: [
    {
      company: "Akbank",
      role: "Technical Lead & Product Owner",
      start: "2022-06",
      end: null,
    },
    {
      company: "Akbank",
      role: "Senior Software Architect",
      start: "2021-11",
      end: "2022-06",
    },
    {
      company: "Akbank",
      role: "Software Architect",
      start: "2019-11",
      end: "2021-11",
    },
    {
      company: "OBSS",
      role: "Software Development Manager",
      start: "2017-07",
      end: "2019-11",
    },
    {
      company: "VeriPark",
      role: "Team Leader",
      start: "2011-05",
      end: "2017-07",
    },
  ],
  education: {
    degree: "BSc in Computer Engineering",
    institution: "Anadolu University",
    startYear: 2006,
    endYear: 2011,
  },
  skills: [".NET Core", "C#", "Microsoft SQL Server"],
  certification: "MCSA: Web Applications",
  languages: ["English, professional working proficiency"],
  careerFocus: [
    "technical leadership",
    "product ownership",
    "software architecture",
    "enterprise systems",
    "engineering management",
  ],
  portfolioPublished: false,
} as const;

export type CareerRole = (typeof profile.roles)[number];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function formatProfileMonth(value: string | null): string {
  if (value === null) {
    return "present";
  }

  const [year, month] = value.split("-").map(Number);
  return `${monthNames[month - 1]} ${year}`;
}

export function verifiedProfileText(): string {
  const roles = profile.roles
    .map(
      ({ company, role, start, end }, index) =>
        `- ${index === 0 ? "Current role: " : ""}${role} at ${company}, ${formatProfileMonth(start)}–${formatProfileMonth(end)}`,
    )
    .join("\n");

  return [
    `- Name: ${profile.name}`,
    `- Location: ${profile.location}`,
    roles,
    `- Education: ${profile.education.degree}, ${profile.education.institution}, ${profile.education.startYear}–${profile.education.endYear}`,
    `- Core skills: ${profile.skills.join(", ")}`,
    `- Certification: ${profile.certification}`,
    `- Language: ${profile.languages.join("; ")}`,
    `- Career focus: ${profile.careerFocus.join(", ")}`,
    "- Portfolio case studies are being prepared and are not published yet",
    `- Contact: ${profile.contact.email}`,
    `- LinkedIn: ${profile.contact.linkedin}`,
  ].join("\n");
}
