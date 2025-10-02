# Design Guidelines: MHNET - ISP Customer Management Platform

## Design Approach
**System-Based Approach**: Tailwind UI Dashboard + Stripe Dashboard principles for professional business tools
- **Inspiration**: Linear's clarity + Stripe's payment interface + Notion's organization
- **Core Philosophy**: Operational efficiency, financial clarity, real-time service monitoring for ISP administrators

## Color Palette

**Dark Mode (Primary)**
- Background Base: 220 15% 8%
- Surface Elevated: 220 12% 12%
- Surface Interactive: 220 10% 16%
- Primary Brand: 195 100% 48% (Professional teal-blue for connectivity)
- Success/Active: 142 76% 45%
- Warning: 38 92% 50%
- Error/Overdue: 0 84% 60%
- Revenue/Positive: 142 76% 45%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 70%
- Border Subtle: 220 15% 20%

**Light Mode**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 195 100% 40%
- Text: 220 20% 15%

## Typography

**Font Stack**
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts CDN)
- Monospace: 'JetBrains Mono', monospace (for IP addresses, MAC addresses, account IDs)

**Hierarchy**
- Dashboard Headers: text-2xl/3xl, font-semibold
- Section Titles: text-lg/xl, font-medium
- Body/Forms: text-sm/base, font-normal
- Stat Labels: text-xs, font-medium, uppercase tracking-wider
- Financial Data: text-base/lg, font-semibold, tabular-nums

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component internals: p-2, gap-2
- Cards/Forms: p-4, gap-4
- Sections: p-6, p-8
- Page structure: p-12, p-16

**Grid Structure**
- Sidebar: Fixed 280px (collapsible to 64px)
- Main Content: max-w-7xl with 12-column responsive grid
- Dashboard Widgets: 3-4 column stat cards, 2-column detail layouts

## Component Library

### Navigation & Structure
- **Top Bar**: Search customers (global), notifications (payment reminders), quick actions, admin profile
- **Sidebar**: Dashboard, Customers, Packages, Payments, Network Status, Reports, Settings
- **Breadcrumbs**: For deep navigation (Dashboard > Customers > Customer Detail)

### Customer Management
- **Customer List**: Searchable table with avatar, name, package, status badge, connection quality indicator, last payment, actions
- **Customer Profile Card**: Contact info, service address, installation date, payment history summary, package details, connection stats
- **Status Badges**: Active (green), Suspended (yellow), Disconnected (red), Pending Installation (blue)
- **Quick Actions Menu**: Edit, Suspend Service, View Payments, Message Customer, Connection History

### Package & Billing
- **Package Cards**: Speed tier badge, price/month, features list, customer count, edit button
- **Payment Status Widget**: Paid (green check), Pending (yellow clock), Overdue (red alert), Due in X days
- **Invoice Table**: Invoice #, customer name, amount, due date, status, payment method, download PDF
- **Revenue Dashboard**: Monthly recurring revenue card, collection rate, overdue amounts, payment trends chart
- **Payment Form**: Amount input, payment method dropdown (Cash/Bank Transfer/Mobile Money), date picker, receipt upload, notes

### Network & Operations
- **Network Status Panel**: Total customers online/offline, bandwidth usage graph, service areas map view
- **Installation Queue**: Pending installations list with scheduled date, technician assigned, address, priority flag
- **Ticket System**: Support tickets table with priority badges, assigned tech, status, timestamp
- **Connection Quality Indicator**: Signal strength bars (5 levels), ping latency, download/upload speeds

### Analytics & Reporting
- **Stat Cards**: Total customers, active connections, MRR, collection rate with trend arrows
- **Revenue Chart**: Line/bar chart showing monthly revenue trends (Chart.js)
- **Customer Growth Graph**: New vs churned customers over time
- **Package Distribution**: Pie chart showing customer distribution across packages
- **Export Reports**: Date range picker, format selection (CSV/PDF/Excel), scheduled reports toggle

### Marketing Landing Page
- **Hero Section**: Large hero image showing ISP technician installing equipment or happy customers using WiFi, overlay with headline "Professional WiFi Management Made Simple" and primary CTA
- **Feature Showcase**: 3-column grid with icons - Customer Management, Payment Tracking, Network Monitoring
- **Dashboard Preview**: Large screenshot of actual MHNET dashboard interface embedded in browser mockup
- **Pricing Tiers**: 3 cards showing Starter/Professional/Enterprise packages with feature comparison
- **Testimonials**: 2-column layout with ISP owner photos and quotes
- **CTA Section**: Sign up form or demo request with background image of network infrastructure

### Forms & Inputs
- **Customer Registration**: Multi-step form (Personal Info > Service Address > Package Selection > Payment Setup)
- **Search Bars**: Global search with filters (by status, package, payment status)
- **Date Range Pickers**: For reports, payment history, connection logs
- **File Upload**: For payment receipts, customer documents, profile photos

### Overlays & Feedback
- **Modals**: Customer detail modal (max-w-3xl), payment collection modal (max-w-lg), confirmation dialogs
- **Toast Notifications**: "Payment recorded", "Customer status updated", "Service suspended" - top-right, 4s auto-dismiss
- **Loading States**: Skeleton screens for tables/cards, spinner for form submissions
- **Empty States**: Friendly illustration for "No customers yet" with "Add Customer" CTA

## Images

**Landing Page Images Required**:
- **Hero Image**: High-quality photo of ISP technician on rooftop installing WiFi equipment or family/business using internet happily (full-width, 70vh height)
- **Dashboard Preview**: Polished screenshot of MHNET interface showing customer list and stats (embedded in browser mockup, section bg surface elevated)
- **Testimonial Photos**: 2-3 circular headshots of ISP business owners (150px diameter)
- **Feature Icons**: Use Heroicons for features (server, currency, chart-bar, signal)

**Dashboard Images**:
- **Customer Avatars**: Circular profile photos (40px) with initials fallback
- **Empty State Illustrations**: Simple vector graphics for empty tables

## Interactions & Animations

**Minimal Professional Motion**
- Transitions: 150ms cubic-bezier
- Hover: Subtle bg opacity (hover:bg-opacity-80)
- Focus: 2px ring in primary color
- Status Updates: Smooth badge color transitions
- NO decorative animations, scroll effects

## ISP-Specific Patterns

**Financial Clarity**
- Use tabular-nums for all monetary values
- Clear payment status with color coding
- Overdue amounts prominently displayed with red indicators
- Revenue metrics always visible in dashboard header

**Service Lifecycle Management**
- Visual timeline for customer journey (Installation > Active > Renewal cycle)
- Automated payment reminders (3 days before due, on due date, after due)
- Suspension workflow with grace period indicator

**Connection Monitoring**
- Real-time online/offline status with last seen timestamp
- Signal strength visualization (5-bar indicator)
- Bandwidth usage graphs with daily/weekly/monthly views
- Automatic alerts for prolonged disconnections

**Multi-Tenancy Support**
- Service area/zone filtering in all views
- Technician assignment with workload indicators
- Role-based access (Admin/Manager/Technician/Accountant views)

## Accessibility

- WCAG AA contrast maintained across all modes
- Keyboard navigation for all data entry workflows
- Screen reader labels for status badges and icons
- Focus indicators on form inputs and interactive tables
- Consistent dark mode implementation including all inputs