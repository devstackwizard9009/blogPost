require("dotenv").config();

const mongoose = require("mongoose");
const Post = require("../modules/posts/post.model");
const { env } = require("../config/env");
const { postImages } = require("./postMedia");

const seedPosts = [
  {
    title: "The Impact of Technology on the Workplace in 2026",
    slug: "impact-of-technology-on-workplace",
    excerpt:
      "Explore how remote tools, AI assistants, and automation are reshaping modern teams and productivity.",
    content: `Technology has transformed the way teams collaborate, communicate, and deliver results. From cloud platforms to AI copilots, organizations are rethinking workflows to stay competitive.

Remote collaboration tools now allow distributed teams to work as effectively as in-office groups. Video conferencing, async documentation, and project management software have become essential.

At the same time, leaders must balance innovation with employee wellbeing. The most successful companies invest in training, clear processes, and human-centered design.`,
    authorName: "Jason Francisco",
    category: "Technology",
    tags: ["Remote Work", "AI", "Productivity"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-08-20"),
  },
  {
    title: "Global Markets React to New Economic Policies in 2024",
    slug: "global-markets-react-economic-policies-2024",
    excerpt:
      "An overview of how policy shifts are influencing inflation, hiring trends, and investor confidence worldwide.",
    content: `Economic policy changes in major economies are creating ripple effects across global markets. Analysts are watching inflation data closely as central banks adjust interest rates.

Businesses are adapting by optimizing costs, diversifying supply chains, and focusing on resilient revenue models. Startups and enterprises alike are prioritizing financial discipline.

Despite uncertainty, innovation sectors continue to attract investment, especially in green energy, healthcare, and digital infrastructure.`,
    authorName: "Emily Johnson",
    category: "Economy",
    tags: ["Markets", "Inflation", "Finance"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-07-12"),
  },
  {
    title: "How Urban Communities Are Redefining Social Connection",
    slug: "urban-communities-redefining-social-connection",
    excerpt:
      "City neighborhoods are building stronger bonds through local events, shared spaces, and digital community platforms.",
    content: `Urban sociology is evolving as communities blend physical and digital interaction. Local meetups, co-working hubs, and neighborhood apps are helping residents stay connected.

Shared public spaces play a critical role in fostering inclusion and mental wellbeing. Cities investing in parks, libraries, and cultural centers report higher civic engagement.

Researchers suggest that hybrid community models will define the next decade of urban living.`,
    authorName: "Tracey Wilson",
    category: "Sociology",
    tags: ["Community", "Urban Life", "Culture"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-06-28"),
  },
  {
    title: "10 Strategies to Scale Your Startup in a Competitive Market",
    slug: "strategies-scale-startup-competitive-market",
    excerpt:
      "Practical growth tactics for early-stage founders looking to expand without losing product quality.",
    content: `Scaling a startup requires focus, disciplined execution, and a deep understanding of customer needs. Founders who succeed usually combine strong product vision with operational clarity.

Key strategies include refining your ideal customer profile, building repeatable acquisition channels, and investing in customer success early.

Sustainable growth is not only about revenue; it is about building systems that can support larger teams and more complex workflows.`,
    authorName: "Michael Chen",
    category: "Business",
    tags: ["Startup", "Growth", "Leadership"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-05-15"),
  },
  {
    title: "Hidden Gems: 7 Underrated Travel Destinations for 2024",
    slug: "hidden-gems-underrated-travel-destinations-2024",
    excerpt:
      "Skip overcrowded hotspots and discover breathtaking places that offer culture, nature, and authentic experiences.",
    content: `Travelers are increasingly seeking meaningful experiences over crowded tourist landmarks. Smaller cities and regional destinations are gaining popularity for their charm and affordability.

Planning ahead helps travelers enjoy local cuisine, cultural festivals, and scenic routes without the stress of peak-season crowds.

Whether you prefer mountains, coastlines, or historic towns, these destinations offer memorable adventures and excellent photography opportunities.`,
    authorName: "Sarah Williams",
    category: "Travel",
    tags: ["Travel", "Adventure", "Culture"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-04-02"),
  },
  {
    title: "Minimalist Living: Design Habits for a Calmer Daily Routine",
    slug: "minimalist-living-design-habits-calmer-routine",
    excerpt:
      "Simple lifestyle changes that improve focus, reduce clutter, and create a more intentional home environment.",
    content: `Minimalism is not about owning less for its own sake; it is about making room for what truly matters. A calmer space often leads to a calmer mind.

Start with one area of your home, remove unused items, and choose functional furniture with clean lines. Natural light and neutral palettes can dramatically improve mood.

Over time, these small design habits create a lifestyle that supports better rest, creativity, and balance.`,
    authorName: "Jason Francisco",
    category: "Lifestyle",
    tags: ["Minimalism", "Wellness", "Home"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-03-18"),
  },
  {
    title: "Cybersecurity need Every Small Business Should Implement",
    slug: "cybersecurity-essentials-small-business",
    excerpt:
      "Protect your company from common threats with practical security policies, backups, and employee training.",
    content: `Small businesses are frequent targets for phishing, ransomware, and credential theft. A strong security foundation does not require enterprise budgets.

Start with multi-factor authentication, regular software updates, and role-based access controls. Backups should be automated and tested frequently.

Employee awareness training remains one of the most effective defenses against social engineering attacks.`,
    authorName: "Emily Johnson",
    category: "Technology",
    tags: ["Security", "Business", "IT"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-02-10"),
  },
  {
    title: "The Future of Electric Vehicles and Sustainable Transportation",
    slug: "future-electric-vehicles-sustainable-transportation",
    excerpt:
      "How EV adoption, charging infrastructure, and policy incentives are transforming global mobility.",
    content: `Electric vehicle adoption is accelerating as battery technology improves and charging networks expand. Consumers now have more options across price ranges and vehicle types.

Governments are offering incentives to reduce emissions and modernize transportation systems. Fleet operators are also transitioning to electric models to lower long-term costs.

The next phase of growth will depend on grid capacity, battery recycling, and accessible charging in rural and urban areas alike.`,
    authorName: "Michael Chen",
    category: "Economy",
    tags: ["EV", "Sustainability", "Innovation"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2024-01-22"),
  },
  {
    title: "Mental Health in the Digital Age: Finding Balance Online",
    slug: "mental-health-digital-age-finding-balance",
    excerpt:
      "Practical ways to reduce screen fatigue, set boundaries, and protect emotional wellbeing in a connected world.",
    content: `Digital platforms offer connection and opportunity, but constant notifications can increase stress and reduce focus. Building healthy online habits is now a core life skill.

Set clear boundaries for work messaging, curate your feed intentionally, and schedule offline time for movement and rest.

Communities that promote open conversations about mental health create safer spaces for support and growth.`,
    authorName: "Tracey Wilson",
    category: "Sociology",
    tags: ["Mental Health", "Digital Wellness", "Mindfulness"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2023-12-05"),
  },
  {
    title: "Inside the Rise of Creator Economy Platforms",
    slug: "rise-of-creator-economy-platforms",
    excerpt:
      "Creators are building sustainable businesses through subscriptions, brand partnerships, and niche communities.",
    content: `The creator economy has moved beyond viral moments into long-term business models. Platforms now offer monetization tools for writers, educators, designers, and video producers.

Successful creators focus on audience trust, consistent value, and diversified income streams. Community engagement often matters more than follower count.

As tools evolve, creators who understand analytics and storytelling will continue to lead the next wave of digital entrepreneurship.`,
    authorName: "Sarah Williams",
    category: "Business",
    tags: ["Creators", "Monetization", "Media"],
    visibility: "public",
    status: "published",
    publishDate: new Date("2023-11-14"),
  },
].map((post) => ({
  ...post,
  featuredImage: postImages[post.slug],
}));

const runSeed = async () => {
  await mongoose.connect(env.mongoUri);
  console.log("Database connected");

  await Post.deleteMany({});
  const created = await Post.insertMany(seedPosts);

  console.log(`Seeded ${created.length} blog posts with local images.`);
  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
