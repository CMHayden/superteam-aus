-- =============================================================================
-- Seed: Stats
-- =============================================================================
insert into stats (label, value, suffix, duration_ms, display_order, hidden_on_mobile) values
  ('Members', 180, '+', 1700, 0, false),
  ('Events Hosted', 40, '', 1500, 1, false),
  ('Projects Built', 95, '+', 1900, 2, false),
  ('Bounties Done', 120, '', 1800, 3, false),
  ('Community Reach', 25, 'k', 2000, 4, true);

-- =============================================================================
-- Seed: Partners
-- =============================================================================
insert into partners (name, image_url, description, benefits, link, display_order) values
  ('Alchemy', '/partners/alchemy.svg', 'Developer platform for building, scaling, and monitoring high-performance web3 apps.', '', 'https://www.alchemy.com/', 0),
  ('Helius', '/partners/helius.svg', 'Solana infrastructure and APIs powering wallets, analytics, and real-time blockchain apps.', '', 'https://www.helius.dev/', 1),
  ('Jupiter', '/partners/jupiter.svg', 'Best-price routing and liquidity aggregation that powers swaps across Solana markets.', '', 'https://jup.ag/', 2),
  ('Raydium', '/partners/raydium.svg', 'On-chain liquidity and trading venue enabling token discovery and capital-efficient markets.', '', 'https://raydium.io/', 3),
  ('Solana', '/partners/solana.svg', 'High-throughput blockchain ecosystem for consumer apps, payments, and global internet-scale products.', '', 'https://solana.com/', 4);

-- =============================================================================
-- Seed: What We Do Cards
-- =============================================================================
insert into what_we_do_cards (title, icon_name, bullets, display_order) values
  ('Builder & Founder Support', 'rocket', ARRAY['Product and technical guidance to help teams ship', 'Support across hackathons, bounties and ecosystem programs'], 0),
  ('Capital & Fundraising', 'chart-line', ARRAY['Connecting capital with investable, scalable projects', 'Founder positioning and investor readiness support'], 1),
  ('Growth & Distribution', 'signal', ARRAY['Go-to-market and growth strategy', 'Access to ecosystem distribution and community'], 2),
  ('Talent & Hiring', 'users', ARRAY['Connecting teams with developers, designers and operators', 'Team formation and scaling support'], 3),
  ('Ecosystem & Community', 'globe', ARRAY['Events, education and ecosystem coordination', 'Showcasing Australian builders on the global stage'], 4),
  ('Institutional Engagement', 'landmark', ARRAY['Bridging builders with institutions and enterprises', 'Policymaker engagement and real-world deployments'], 5);

-- =============================================================================
-- Seed: Testimonials
-- =============================================================================
insert into testimonials (name, role, quote, image_url, display_order) values
  ('Hayden Clarke', 'Founder, Community Lead', 'Superteam AU connected me with builders who actually execute. We went from loose ideas to real products and meaningful momentum.', 'https://i.pravatar.cc/800?img=12', 0),
  ('Priya Raman', 'Full-Stack Builder', 'The weekly sessions gave me accountability and honest feedback. I shipped faster in one month than I did in the previous quarter.', 'https://i.pravatar.cc/800?img=47', 1),
  ('Luca Tran', 'Ecosystem Contributor', 'I came for the meetups, stayed for the people, and ended up contributing to live projects that turned into paid opportunities.', 'https://i.pravatar.cc/800?img=53', 2),
  ('Mia Collins', 'Product Designer', 'Superteam made collaboration easy across design, dev, and growth. Everything moved quicker because I wasn''t building alone.', 'https://i.pravatar.cc/800?img=32', 3);

-- =============================================================================
-- Seed: Tweets
-- =============================================================================
insert into tweets (tweet_id, display_order) values
  ('2039270701329506500', 0),
  ('2043664233997779400', 1),
  ('2043671462163427618', 2),
  ('2043466440528064985', 3),
  ('2043221189133488426', 4),
  ('2042682763028107479', 5),
  ('2042740500890030355', 6),
  ('2042415352509002237', 7);

-- =============================================================================
-- Seed: Carousel Images (event slideshow)
-- =============================================================================
insert into carousel_images (image_url, alt_text, display_order) values
  ('/events/1.jpg', 'Community event 1', 0),
  ('/events/2.jpg', 'Community event 2', 1),
  ('/events/3.jpg', 'Community event 3', 2),
  ('/events/4.jpg', 'Community event 4', 3);

-- =============================================================================
-- Seed: Community Members (Meet the Aussies)
-- =============================================================================
insert into community_members (name, title, role, location, avatar_url, bio, skills, contributions, twitter_url, profile_link, show_on_carousel, display_order) values
  ('Hayden Ross', 'Founder', 'Builder Lead', 'Sydney, NSW', 'https://i.pravatar.cc/160?img=12', 'Hayden leads founder onboarding and helps new builders plug into projects quickly. He runs weekly founder circles focused on shipping and accountability.', ARRAY['BizDev', 'Content', 'Community', 'Ops'], ARRAY['Hackathon wins', 'Projects built', 'DAO contributions'], 'https://x.com/SuperteamAU', 'hayden-ross', true, 0),
  ('Priya Menon', 'Community Ops', 'Operations Manager', 'Brisbane, QLD', 'https://i.pravatar.cc/160?img=5', 'Priya coordinates events and keeps member support running smoothly. She is the go-to for introductions, role matching, and collaboration opportunities.', ARRAY['Ops', 'Content', 'BizDev'], ARRAY['Projects built', 'Grants received', 'Bounties completed'], 'https://x.com/SuperteamAU', 'priya-menon', true, 1),
  ('Luca Tan', 'Product Builder', 'Full-stack Dev', 'Melbourne, VIC', 'https://i.pravatar.cc/160?img=11', 'Luca prototypes product ideas with teams across the network. His focus is taking ideas from concept to clickable product in days, not months.', ARRAY['Dev', 'Design', 'Product'], ARRAY['Hackathon wins', 'Projects built', 'Bounties completed'], 'https://x.com/SuperteamAU', 'luca-tan', true, 2),
  ('Mia Chen', 'Designer', 'Product Design', 'Perth, WA', 'https://i.pravatar.cc/160?img=32', 'Mia helps teams with brand systems and product UX. She mentors early designers in the community and runs regular design critiques.', ARRAY['Design', 'Content', 'Brand'], ARRAY['Projects built', 'DAO contributions'], 'https://x.com/SuperteamAU', 'mia-chen', true, 3),
  ('Nate Walker', 'Growth Lead', 'Growth Strategist', 'Adelaide, SA', 'https://i.pravatar.cc/160?img=51', 'Nate works on growth experiments for ecosystem projects. He shares acquisition playbooks and supports teams with distribution and messaging.', ARRAY['BizDev', 'Content', 'Growth'], ARRAY['Projects built', 'Grants received', 'DAO contributions'], 'https://x.com/SuperteamAU', 'nate-walker', true, 4),
  ('Sora Kim', 'Engineer', 'Infrastructure Dev', 'Canberra, ACT', 'https://i.pravatar.cc/160?img=47', 'Sora builds developer tooling and infrastructure for community products. She also contributes to technical workshops and office-hour sessions.', ARRAY['Dev', 'Infra', 'Content'], ARRAY['Hackathon wins', 'Bounties completed', 'Projects built'], 'https://x.com/SuperteamAU', 'sora-kim', true, 5);

-- =============================================================================
-- Seed: FAQs
-- =============================================================================
insert into faqs (question, answer, display_order) values
  ('What is Superteam Australia', 'Superteam Australia is a community-led network helping builders, founders, and operators start and scale on Solana through programs, events, and ecosystem support.', 0),
  ('How to get involved', 'Join our community channels, attend local meetups, take part in open calls, and contribute through bounties, projects, or events.', 1),
  ('What opportunities are available', 'Opportunities include grants, bounties, hackathons, jobs, collaborations, and introductions to teams, mentors, and ecosystem partners.', 2),
  ('How institutions can engage', 'Institutions can engage through ecosystem briefings, pilot programs, partner events, and direct collaboration with Australian builders and operators.', 3);

-- =============================================================================
-- Seed: Social Links
-- =============================================================================
insert into social_links (platform, url, display_order) values
  ('Twitter / X', 'https://twitter.com/SuperteamAU', 0),
  ('Telegram', 'https://t.me/SuperteamAU', 1),
  ('Discord', 'https://discord.gg/superteam', 2);

-- =============================================================================
-- Seed: Site Config
-- =============================================================================
insert into site_config (key, value) values
  ('footer_description', 'A high-signal community helping Australian builders, founders, creatives, and operators thrive in the Solana ecosystem.'),
  ('join_title', 'Build with us.'),
  ('join_body', 'If you''re an Aussie builder, founder, or web3 enjoyoor you''re in the right place.'),
  ('join_perks', '["Weekly builder calls","Project support & feedback","High-signal community"]'),
  ('twitter_url', 'https://twitter.com/SuperteamAU'),
  ('telegram_url', 'https://t.me/SuperteamAU'),
  ('stats_headline', 'Built by the <span class="text-brand-yellow">community</span>. Backed by the <span class="text-brand-yellow">ecosystem</span>.'),
  ('stats_subtext', 'From meetups across Australia to projects shipped by our members, these numbers reflect real momentum - supported by partners helping push it forward.');

-- =============================================================================
-- Seed: Join Form Roles
-- =============================================================================
insert into join_form_roles (name, description, icon_name, display_order) values
  ('Builder', 'You ship code, protocols or products.', 'code', 0),
  ('Designer', 'UI/UX, brand and visual craft.', 'pen-nib', 1),
  ('Founder', 'Building or scaling a project.', 'rocket', 2),
  ('Creative', 'Content, media and storytelling.', 'film', 3),
  ('Operator', 'Growth, ops, bizdev and community.', 'chart-line', 4),
  ('Institution', 'Enterprise, gov, finance or legal.', 'landmark', 5);

-- =============================================================================
-- Seed: Join Form Locations
-- =============================================================================
insert into join_form_locations (name, location_group, display_order) values
  ('Sydney', 'australia', 0),
  ('Melbourne', 'australia', 1),
  ('Brisbane', 'australia', 2),
  ('Perth', 'australia', 3),
  ('Adelaide', 'australia', 4),
  ('Canberra', 'australia', 5),
  ('Hobart', 'australia', 6),
  ('Darwin', 'australia', 7),
  ('Regional', 'australia', 8),
  ('Asia Pacific', 'abroad', 9),
  ('Europe', 'abroad', 10),
  ('Americas', 'abroad', 11),
  ('Other', 'abroad', 12);

-- =============================================================================
-- Seed: Join Form Skills
-- =============================================================================
insert into join_form_skills (name, role_name, display_order) values
  -- Builder
  ('Rust', 'Builder', 0), ('TypeScript', 'Builder', 1), ('React', 'Builder', 2),
  ('Node.js', 'Builder', 3), ('Smart Contracts', 'Builder', 4), ('Anchor', 'Builder', 5),
  ('DeFi', 'Builder', 6), ('Python', 'Builder', 7), ('Solidity', 'Builder', 8),
  ('Next.js', 'Builder', 9), ('GraphQL', 'Builder', 10), ('DevOps', 'Builder', 11),
  ('Security Auditing', 'Builder', 12), ('Mobile Dev', 'Builder', 13), ('Backend', 'Builder', 14),
  ('Frontend', 'Builder', 15), ('Full-Stack', 'Builder', 16), ('AI / ML', 'Builder', 17),
  -- Designer
  ('UI Design', 'Designer', 0), ('UX Research', 'Designer', 1), ('Branding', 'Designer', 2),
  ('Figma', 'Designer', 3), ('Motion Design', 'Designer', 4), ('Design Systems', 'Designer', 5),
  ('Illustration', 'Designer', 6), ('3D / WebGL', 'Designer', 7), ('Prototyping', 'Designer', 8),
  ('Typography', 'Designer', 9), ('Interaction Design', 'Designer', 10), ('Design Tokens', 'Designer', 11),
  ('User Testing', 'Designer', 12), ('Accessibility', 'Designer', 13),
  -- Founder
  ('Product Strategy', 'Founder', 0), ('Fundraising', 'Founder', 1), ('Go-to-Market', 'Founder', 2),
  ('Team Building', 'Founder', 3), ('Partnerships', 'Founder', 4), ('Tokenomics', 'Founder', 5),
  ('Pitching', 'Founder', 6), ('Product-Market Fit', 'Founder', 7), ('Revenue Models', 'Founder', 8),
  ('Investor Relations', 'Founder', 9), ('Hiring', 'Founder', 10), ('Treasury Management', 'Founder', 11),
  -- Creative
  ('Content Writing', 'Creative', 0), ('Video Production', 'Creative', 1), ('Social Media', 'Creative', 2),
  ('Community Building', 'Creative', 3), ('PR', 'Creative', 4), ('Storytelling', 'Creative', 5),
  ('Podcasting', 'Creative', 6), ('Photography', 'Creative', 7), ('Copywriting', 'Creative', 8),
  ('Memes', 'Creative', 9), ('Newsletters', 'Creative', 10), ('Event Hosting', 'Creative', 11),
  ('Graphic Design', 'Creative', 12), ('Animation', 'Creative', 13),
  -- Operator
  ('Growth', 'Operator', 0), ('Operations', 'Operator', 1), ('BizDev', 'Operator', 2),
  ('Analytics', 'Operator', 3), ('Project Management', 'Operator', 4), ('Community Management', 'Operator', 5),
  ('Talent Sourcing', 'Operator', 6), ('Customer Success', 'Operator', 7), ('Finance', 'Operator', 8),
  ('DAO Governance', 'Operator', 9), ('Partnerships', 'Operator', 10), ('Product Ops', 'Operator', 11),
  ('Data Analysis', 'Operator', 12), ('Event Management', 'Operator', 13),
  -- Institution
  ('Policy', 'Institution', 0), ('Compliance', 'Institution', 1), ('Treasury', 'Institution', 2),
  ('Legal', 'Institution', 3), ('Partnerships', 'Institution', 4), ('Enterprise Strategy', 'Institution', 5),
  ('Risk Management', 'Institution', 6), ('Regulatory Affairs', 'Institution', 7), ('Research', 'Institution', 8),
  ('Custody Solutions', 'Institution', 9), ('Institutional Sales', 'Institution', 10), ('Due Diligence', 'Institution', 11),
  ('Grants Management', 'Institution', 12), ('Government Relations', 'Institution', 13);

-- =============================================================================
-- Seed: Join Form Experience Options
-- =============================================================================
insert into join_form_experience_options (title, subtitle, badge, badge_class, display_order) values
  ('Just exploring', 'Curious about Solana and web3, learning the basics.', 'Newcomer', 'border-lime-400/40 bg-lime-500/10 text-lime-300', 0),
  ('Already building', 'Shipped something or actively working on a project.', 'Builder', 'border-border-yellowmd bg-brand-yellow/10 text-brand-yellow', 1),
  ('Experienced in web3', 'Multiple projects, hackathons or professional roles.', 'Veteran', 'border-amber-400/40 bg-amber-500/10 text-amber-300', 2),
  ('Institutional / enterprise', 'Representing an organisation exploring blockchain tech.', 'Enterprise', 'border-border-yellow bg-surface-hover text-text-secondary', 3);

-- =============================================================================
-- Seed: Join Form "Looking For" Options
-- =============================================================================
insert into join_form_looking_for (label, display_order) values
  ('Hackathons & bounties', 0),
  ('Co-founder matching', 1),
  ('Jobs & contract work', 2),
  ('Grants & funding', 3),
  ('Mentorship & learning', 4),
  ('Events & networking', 5),
  ('Community & ecosystem', 6),
  ('Institutional partnerships', 7);

