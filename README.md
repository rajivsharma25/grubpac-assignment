# GrubPac - Content Broadcasting System

A professional Next.js frontend for managing and broadcasting educational content.

## Features
- **Role-Based Access**: Specialized dashboards for Teachers and Principals.
- **Authentication**: Secure (simulated) login with role-aware redirection.
- **Content Management**:
  - Drag-and-drop file upload with preview (PNG, JPG, GIF).
  - Validation for file size (10MB) and type.
  - Scheduling system (start/end times).
- **Approval Workflow**: Principal can approve or reject content with a mandatory reason.
- **Public Live Broadcast**:
  - Accessible via `/live/:teacherId`.
  - Auto-refresh for new content.
  - Dynamic content rotation based on set durations.
- **Modern UI/UX**:
  - Dark Mode support.
  - Premium aesthetics with smooth transitions.
  - Skeleton loaders and empty states.
  - Responsive design for all screen sizes.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **Utilities**: clsx, tailwind-merge, date-fns

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Credentials (Demo)
- **Principal**: Use `principal@example.com` (any password).
- **Teacher**: Use any other email (e.g., `teacher@example.com`).

## Documentation
Refer to `Frontend-notes.txt` for detailed technical implementation notes.
