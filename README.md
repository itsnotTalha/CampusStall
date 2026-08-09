# CampusStall

**Built on campus. Made for students.**

CampusStall is a full-stack university marketplace where students can discover, buy, sell, and collaborate around ready-made projects, technical services, project support, and student-focused digital resources.

The platform is designed as a modern student ecosystem rather than a simple buy/sell website. It combines project commerce, peer-to-peer services, seller workflows, real-time communication, moderation, and secure digital delivery in one application.

## Live Demo

**Production:** https://campus-stall.vercel.app/

---

## What CampusStall Offers

### Ready-Made Projects

Students can publish projects they have already built and offer them to other users for legitimate learning, reference, customization, and reuse.

Listings can include:

- Source code
- Database files
- Datasets
- Trained models
- Documentation
- Presentation slides
- Installation guides
- Demo files
- Circuit diagrams
- Hardware files
- Seller support

Projects can be organized by category, department, difficulty, technology stack, price, license type, and included resources.

### Hire Talent

Students can discover other students offering services such as:

- Web development
- UI/UX design
- Mobile development
- Machine learning support
- Arduino and IoT assistance
- Debugging
- Technical consultation
- Presentation design
- Tutoring and mentoring
- Project customization

### Project Help

Students can post requests describing what they need help with, including:

- Project debugging
- Technical consultation
- Customization
- Mentoring
- Feature implementation
- Technology-specific assistance

### Digital Perks

CampusStall can also surface legitimate student-focused offers and resources across:

- AI tools
- Development tools
- Design software
- Cloud services
- Learning platforms
- Productivity tools
- Creative software

The platform does not support credential sharing or unauthorized account resale.

---

## Key Features

### Marketplace

- Responsive marketplace browsing
- Search and filtering
- Category-based discovery
- Department and difficulty filters
- Technology tags
- Price filtering
- Sorting
- Saved items
- Similar project discovery

### Project Listings

- Multi-step project publishing workflow
- Project cover image and screenshots
- Demo and video URLs
- Technology stack
- Licensing options
- Package-based pricing
- Included asset selection
- Seller support duration
- Draft and moderation states

### Interactive Project Preview

Project detail pages can provide richer previews depending on project type.

Examples include:

- Dashboard/web project previews
- Machine learning prediction demos
- Screenshot galleries
- Demo links
- Project metadata
- Package comparison

### Authentication

Powered by Supabase Auth.

- Sign up
- Sign in
- Sign out
- Email confirmation
- Protected routes
- Profile creation
- Role-aware access

### Seller Experience

Sellers can:

- Create project listings
- Upload preview media
- Upload private project archives
- Edit their own projects
- View project status
- View orders and sales
- Receive customization requests
- Access seller-focused dashboard information

### Admin Moderation

CampusStall uses a moderation workflow for marketplace quality and security.

```text
Seller submits project
        |
        v
      Pending
        |
        v
 Admin reviews listing
      /       \
     v         v
 Approved    Rejected
     |
     v
Public Marketplace
```

Admin capabilities include:

- View pending projects
- Review project details
- Approve listings
- Reject listings with a reason
- Control public visibility
- Restrict moderation actions to authorized admins

### Messaging

CampusStall includes direct communication between marketplace participants.

- Conversation list
- Project-linked conversations
- Secure message sending
- Participant-only access
- Real-time incoming message updates
- Conversation previews
- Unread-state support where available
- Responsive two-column messaging layout

### Orders and Purchases

The platform includes an order workflow for project purchases.

Typical flow:

```text
Browse Project
      |
      v
Select Package
      |
      v
Checkout
      |
      v
Order Created
      |
      v
Payment / Demo Payment
      |
      v
Buyer Purchase Access
```

### Secure Project Delivery

Project source archives are not exposed as permanent public files.

CampusStall uses:

- Private Supabase Storage
- User/project-specific storage paths
- Server-side authorization
- Temporary signed URLs
- Ownership checks
- Row Level Security

Public preview media and private project archives are handled separately.

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### Backend

- Next.js App Router
- Server Actions / server-side application logic
- Supabase REST/RPC integration

### Database

- PostgreSQL
- Supabase

### Authentication

- Supabase Auth

### Storage

- Supabase Storage

### Realtime

- Supabase Realtime

### Deployment

- Vercel

### Version Control

- Git
- GitHub

---

## Architecture

```text
                         GitHub
                            |
                            v
                         Vercel
                            |
                            v
                   +----------------+
                   |    Next.js     |
                   |  CampusStall   |
                   +--------+-------+
                            |
              +-------------+-------------+
              |                           |
              v                           v
       Supabase Auth               Supabase Database
                                           |
                                           v
                                      PostgreSQL
                                           |
                    +----------------------+-------------------+
                    |                                          |
                    v                                          v
            Supabase Storage                          Supabase Realtime
        +-----------------------+                    Messaging updates
        |                       |
        v                       v
 Public Project Media     Private Project Files
```

---

## Database Design

CampusStall uses relational data for the marketplace and user workflows.

Core tables may include:

```text
profiles
categories
projects
project_packages
project_media
project_files
services
service_packages
orders
reviews
saved_items
project_requests
conversations
messages
digital_perks
```

Relationships are protected using PostgreSQL constraints and Supabase Row Level Security policies.

---

## Security

Security is a central part of the project architecture.

### Row Level Security

RLS is used to ensure users can access only the data they are authorized to use.

Examples:

- Sellers can modify only their own listings.
- Buyers cannot edit seller listings.
- Pending projects are not publicly visible.
- Only admins can perform moderation actions.
- Users can read messages only from conversations they participate in.
- Users cannot forge message sender identities.
- Private project files cannot be accessed without authorization.

### File Security

Project archives are stored separately from public marketplace images.

```text
Public Media
- Cover images
- Screenshots
- Preview assets

Private Files
- Source code archives
- Project ZIP files
- Protected downloadable resources
```

Private downloads use temporary signed URLs rather than permanent public links.

### Secrets

Sensitive credentials must never be exposed through `NEXT_PUBLIC_*` environment variables.

The browser should only receive values explicitly designed for public client use.

---

## Academic Integrity

CampusStall is designed for legitimate student collaboration and learning.

Projects and services are intended for:

- Learning
- Reference
- Customization
- Technical mentoring
- Debugging
- Code review
- Reusable project components
- Licensed project assets
- Legitimate collaboration

CampusStall should not be used for:

- Exam impersonation
- Credential sharing
- Plagiarism
- Submitting another person's assessed work as one's own
- Unauthorized resale of accounts or digital credentials

Buyers remain responsible for following the academic-integrity policies of their institution.

---

## Project Status Workflow

```text
draft
  |
  v
pending
  |
  +------------------+
  |                  |
  v                  v
approved          rejected
  |
  v
publicly visible
```

Suspension can also be supported for listings that require moderation after publication.

---

## Local Development

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd campus-stall
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Add the required values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

If the project uses a production site URL variable:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit `.env.local`.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Supabase Setup

### Initialize Supabase CLI

```bash
npm install supabase --save-dev
npx supabase init
```

### Authenticate

```bash
npx supabase login
```

### Link the local repository

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Apply database migrations

```bash
npx supabase db push
```

Migration files are stored under:

```text
supabase/migrations/
```

Database changes should be made through new migrations rather than modifying migrations already applied to production.

---

## Authentication Configuration

For production authentication, configure Supabase:

**Authentication -> URL Configuration**

Example:

```text
Site URL
https://campus-stall.vercel.app/

Redirect URLs
http://localhost:3000/auth/confirm
https://campus-stall.vercel.app/auth/confirm
```

Use the exact production domain assigned to your deployment.

---

## Vercel Deployment

CampusStall is designed for Vercel deployment.

### Environment Variables

Add the required environment variables in:

```text
Vercel
-> Project
-> Settings
-> Environment Variables
```

At minimum:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Add any other production variables defined in `.env.example`.

### Automatic Deployment

When GitHub is connected to Vercel:

```bash
git add .
git commit -m "your change"
git push origin main
```

A push to the production branch automatically triggers a new Vercel deployment.

Feature branches can be used for preview deployments.

---

## Recommended Development Workflow

```text
Create feature branch
        |
        v
Implement focused change
        |
        v
Run type/lint/build checks
        |
        v
Create Supabase migration if required
        |
        v
Test locally
        |
        v
Push to GitHub
        |
        v
Vercel Preview / Production Deploy
```

For database changes:

```bash
npx supabase db push
```

For application deployment:

```bash
git push origin main
```

---

## Testing Checklist

Before a production release, verify:

- Homepage loads correctly
- Explore marketplace works
- Project detail pages load
- Sign-up works
- Email confirmation redirects correctly
- Sign-in works
- Protected routes reject unauthenticated users
- Seller can create a project
- Project submission becomes `pending`
- Admin can approve/reject a project
- Only approved projects appear publicly
- Project media loads
- Private project archive is not publicly accessible
- Orders can be created
- Authorized buyer download access works
- Conversations load
- Messages send successfully
- Incoming messages update in real time
- One user cannot access another user's private data
- Mobile layouts work correctly
- Production build succeeds

---

## Suggested Repository Structure

```text
campus-stall/
|
|-- src/
|   |-- app/
|   |-- components/
|   |-- lib/
|   |   |-- messages/
|   |   |-- orders/
|   |   |-- projects/
|   |   |-- project-help/
|   |   |-- saved/
|   |   |-- seller-project/
|   |   `-- supabase/
|   `-- types/
|
|-- supabase/
|   |-- migrations/
|   `-- config.toml
|
|-- public/
|-- .env.example
|-- AGENTS.md
|-- package.json
`-- README.md
```

The exact structure may evolve as CampusStall grows.

---

## Future Improvements

Possible future directions include:

- Real payment gateway integration
- Seller payouts
- Advanced marketplace analytics
- Better search and ranking
- Student/university verification
- Notifications
- Typing indicators
- Read receipts
- Online presence
- Message attachments
- Project comparison
- Project recommendation engine
- University-specific marketplace filters
- Seller reputation scoring
- Project quality scoring
- Automated moderation assistance
- Search engine optimization
- Custom domain
- Mobile application

---

## Brand

### CampusStall

**Built on campus. Made for students.**

CampusStall aims to make student-built knowledge, projects, skills, and resources easier to discover, share, improve, and reuse through one secure marketplace.

---

## License

Add the appropriate license for the repository before distributing the source publicly.

If the project is intended to remain proprietary, replace this section with:

```text
Copyright (c) 2026 CampusStall.
All rights reserved.
```