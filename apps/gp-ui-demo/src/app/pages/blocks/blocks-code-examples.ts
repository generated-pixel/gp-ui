export const BLOCKS_CODE_EXAMPLES: Record<string, string> = {
  // ==========================================
  // 1. MULTI-COLUMN LAYOUTS
  // ==========================================
  'three-col-fluid': `<gp-layout-three-column-fluid
  [leftTitle]="'Channels & Folders'"
  [mainTitle]="'Team Discussion Stream'"
  [mainSubtitle]="'Real-time collaborative updates and workspace threads'"
  [rightTitle]="'Context Details'"
>
  <!-- Left Navigation Column Slot -->
  <div slot="left">
    <nav class="channel-tree">
      <a href="#" class="channel-item active"># general</a>
      <a href="#" class="channel-item"># engineering</a>
      <a href="#" class="channel-item"># announcements</a>
    </nav>
  </div>

  <!-- Main Center Column Slot -->
  <div slot="main">
    <div class="message-feed">
      <div class="message-card">
        <strong>Sarah Connor</strong>
        <p>Deployment for release v2.4 completed successfully.</p>
      </div>
    </div>
  </div>

  <!-- Right Details Column Slot -->
  <div slot="right">
    <div class="details-panel">
      <h4>Channel Info</h4>
      <p>34 active members</p>
    </div>
  </div>
</gp-layout-three-column-fluid>`,

  'two-col-split': `<gp-layout-two-column-split
  [splitRatio]="'50/50'"
  [primaryTitle]="'Source Markdown Editor'"
  [primaryBadge]="'Live Sync'"
  [primaryDescription]="'Rich authoring panel with syntax highlighting'"
  [secondaryTitle]="'Rendered Output Preview'"
  [secondaryDescription]="'Real-time compiled DOM representation'"
>
  <div slot="left">
    <textarea class="editor-area" placeholder="Write markdown here..."></textarea>
  </div>
  <div slot="right">
    <div class="preview-output">
      <h1>Live Compiled Preview</h1>
      <p>Content synchronizes automatically as you type.</p>
    </div>
  </div>
</gp-layout-two-column-split>`,

  'three-col-workspace': `<gp-layout-three-column-workspace
  [explorerTitle]="'Project Explorer'"
  [activeFileName]="'dashboard.component.ts'"
  (fileSelect)="onFileSelected($event)"
>
  <div slot="explorer">
    <ul class="file-tree">
      <li>📁 src/app</li>
      <li class="active">📄 dashboard.component.ts</li>
      <li>📄 dashboard.component.html</li>
    </ul>
  </div>

  <div slot="editor">
    <div class="code-editor-container">
      <!-- Embedded Code Editor -->
    </div>
  </div>

  <div slot="inspector">
    <div class="properties-inspector">
      <h4>Component Properties</h4>
      <span>Lines: 142 | Size: 4.2 KB</span>
    </div>
  </div>
</gp-layout-three-column-workspace>`,

  'four-col-grid': `<gp-layout-four-column-grid
  [col1Title]="'Total Pipeline'"
  [col1Badge]="'+18%'"
  [col2Title]="'Active Deals'"
  [col2Badge]="'42 Open'"
  [col3Title]="'Won Revenue'"
  [col3Badge]="'$1.2M'"
  [col4Title]="'Conversion Rate'"
  [col4Badge]="'24.8%'"
>
  <div slot="col1"><div class="col-content">Pipeline details & leads</div></div>
  <div slot="col2"><div class="col-content">Active sales negotiations</div></div>
  <div slot="col3"><div class="col-content">Closed ARR metrics</div></div>
  <div slot="col4"><div class="col-content">Funnel conversion summary</div></div>
</gp-layout-four-column-grid>`,

  // ==========================================
  // 2. SIDEBAR LAYOUTS
  // ==========================================
  'sb-dark': `<gp-layout-sidebar-dark
  [brandName]="'Acme Cloud'"
  [title]="'Enterprise Workspace'"
  [navGroupLabel]="'Main Menu'"
  [userName]="'Sarah Connor'"
  [userEmail]="'s.connor@acme.corp'"
  [activeNavId]="'overview'"
  [navItems]="[
    { id: 'overview', icon: 'grid', label: 'Overview', badge: 'New' },
    { id: 'analytics', icon: 'bar-chart-2', label: 'Analytics' },
    { id: 'customers', icon: 'users', label: 'Customers', badge: '128' },
    { id: 'settings', icon: 'settings', label: 'Settings' }
  ]"
  (navClick)="onNavigate($event)"
  (logoutClick)="onSignOut()"
>
  <div class="workspace-body">
    <h2>Dashboard View</h2>
    <p>Welcome back, Sarah.</p>
  </div>
</gp-layout-sidebar-dark>`,

  'sb-light': `<gp-layout-sidebar-light
  [brandName]="'Nexus UI'"
  [title]="'Project Hub'"
  [activeNavId]="'projects'"
  [navItems]="[
    { id: 'projects', icon: 'folder', label: 'Projects' },
    { id: 'tasks', icon: 'check-circle', label: 'My Tasks', badge: '5' },
    { id: 'team', icon: 'users', label: 'Team Directory' },
    { id: 'reports', icon: 'file-text', label: 'Weekly Reports' }
  ]"
  [upgradeTitle]="'Upgrade to Pro'"
  [upgradeText]="'Get unlimited cloud builds and priority support.'"
  [upgradeBtnLabel]="'Upgrade Now'"
  (upgradeClick)="openUpgradeModal()"
  (navClick)="onNavigate($event)"
>
  <div class="page-container">
    <h3>Active Sprint Projects</h3>
  </div>
</gp-layout-sidebar-light>`,

  'sb-mini': `<gp-layout-sidebar-mini
  [title]="'Compact Shell'"
  [activeNavId]="'dashboard'"
  [userName]="'Alex Rivera'"
  [navItems]="[
    { id: 'dashboard', icon: 'home', tooltip: 'Home Dashboard' },
    { id: 'analytics', icon: 'trending-up', tooltip: 'Telemetry' },
    { id: 'messages', icon: 'message-square', tooltip: 'Inbox', badge: '3' },
    { id: 'settings', icon: 'sliders', tooltip: 'Preferences' }
  ]"
  (navClick)="onNavigate($event)"
>
  <div class="expanded-viewport">
    <h3>Maximum Viewport Application Screen</h3>
  </div>
</gp-layout-sidebar-mini>`,

  'sb-dual': `<gp-layout-sidebar-dual
  [title]="'Multi-Tier Hub'"
  [activeTier1Id]="'apps'"
  [tier1Items]="[
    { id: 'apps', icon: 'layers', label: 'Applications' },
    { id: 'data', icon: 'database', label: 'Databases' },
    { id: 'security', icon: 'shield', label: 'Security' }
  ]"
  [subnavTitle]="'Cloud Apps'"
  [subnavBadge]="'6 Online'"
  [activeTier2Id]="'web-api'"
  [tier2Items]="[
    { id: 'web-api', label: 'Production API Gateway', status: 'healthy' },
    { id: 'auth-svc', label: 'Auth & OAuth Provider', status: 'healthy' },
    { id: 'worker-job', label: 'Background Batch Worker', status: 'busy' }
  ]"
  (tier1Click)="onTier1Select($event)"
  (tier2Click)="onTier2Select($event)"
>
  <div class="main-content">
    <h2>Production API Gateway Status</h2>
  </div>
</gp-layout-sidebar-dual>`,

  'sb-floating': `<gp-layout-sidebar-floating
  [brandName]="'Pulse CRM'"
  [title]="'Sales Hub'"
  [activeNavId]="'pipeline'"
  [navItems]="[
    { id: 'pipeline', icon: 'trello', label: 'Deal Pipeline' },
    { id: 'contacts', icon: 'user', label: 'Contacts' },
    { id: 'forecasts', icon: 'dollar-sign', label: 'Revenue Forecast' }
  ]"
  (navClick)="onNavigate($event)"
>
  <div class="content-panel">
    <h2>Quarterly Deal Funnel</h2>
  </div>
</gp-layout-sidebar-floating>`,

  'sb-gradient': `<gp-layout-sidebar-gradient
  [brandName]="'Aura Cloud'"
  [title]="'Cluster Control'"
  [activeNavId]="'nodes'"
  [navItems]="[
    { id: 'nodes', icon: 'server', label: 'Compute Nodes' },
    { id: 'storage', icon: 'hard-drive', label: 'Block Storage' },
    { id: 'network', icon: 'globe', label: 'VPC Routing' }
  ]"
  (navClick)="onNavigate($event)"
>
  <div class="gradient-shell-content">
    <h2>Cluster Nodes Telemetry</h2>
  </div>
</gp-layout-sidebar-gradient>`,

  'sb-header-over': `<gp-layout-sidebar-header-over
  [brandName]="'Horizon Portal'"
  [userName]="'Elena Vance'"
  [activeNavId]="'inventory'"
  [navItems]="[
    { id: 'inventory', icon: 'package', label: 'Warehouse Inventory' },
    { id: 'shipments', icon: 'truck', label: 'Logistics' },
    { id: 'vendors', icon: 'briefcase', label: 'Supplier Network' }
  ]"
  (navClick)="onNavigate($event)"
  (profileClick)="openProfile()"
>
  <div class="fullwidth-app-area">
    <h2>Warehouse Inventory Matrix</h2>
  </div>
</gp-layout-sidebar-header-over>`,

  'sb-workspace': `<gp-layout-sidebar-workspace
  [currentWorkspace]="'Acme Enterprise Corp'"
  [workspaceTier]="'Enterprise Plan'"
  [title]="'Slack-Style Team Channels'"
  [activeNavId]="'dev-team'"
  [navItems]="[
    { id: 'announcements', icon: 'volume-2', label: 'announcements', type: 'channel' },
    { id: 'dev-team', icon: 'hash', label: 'dev-team', type: 'channel' },
    { id: 'design-crit', icon: 'hash', label: 'design-critique', type: 'channel' }
  ]"
  (workspaceSwitch)="onSwitchWorkspace()"
  (navClick)="onNavigate($event)"
>
  <div class="chat-thread-container">
    <h3># dev-team Channel</h3>
  </div>
</gp-layout-sidebar-workspace>`,

  'sb-search-tree': `<gp-layout-sidebar-search-tree
  [title]="'Documentation Catalog'"
  [catalogLabel]="'API References'"
  [activeLeafId]="'auth-jwt'"
  [treeData]="documentationTree"
  (nodeSelect)="onNodeSelect($event)"
>
  <div class="doc-viewer">
    <h1>JWT Authentication Guide</h1>
    <p>How to configure token-based bearer auth in Angular.</p>
  </div>
</gp-layout-sidebar-search-tree>`,

  'sb-pinned-status': `<gp-layout-sidebar-pinned-status
  [brandName]="'Sentinel Ops'"
  [systemStatus]="'Operational'"
  [uptimeText]="'99.99% Uptime (Last 30 Days)'"
  [title]="'Infrastructure Overview'"
  [activeNavId]="'clusters'"
  [navItems]="[
    { id: 'clusters', icon: 'cpu', label: 'Kubernetes Pods' },
    { id: 'redis', icon: 'database', label: 'Redis Cache Fleet' },
    { id: 'egress', icon: 'activity', label: 'CDN Edge Egress' }
  ]"
  (navClick)="onNavigate($event)"
>
  <div class="cluster-grid">
    <h2>Production Kubernetes Pod Status</h2>
  </div>
</gp-layout-sidebar-pinned-status>`,

  'sb-offcanvas': `<gp-layout-sidebar-offcanvas
  [brandName]="'Drawer App'"
  [title]="'Responsive Offcanvas Shell'"
  [activeNavId]="'inbox'"
  [navItems]="[
    { id: 'inbox', icon: 'inbox', label: 'Customer Inbox' },
    { id: 'sent', icon: 'send', label: 'Dispatched Tickets' },
    { id: 'trash', icon: 'trash-2', label: 'Archive' }
  ]"
  (navClick)="onNavigate($event)"
>
  <div class="offcanvas-page-body">
    <h2>Support Tickets Inbox</h2>
  </div>
</gp-layout-sidebar-offcanvas>`,

  'sb-minimal': `<gp-layout-sidebar-minimal
  [brandName]="'Clean Studio'"
  [title]="'Minimalist Design System'"
  [activeNavId]="'canvas'"
  [navItems]="[
    { id: 'canvas', icon: 'layout', label: 'Artboards' },
    { id: 'tokens', icon: 'sliders', label: 'Design Tokens' },
    { id: 'exports', icon: 'download', label: 'SVG Assets' }
  ]"
  (navClick)="onNavigate($event)"
>
  <div class="minimal-artboard">
    <h2>Vector Artboard Editor</h2>
  </div>
</gp-layout-sidebar-minimal>`,

  'sb-stepper': `<gp-layout-sidebar-stepper
  [brandName]="'Onboarding Wizard'"
  [currentStep]="2"
  [currentStepTitle]="'Configure Database Connection'"
  [currentStepSubtitle]="'Step 2 of 4: Setup PostgreSQL host credentials'"
  [steps]="[
    { index: 1, title: 'Organization Profile', status: 'completed' },
    { index: 2, title: 'Database Credentials', status: 'active' },
    { index: 3, title: 'Team Member Invites', status: 'pending' },
    { index: 4, title: 'Review & Launch', status: 'pending' }
  ]"
  (stepClick)="onGoToStep($event)"
>
  <div class="step-form-content">
    <h3>Enter PostgreSQL Host URL</h3>
  </div>
</gp-layout-sidebar-stepper>`,

  'sb-accordion': `<gp-layout-sidebar-accordion
  [brandName]="'Enterprise Hub'"
  [title]="'Modular Accordion Sidebar'"
  [activeSubLinkId]="'billing-plans'"
  [groups]="[
    {
      id: 'finance',
      title: 'Finance & Billing',
      icon: 'credit-card',
      links: [
        { id: 'billing-plans', label: 'Subscription Plans' },
        { id: 'invoices', label: 'Invoice Receipts' }
      ]
    },
    {
      id: 'security',
      title: 'Security & Access',
      icon: 'lock',
      links: [
        { id: 'audit-logs', label: 'Audit Trail' },
        { id: 'sso-config', label: 'SAML SSO Config' }
      ]
    }
  ]"
  (subLinkClick)="onSubLinkSelect($event)"
>
  <div class="accordion-subpage">
    <h2>Subscription Plans & Quotas</h2>
  </div>
</gp-layout-sidebar-accordion>`,

  // ==========================================
  // 3. STACKED LAYOUTS
  // ==========================================
  'st-classic': `<gp-layout-stacked-classic
  [brandName]="'CloudMatrix'"
  [userName]="'Alex Rivera'"
  [title]="'Organization Overview'"
  [activeNavId]="'dashboard'"
  [navItems]="[
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Telemetry' },
    { id: 'billing', label: 'Billing' },
    { id: 'settings', label: 'Settings' }
  ]"
  (navClick)="onNavigate($event)"
  (profileClick)="openProfile()"
>
  <div class="stacked-container">
    <h2>Welcome to CloudMatrix Organization</h2>
  </div>
</gp-layout-stacked-classic>`,

  'st-subnav-tabs': `<gp-layout-stacked-subnav-tabs
  [brandName]="'Stripe Connect'"
  [userName]="'Sarah Connor'"
  [activeTabId]="'payments'"
  [tabs]="[
    { id: 'payments', label: 'Payments', count: 142 },
    { id: 'balances', label: 'Balances' },
    { id: 'customers', label: 'Customers' },
    { id: 'disputes', label: 'Disputes', badge: '2 Action Needed' }
  ]"
  (tabChange)="onTabChange($event)"
>
  <div class="tab-view-content">
    <h2>Processed Payments Log</h2>
  </div>
</gp-layout-stacked-subnav-tabs>`,

  'st-hero-banner': `<gp-layout-stacked-hero-banner
  [brandName]="'GeneratedPixel'"
  [heroTitle]="'Next-Generation Angular Component Library'"
  [heroSubtitle]="'Craft stunning, accessible enterprise web apps in minutes.'"
  [primaryCta]="'Explore Documentation'"
  [secondaryCta]="'View Source on GitHub'"
  [navLinks]="[
    { label: 'Components', href: '/components' },
    { label: 'Blocks', href: '/blocks' },
    { label: 'Theme Builder', href: '/themes' }
  ]"
  (primaryCtaClick)="onGetStarted()"
  (secondaryCtaClick)="openGithub()"
>
  <div class="hero-under-cards">
    <h3>Highlighted Feature Cards</h3>
  </div>
</gp-layout-stacked-hero-banner>`,

  'st-floating-card': `<gp-layout-stacked-floating-card
  [brandName]="'SaaS Platform'"
  [userName]="'Elena Vance'"
  [title]="'Floating Header Shell'"
  (profileClick)="openProfile()"
>
  <div class="card-stacked-body">
    <h2>Floating Shell Work Surface</h2>
  </div>
</gp-layout-stacked-floating-card>`,

  'st-sticky-bar': `<gp-layout-stacked-sticky-action-bar
  [brandName]="'Storefront Admin'"
  [pageTitle]="'Product Catalog Inventory'"
  [itemCount]="128"
  [addBtnLabel]="'Add New Product'"
  [activeNavId]="'products'"
  [navLinks]="[
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'analytics', label: 'Analytics' }
  ]"
  (addClick)="openNewProductModal()"
  (navClick)="onNavigate($event)"
>
  <div class="catalog-table-area">
    <p>Listing 128 items in warehouse inventory.</p>
  </div>
</gp-layout-stacked-sticky-action-bar>`,

  'st-bottom-dock': `<gp-layout-stacked-bottom-dock
  [brandName]="'DockOS'"
  [activeTab]="'Workspace'"
  [activeDockId]="'finder'"
  [dockItems]="[
    { id: 'finder', icon: 'folder', tooltip: 'File Finder' },
    { id: 'editor', icon: 'code', tooltip: 'IDE Editor' },
    { id: 'terminal', icon: 'terminal', tooltip: 'CLI Terminal' },
    { id: 'browser', icon: 'globe', tooltip: 'Web Browser' },
    { id: 'settings', icon: 'settings', tooltip: 'Preferences' }
  ]"
  (dockItemClick)="onLaunchApp($event)"
>
  <div class="desktop-wallpaper">
    <h2>macOS-Style Bottom Dock Experience</h2>
  </div>
</gp-layout-stacked-bottom-dock>`,

  // ==========================================
  // 4. DASHBOARDS (INTEGRATED WITH GP-GRID)
  // ==========================================
  'dash-saas': `<gp-dashboard-saas-overview
  [kpis]="[
    { title: 'Monthly Recurring Revenue', value: '$84,250', change: '+14.2%', trend: 'pos' },
    { title: 'Active Subscriptions', value: '1,429', change: '+8.1%', trend: 'pos' },
    { title: 'Net Churn Rate', value: '1.24%', change: '-0.4%', trend: 'pos' },
    { title: 'Customer Lifetime Value', value: '$2,840', change: '+5.6%', trend: 'pos' }
  ]"
  [chartTitle]="'MRR Growth Trajectory'"
  [chartBadge]="'+24% vs Last Year'"
  [monthlyData]="[
    { month: 'Jan', value: 42000 },
    { month: 'Feb', value: 54000 },
    { month: 'Mar', value: 68000 },
    { month: 'Apr', value: 84250 }
  ]"
  [goalsTitle]="'Annual Target Progress'"
  [goalsTarget]="'$1,000,000 ARR'"
  [quotas]="[
    { label: 'Enterprise Tier', percent: 78, color: 'primary' },
    { label: 'Self-Serve Growth', percent: 92, color: 'success' }
  ]"
  [tableTitle]="'Recent Enterprise Customers'"
  [recentSignups]="[
    { name: 'Acme Corp', plan: 'Enterprise', mrr: '$4,200', date: '2h ago' },
    { name: 'Cyberdyne Systems', plan: 'Pro Team', mrr: '$1,800', date: '5h ago' }
  ]"
  [(widgets)]="dashboardWidgets"
  (layoutChanged)="onSaveGridPositions($event)"
>
  <!-- Custom Drag-and-Drop Widget Template via gp-grid -->
  <ng-template #widgetTemplate let-widget>
    <div class="custom-saas-widget">
      <h4>{{ widget.title }}</h4>
      <p>{{ widget.customContent }}</p>
    </div>
  </ng-template>
</gp-dashboard-saas-overview>`,

  'dash-ecom': `<gp-dashboard-ecommerce
  [kpis]="[
    { title: 'Gross Merchandise Value', value: '$218,400', change: '+22.4%', trend: 'pos' },
    { title: 'Orders Dispatched', value: '4,892', change: '+18.1%', trend: 'pos' },
    { title: 'Average Order Value', value: '$44.64', change: '+3.7%', trend: 'pos' }
  ]"
  [topProducts]="[
    { name: 'Ergonomic Mechanical Keyboard', unitsSold: 1420, revenue: '$142,000' },
    { name: 'Ultra-Wide 4K Gaming Monitor', unitsSold: 840, revenue: '$252,000' }
  ]"
  [recentOrders]="[
    { orderId: '#ORD-8924', customer: 'John Connor', total: '$249.00', status: 'Shipped' },
    { orderId: '#ORD-8925', customer: 'Elena Vance', total: '$89.50', status: 'Processing' }
  ]"
  [(widgets)]="ecomWidgets"
  (layoutChanged)="onSaveGridPositions($event)"
/>`,

  'dash-analytics': `<gp-dashboard-analytics
  [stats]="[
    { label: 'Live Active Visitors', value: '1,842', subtext: '342 on checkout funnel' },
    { label: 'Bounce Rate', value: '28.4%', subtext: '-4.2% improvement' },
    { label: 'Avg Session Duration', value: '4m 18s', subtext: '+42s vs benchmark' }
  ]"
  [channels]="[
    { name: 'Direct Traffic', percent: 45, visitors: '142.5K' },
    { name: 'Organic Search', percent: 35, visitors: '110.8K' },
    { name: 'Social Referrals', percent: 20, visitors: '63.4K' }
  ]"
  [regions]="[
    { country: 'United States', sessions: '48%' },
    { country: 'European Union', sessions: '32%' },
    { country: 'Asia-Pacific', sessions: '20%' }
  ]"
  [(widgets)]="analyticsWidgets"
  (layoutChanged)="onSaveGridPositions($event)"
/>`,

  'dash-finance': `<gp-dashboard-finance
  [balanceLabel]="'Operating Liquidity'"
  [balanceAmount]="'$1,428,950.00'"
  [balanceMeta]="'FDIC Insured across 3 Treasury Accounts'"
  [ledgerTitle]="'Corporate Ledger'"
  [ledgerBadge]="'Audited'"
  [ledger]="[
    { item: 'Stripe Payout Batch #902', amount: '+$84,200.00', date: 'Today, 9:00 AM', status: 'cleared' },
    { item: 'AWS Cloud Hosting Invoice', amount: '-$14,820.50', date: 'Yesterday', status: 'cleared' }
  ]"
  [invoicesTitle]="'Pending Accounts Receivable'"
  [invoices]="[
    { client: 'Wayne Enterprises', amount: '$45,000.00', dueDate: 'in 4 days', status: 'pending' }
  ]"
/>`,

  'dash-pm': `<gp-dashboard-project-management
  [metrics]="[
    { label: 'Sprint Velocity', value: '64 pts', subtext: 'Target: 60 pts' },
    { label: 'Burndown Progress', value: '88%', subtext: '4 tasks remaining' },
    { label: 'Blocked Items', value: '1', subtext: 'Awaiting design review' }
  ]"
  [columns]="[
    {
      title: 'To Do',
      tasks: [
        { id: 'TSK-101', title: 'Implement OAuth2 refresh token rotation', priority: 'high', assignee: 'SC' }
      ]
    },
    {
      title: 'In Progress',
      tasks: [
        { id: 'TSK-98', title: 'Dark mode contrast token audit', priority: 'medium', assignee: 'AR' }
      ]
    },
    {
      title: 'Done',
      tasks: [
        { id: 'TSK-95', title: 'Migrate demo app to standalone components', priority: 'low', assignee: 'EV' }
      ]
    }
  ]"
/>`,

  'dash-ops': `<gp-dashboard-operations
  [bannerText]="'All 24 Global Edge Datacenters Operational'"
  [uptimeBadge]="'99.999%'"
  [nodes]="[
    { name: 'us-east-1a (N. Virginia)', cpuUsage: 34, ramUsage: 58, status: 'healthy' },
    { name: 'eu-west-1a (Frankfurt)', cpuUsage: 48, ramUsage: 72, status: 'healthy' },
    { name: 'ap-northeast-1 (Tokyo)', cpuUsage: 22, ramUsage: 41, status: 'healthy' }
  ]"
/>`,

  // ==========================================
  // 5. SETTINGS & DETAILS
  // ==========================================
  'set-profile': `<gp-settings-profile
  [title]="'Profile Information'"
  [subtitle]="'Update your public avatar, name, and contact information.'"
  [userName]="'Sarah Connor'"
  [firstName]="'Sarah'"
  [lastName]="'Connor'"
  [email]="'s.connor@acme.corp'"
  [jobTitle]="'Lead Systems Architect'"
  [bio]="'Building scalable enterprise interfaces with @generatedpixel/gp-ui.'"
  [changeAvatarLabel]="'Change Photo'"
  [removeAvatarLabel]="'Remove'"
  [saveBtnLabel]="'Save Changes'"
  [cancelBtnLabel]="'Cancel'"
  (save)="onSaveProfile($event)"
  (changeAvatar)="onUploadAvatar()"
  (removeAvatar)="onRemoveAvatar()"
>
  <!-- Optional custom footer slot -->
  <div slot="actions">
    <gp-button variant="outlined" severity="secondary">Discard</gp-button>
    <gp-button severity="primary" (onClickEvent)="onSaveProfile()">Save Profile</gp-button>
  </div>
</gp-settings-profile>`,

  'set-security': `<gp-settings-security
  [title]="'Security Settings'"
  [subtitle]="'Manage your account credentials, 2FA, and active browser sessions.'"
  [twoFaEnabled]="true"
  [sessions]="[
    { id: 's1', device: 'Chrome on macOS (Sonoma)', location: 'San Francisco, CA', ip: '192.168.1.42', isCurrent: true },
    { id: 's2', device: 'Safari on iPhone 15 Pro', location: 'San Francisco, CA', ip: '172.56.21.90', lastActive: '2h ago', isCurrent: false }
  ]"
  (updatePassword)="onPasswordChange($event)"
  (twoFaChange)="onToggle2FA($event)"
  (revokeSession)="onRevokeDevice($event)"
/>`,

  'set-billing': `<gp-settings-billing
  [title]="'Billing & Invoices'"
  [subtitle]="'Manage your enterprise subscription tier and view past invoices.'"
  [planName]="'Enterprise Scale'"
  [planStatus]="'Active'"
  [planPrice]="'$299 / month'"
  [invoices]="[
    { id: 'INV-2026-003', date: 'Aug 1, 2026', amount: '$299.00', status: 'Paid' },
    { id: 'INV-2026-002', date: 'Jul 1, 2026', amount: '$299.00', status: 'Paid' }
  ]"
  (upgradePlan)="openChangePlanModal()"
  (downloadInvoice)="onDownloadInvoicePDF($event)"
/>`,

  'set-notifications': `<gp-settings-notifications
  [title]="'Notification Preferences'"
  [subtitle]="'Configure the notifications you receive across email and SMS.'"
  [preferences]="[
    { id: 'security', label: 'Security & Login Alerts', desc: 'Notify on unauthorized login attempts', email: true, push: true },
    { id: 'billing', label: 'Invoice Receipts', desc: 'Receive PDF receipts when billing succeeds', email: true, push: false },
    { id: 'updates', label: 'Product News & Digests', desc: 'Weekly summary of new features and releases', email: false, push: false }
  ]"
  (savePreferences)="onSaveNotifications($event)"
/>`,

  'set-team-roles': `<gp-settings-team-roles
  [title]="'Team Members & RBAC'"
  [subtitle]="'Invite collaborators and assign permission levels across projects.'"
  [members]="[
    { id: 'm1', name: 'Sarah Connor', email: 's.connor@acme.corp', role: 'Owner', status: 'Active' },
    { id: 'm2', name: 'Alex Rivera', email: 'a.rivera@acme.corp', role: 'Admin', status: 'Active' },
    { id: 'm3', name: 'Elena Vance', email: 'e.vance@acme.corp', role: 'Developer', status: 'Active' }
  ]"
  (inviteMember)="openInviteModal()"
  (roleChange)="onRoleUpdated($event)"
  (removeMember)="onRemoveUser($event)"
/>`,

  'set-api-keys': `<gp-settings-api-keys
  [title]="'API Keys & Webhooks'"
  [subtitle]="'Generate scoped API tokens for CI/CD runners and backend microservices.'"
  [apiKeys]="[
    { id: 'k1', name: 'Production Deployment Runner', token: 'gp_live_8f94a2b918c0e29471f0', scope: 'Read & Write', created: '3 months ago' },
    { id: 'k2', name: 'Staging Analytics Exporter', token: 'gp_test_3a8b1928df7701ac994e', scope: 'Read-Only', created: '1 week ago' }
  ]"
  (createKey)="openCreateApiKeyModal()"
  (revokeKey)="onRevokeApiKey($event)"
/>`,

  'set-danger-zone': `<gp-settings-danger-zone
  [title]="'Danger Zone'"
  [subtitle]="'Irreversible and destructive actions for this organization.'"
  [actions]="[
    { id: 'transfer', title: 'Transfer Ownership', desc: 'Transfer account ownership to another team administrator.', btnLabel: 'Transfer', severity: 'danger' },
    { id: 'delete', title: 'Delete Organization', desc: 'Permanently remove all database records, clusters, and API keys.', btnLabel: 'Delete Org', severity: 'danger' }
  ]"
  (actionClick)="onExecuteDangerAction($event)"
/>`,

  'det-customer': `<gp-details-customer-overview
  [customerName]="'Acme Corporation'"
  [customerStatus]="'Active Enterprise'"
  [companyName]="'Acme Holdings, Inc.'"
  [location]="'San Francisco, CA'"
  [tags]="['Tier 1 Account', 'Early Adopter', 'Priority SLA']"
  [metaFields]="[
    { label: 'Account Executive', value: 'Sarah Connor' },
    { label: 'Primary Contact Email', value: 'admin@acme.corp', isLink: true },
    { label: 'Annual Contract Value', value: '$84,000 / year' }
  ]"
  [timelineEvents]="[
    { title: 'Enterprise Contract Renewed', date: 'Aug 15, 2026', bulletClass: 'success' },
    { title: 'Added 50 Developer Seats', date: 'Jul 20, 2026', bulletClass: 'primary' }
  ]"
  (editContact)="openEditCustomerModal()"
  (newDeal)="openCreateDealModal()"
/>`,

  'det-order': `<gp-details-order-summary
  [orderId]="'#ORD-2026-9842'"
  [orderStatus]="'Paid'"
  [orderDate]="'August 28, 2026'"
  [paymentMethod]="'Visa ending in 4242'"
  [subtotal]="'$380.00'"
  [shipping]="'$15.00'"
  [tax]="'$31.60'"
  [grandTotal]="'$426.60'"
  [items]="[
    { name: 'Ultra-Wide Curved Display 34"', sku: 'MON-34-CRV', qty: 1, price: '$320.00', total: '$320.00' },
    { name: 'Mechanical Ergonomic Keyboard', sku: 'KB-MECH-PRO', qty: 1, price: '$60.00', total: '$60.00' }
  ]"
  (downloadReceipt)="onDownloadReceiptPDF()"
/>`,

  // ==========================================
  // 6. HEADINGS
  // ==========================================
  'hdr-actions': `<gp-header-page-with-actions
  [title]="'Project Deployments'"
  [badgeText]="'v2.4.0 Live'"
  [badgeSeverity]="'success'"
  [subtitle]="'Manage and monitor continuous delivery pipelines across cloud clusters.'"
  [breadcrumbs]="[
    { label: 'Home', url: '/' },
    { label: 'Projects', url: '/projects' },
    { label: 'Deployments', active: true }
  ]"
  [actions]="[
    { label: 'Export Logs', variant: 'outlined', severity: 'secondary' },
    { label: 'New Deployment', variant: 'filled', severity: 'primary' }
  ]"
  (actionClick)="onHeaderAction($event)"
/>`,

  'hdr-filters': `<gp-header-search-filters
  [title]="'Customer Directory'"
  [subtitle]="'Filter and search through 14,280 registered organizations.'"
  [filterGroups]="[
    { label: 'All Statuses', options: ['Active', 'Trial', 'Suspended'] },
    { label: 'All Regions', options: ['North America', 'Europe', 'APAC'] }
  ]"
  (searchChange)="onSearchFilter($event)"
/>`,

  'hdr-tabs': `<gp-header-section-tabs
  [title]="'Team Workspace Settings'"
  [description]="'Manage team access, billing subscriptions, and API webhooks.'"
  [tabs]="[
    { id: 'general', label: 'General' },
    { id: 'members', label: 'Members', count: 18 },
    { id: 'billing', label: 'Billing' },
    { id: 'integrations', label: 'Integrations', badge: 'New' }
  ]"
  (tabChange)="onTabSelect($event)"
/>`,

  'hdr-stats': `<gp-header-with-stats
  [title]="'Production Telemetry'"
  [description]="'Real-time traffic health across 4 global regions.'"
  [stats]="[
    { label: 'Avg Latency', value: '18ms', trend: 'pos' },
    { label: 'Error Rate', value: '0.002%', trend: 'pos' },
    { label: 'Req / sec', value: '42.8K', trend: 'pos' }
  ]"
/>`,

  'hdr-breadcrumb': `<gp-header-compact-breadcrumb
  [backLabel]="'Back to Customer List'"
  [activeItem]="'Acme Corporation (#CUST-892)'"
  [editBtnLabel]="'Edit Account'"
  [shareBtnLabel]="'Share Dossier'"
  (backClick)="onNavigateBack()"
  (editClick)="openEditModal()"
/>`,

  'hdr-profile-banner': `<gp-header-profile-banner
  [userName]="'Sarah Connor'"
  [statusText]="'Active Now'"
  [statusSeverity]="'success'"
  [userTitle]="'Principal Solutions Architect @ Acme Corp'"
  [location]="'San Francisco, CA'"
  [messageBtnLabel]="'Message'"
  [connectBtnLabel]="'Connect'"
  (messageClick)="onSendDirectMessage()"
  (connectClick)="onConnectUser()"
/>`,

  // ==========================================
  // 7. DATA DISPLAYS
  // ==========================================
  'dd-kpi': `<gp-data-display-kpi-cards
  [kpis]="[
    { title: 'Total Revenue', value: '$128,420', change: '+18.4%', trend: 'pos', icon: 'dollar-sign' },
    { title: 'Active Users', value: '48,290', change: '+12.1%', trend: 'pos', icon: 'users' },
    { title: 'Server Load', value: '42.8%', change: '-2.4%', trend: 'pos', icon: 'cpu' },
    { title: 'Open Tickets', value: '3', change: '-40.0%', trend: 'pos', icon: 'inbox' }
  ]"
/>`,

  'dd-desc-list': `<gp-data-display-description-list
  [title]="'Server Specifications'"
  [subtitle]="'Hardware and networking details for node us-east-1a.'"
  [items]="[
    { label: 'Hostname', value: 'node-prod-04.acme.cloud' },
    { label: 'Kernel Version', value: 'Linux 6.8.0-31-generic' },
    { label: 'Memory Allocation', value: '128 GB DDR5 ECC' },
    { label: 'Public IPv4', value: '198.51.100.42' }
  ]"
/>`,

  'dd-timeline': `<gp-data-display-timeline-stream
  [title]="'Security Audit Stream'"
  [events]="[
    { title: 'API Key Generated', user: 'Sarah Connor', time: '10m ago', icon: 'key', color: 'primary' },
    { title: '2FA Policy Enforced', user: 'Alex Rivera', time: '1h ago', icon: 'shield', color: 'success' },
    { title: 'Failed Login Blocked', user: 'Unknown IP', time: '3h ago', icon: 'alert-triangle', color: 'danger' }
  ]"
/>`,

  'dd-meter': `<gp-data-display-meter-metrics
  [title]="'Cloud Quotas & Capacity'"
  [subtitle]="'Usage metrics for current billing period.'"
  [meters]="[
    { label: 'Monthly Compute (vCPU)', used: 74, total: 100, unit: 'vCPUs', color: 'primary' },
    { label: 'Object Storage', used: 1.8, total: 5.0, unit: 'TB', color: 'success' },
    { label: 'Outbound Egress Bandwidth', used: 840, total: 1000, unit: 'GB', color: 'warning' }
  ]"
/>`,

  'dd-badges': `<gp-data-display-badge-clusters
  [title]="'Project Taxonomy & Badges'"
  [subtitle]="'Categorized metadata tags for project assets.'"
  [groups]="[
    { category: 'Environments', badges: [{ label: 'Production', severity: 'success' }, { label: 'Staging', severity: 'warning' }] },
    { category: 'Frameworks', badges: [{ label: 'Angular 19', severity: 'danger' }, { label: 'TypeScript 5', severity: 'primary' }] }
  ]"
/>`,

  'dd-counter': `<gp-data-display-stats-counter
  [counters]="[
    { number: '99.999%', label: 'Guaranteed SLA Uptime' },
    { number: '10B+', label: 'Daily API Requests Handled' },
    { number: '140+', label: 'Global Edge PoP Locations' },
    { number: '< 20ms', label: 'Average Global Latency' }
  ]"
/>`,

  // ==========================================
  // 8. LISTS
  // ==========================================
  'list-grid': `<gp-list-data-grid
  [searchPlaceholder]="'Search transactions, customers, IDs...'"
  [rows]="[
    { id: 'TRX-101', customer: 'Acme Corp', amount: '$4,200.00', status: 'Completed', date: 'Aug 28, 2026' },
    { id: 'TRX-102', customer: 'Cyberdyne Systems', amount: '$1,850.00', status: 'Pending', date: 'Aug 27, 2026' },
    { id: 'TRX-103', customer: 'Wayne Enterprises', amount: '$9,400.00', status: 'Completed', date: 'Aug 26, 2026' }
  ]"
  (rowSelect)="onRowSelected($event)"
  (searchChange)="onSearchTable($event)"
/>`,

  'list-feed': `<gp-list-stacked-feed
  [title]="'Collaborative Activity Feed'"
  [badgeText]="'Live Updates'"
  [feedItems]="[
    { user: 'Sarah Connor', action: 'merged pull request #142', target: 'feature/dark-mode', time: '12m ago', avatar: 'S' },
    { user: 'Alex Rivera', action: 'commented on issue #98', target: 'Button hover contrast', time: '45m ago', avatar: 'A' }
  ]"
/>`,

  'list-cards': `<gp-list-card-grid
  [title]="'Active Microservices'"
  [subtitle]="'Monitor health and latency across deployed services.'"
  [cards]="[
    { name: 'Auth Gateway', status: 'Online', uptime: '100%', latency: '12ms', icon: 'shield' },
    { name: 'Payment Processor', status: 'Online', uptime: '99.99%', latency: '24ms', icon: 'credit-card' },
    { name: 'Search Elastic Cluster', status: 'Degraded', uptime: '98.5%', latency: '180ms', icon: 'search' }
  ]"
  (cardClick)="onServiceCardClick($event)"
/>`,

  'list-tx': `<gp-list-transactions
  [title]="'Recent Account Activity'"
  [badgeText]="'Aug 2026'"
  [transactions]="[
    { title: 'Subscription Charge (Stripe)', date: 'Aug 28, 2026', amount: '-$299.00', type: 'debit' },
    { title: 'Customer Wire Deposit', date: 'Aug 27, 2026', amount: '+$8,400.00', type: 'credit' },
    { title: 'Cloud Infrastructure Usage', date: 'Aug 25, 2026', amount: '-$142.50', type: 'debit' }
  ]"
/>`,

  'list-users': `<gp-list-user-directory
  [title]="'Team Directory'"
  [users]="[
    { name: 'Sarah Connor', role: 'Principal Architect', email: 's.connor@acme.corp', online: true },
    { name: 'Alex Rivera', role: 'Senior Frontend Engineer', email: 'a.rivera@acme.corp', online: true },
    { name: 'Elena Vance', role: 'DevOps Lead', email: 'e.vance@acme.corp', online: false }
  ]"
  (profileClick)="onViewUserProfile($event)"
  (messageClick)="onDirectMessage($event)"
/>`,

  'list-files': `<gp-list-file-list-download
  [title]="'Project Attachments & Downloads'"
  [files]="[
    { name: 'Q3_Financial_Audit_Report.pdf', size: '2.4 MB', updated: 'Yesterday', icon: 'file-text' },
    { name: 'Architecture_Blueprint_v2.svg', size: '840 KB', updated: '3 days ago', icon: 'image' },
    { name: 'Database_Backup_20260828.tar.gz', size: '142 MB', updated: 'Aug 28, 2026', icon: 'archive' }
  ]"
  (download)="onDownloadAttachment($event)"
/>`,

  // ==========================================
  // 9. FORMS
  // ==========================================
  'form-wizard': `<gp-form-multi-step-wizard
  [steps]="[
    { title: 'Account Info', desc: 'Name, email, and password credentials' },
    { title: 'Company Details', desc: 'Organization name and size' },
    { title: 'Payment Plan', desc: 'Select subscription tier' }
  ]"
  (stepSubmit)="onStepCompleted($event)"
  (wizardComplete)="onFinishOnboarding($event)"
/>`,

  'form-auth': `<gp-form-auth-split
  [brandName]="'Acme Cloud'"
  [heroTitle]="'Build Faster with Enterprise Components'"
  [heroDesc]="'Join over 10,000 engineering teams building next-gen web applications.'"
  [formTitle]="'Welcome Back'"
  [formSubtitle]="'Enter your credentials to access your workspace.'"
  (submit)="onSignIn($event)"
  (forgotPasswordClick)="onResetPassword()"
/>`,

  'form-profile': `<gp-form-user-profile
  [title]="'Public Profile Information'"
  [subtitle]="'This information will be displayed publicly on your team profile.'"
  [firstName]="'Sarah'"
  [lastName]="'Connor'"
  [email]="'s.connor@acme.corp'"
  [phone]="'+1 (555) 234-5678'"
  [bio]="'Principal Systems Architect at Acme Corp.'"
  (save)="onSaveProfile($event)"
  (cancel)="onCancelEdit()"
/>`,

  'form-checkout': `<gp-form-checkout-payment
  [title]="'Secure Checkout'"
  [subtitle]="'256-bit encrypted SSL checkout with Stripe'"
  [amount]="'$299.00'"
  (payClick)="onProcessPayment($event)"
  (cancelClick)="onCancelCheckout()"
/>`,

  'form-contact': `<gp-form-contact-feedback
  [title]="'Get in Touch with Support'"
  [subtitle]="'We typically respond to enterprise tickets within 1 hour.'"
  (submitFeedback)="onSubmitContactTicket($event)"
/>`,

  'form-filter': `<gp-form-advanced-filter-builder
  [title]="'Condition Rule Builder'"
  (filtersApplied)="onApplyQueryFilters($event)"
/>`,

  // ==========================================
  // 10. FEEDBACKS
  // ==========================================
  'fb-alerts': `<gp-feedback-alert-banners
  [alerts]="[
    { severity: 'info', title: 'System Update', message: 'Maintenance window scheduled for Saturday at 02:00 UTC.' },
    { severity: 'success', title: 'Payment Successful', message: 'Your invoice receipt #INV-892 has been emailed.' },
    { severity: 'warning', title: 'Quota Approaching', message: 'You have used 85% of your allocated monthly storage.' },
    { severity: 'danger', title: 'Cluster Degradation', message: 'Node eu-west-1a experienced a transient timeout.' }
  ]"
  (dismissAlert)="onDismissAlert($event)"
/>`,

  'fb-empty': `<gp-feedback-empty-states
  [title]="'No Projects Created Yet'"
  [description]="'Get started by scaffolding your first Angular 19 enterprise workspace.'"
  [primaryCta]="'Create New Project'"
  [secondaryCta]="'Import from GitHub'"
  (primaryClick)="openCreateProjectModal()"
  (secondaryClick)="openImportModal()"
/>`,

  'fb-confirm': `<gp-feedback-confirm-modals
  [title]="'Delete Compute Cluster?'"
  [message]="'Are you sure you want to delete production node us-east-1a? This action cannot be undone and all running containers will be terminated.'"
  [confirmBtnLabel]="'Yes, Delete Node'"
  [cancelBtnLabel]="'Cancel'"
  (confirm)="onConfirmDelete()"
  (cancel)="onCancelDialog()"
/>`,

  'fb-toast': `<gp-feedback-toast-status
  [toasts]="[
    { id: '1', title: 'Profile Updated', message: 'Your changes have been saved to the cloud.', severity: 'success', time: 'Just now' },
    { id: '2', title: 'New Message', message: 'Sarah Connor mentioned you in #dev-team.', severity: 'info', time: '2m ago' }
  ]"
  (dismissToast)="onDismissToast($event)"
/>`,

  'fb-rating': `<gp-feedback-rating-review
  [title]="'How was your experience today?'"
  [subtitle]="'Help us improve our developer tools and components.'"
  (submitRating)="onSubmitStarRating($event)"
/>`,

  // ==========================================
  // 11. NAVIGATIONS & OVERLAYS
  // ==========================================
  'nav-topbar': `<gp-nav-responsive-top-bar
  [brandName]="'Acme Cloud'"
  [userName]="'Sarah Connor'"
  [activeLinkId]="'overview'"
  [links]="[
    { id: 'overview', label: 'Overview', url: '/overview' },
    { id: 'deployments', label: 'Deployments', url: '/deployments' },
    { id: 'security', label: 'Security', url: '/security' },
    { id: 'docs', label: 'Documentation', url: '/docs' }
  ]"
  (searchChange)="onGlobalSearch($event)"
  (profileClick)="openProfileMenu()"
/>`,

  'nav-palette': `<gp-overlay-command-palette
  [placeholder]="'Type a command or search (e.g. Settings, Theme, Users)...'"
  [groupLabel]="'Quick Commands'"
  [commands]="[
    { id: '1', icon: 'search', label: 'Search projects and repositories', shortcut: '⌘K' },
    { id: '2', icon: 'sliders', label: 'Theme Customizer (Switch Light/Dark)', shortcut: '⌘T' },
    { id: '3', icon: 'user-plus', label: 'Invite Collaborator to Workspace', shortcut: '⌘I' },
    { id: '4', icon: 'settings', label: 'Organization Settings & Billing', shortcut: '⌘,' }
  ]"
  (selectCommand)="onExecuteCommand($event)"
  (close)="closeCommandPalette()"
>
  <!-- Optional slot for tips or shortcut guide -->
  <div slot="footer" class="palette-tips">
    <span>Navigation: ↑ ↓ to select &bull; ↵ to execute &bull; ESC to exit</span>
  </div>
</gp-overlay-command-palette>`,

  'nav-slide-over': `<gp-overlay-slide-over-panel
  [title]="'Edit Node Properties'"
  [description]="'Adjust compute allocation and network VPC rules for this instance.'"
  [openLabel]="'Edit node properties'"
  (close)="onCloseDrawer()"
  (cancel)="onCloseDrawer()"
  (save)="onSaveProperties($event)"
/>`,

  'nav-dropdown': `<gp-nav-dropdown-action-menu
  [signedInLabel]="'Signed in as'"
  [userEmail]="'s.connor@acme.corp'"
  [primaryItems]="[
    { id: 'profile', icon: 'user', label: 'Public Profile' },
    { id: 'billing', icon: 'credit-card', label: 'Billing & Invoices' },
    { id: 'api-keys', icon: 'key', label: 'API Webhooks' }
  ]"
  [dangerItems]="[
    { id: 'signout', icon: 'log-out', label: 'Sign Out' }
  ]"
  (itemSelect)="onDropdownItemClicked($event)"
/>`,

  'nav-mega': `<gp-nav-mega-menu-block
  [sections]="[
    {
      title: 'Core Platform',
      links: [
        { title: 'Serverless Functions', desc: 'Execute on-demand event handlers at the edge.', url: '/platform/functions' },
        { title: 'Edge Routing & CDN', desc: 'Sub-20ms asset distribution worldwide.', url: '/platform/edge' }
      ]
    },
    {
      title: 'Developer Tools',
      links: [
        { title: 'CLI Toolkit', desc: 'Deploy directly from your local terminal.', url: '/tools/cli' },
        { title: 'SDK & Rest API', desc: 'Full TypeScript and Python client libraries.', url: '/tools/sdk' }
      ]
    }
  ]"
  [promo]="{
    badge: 'v2.4 Release',
    title: 'Instant Cloud Previews',
    text: 'Share preview URLs for every pull request automatically.',
    ctaText: 'Explore Features'
  }"
  (linkClick)="onMegaLinkClick($event)"
  (promoClick)="onMegaPromoClick($event)"
/>`,

  'nav-tabs': `<gp-nav-tab-navigation
  [underlineTabs]="[
    { id: 'overview', label: 'Overview' },
    { id: 'telemetry', label: 'Telemetry', badge: 4 },
    { id: 'settings', label: 'Settings' }
  ]"
  [activeUnderlineTab]="'overview'"
  [pillTabs]="[
    { id: 'all', label: 'All Events' },
    { id: 'errors', label: 'Errors Only', badge: '12' },
    { id: 'warnings', label: 'Warnings' }
  ]"
  [activePillTab]="'all'"
  (underlineTabChange)="onUnderlineTabChange($event)"
  (pillTabChange)="onPillTabChange($event)"
/>`,

  // ==========================================
  // 12. BASIC PAGES
  // ==========================================
  'page-404': `<gp-page-404
  [code]="'404'"
  [title]="'Page Not Found'"
  [description]="'Sorry, we could not find the page or resource you are looking for. It may have been moved or deleted.'"
  [goBackBtnLabel]="'Go Back'"
  [returnHomeBtnLabel]="'Return to Home'"
  (goBack)="onGoBack()"
  (returnHome)="onReturnHome()"
/>`,

  'page-500': `<gp-page-500
  [code]="'500'"
  [title]="'Internal Server Error'"
  [description]="'Our servers encountered an unexpected failure. Our SRE on-call engineers have been automatically notified.'"
  [supportBtnLabel]="'Contact Support'"
  [retryBtnLabel]="'Retry Request'"
  (contactSupport)="onContactSupport()"
  (retry)="onRetryServerRequest()"
/>`,

  'page-403': `<gp-page-403
  [code]="'403'"
  [title]="'Access Forbidden'"
  [description]="'You do not have administrative permission to view this resource. Please contact your organization owner for access.'"
  [returnHomeBtnLabel]="'Return Home'"
  [requestAccessBtnLabel]="'Request Access'"
  (returnHome)="onReturnHome()"
  (requestAccess)="onRequestPermission()"
/>`,

  'page-maint': `<gp-page-maintenance
  [badgeText]="'Scheduled Maintenance'"
  [badgeSeverity]="'warning'"
  [title]="'System Upgrade in Progress'"
  [description]="'We are performing scheduled database cluster indexing and security patch upgrades.'"
  [estimatedUptime]="'Estimated completion in 35 minutes (03:00 UTC)'"
/>`,

  'page-coming': `<gp-page-coming-soon
  [badgeText]="'Private Beta'"
  [title]="'Next-Gen Analytics Engine'"
  [description]="'We are putting the finishing touches on our real-time telemetry streaming engine. Join the priority waitlist.'"
  [countdown]="'Launching in 14 Days'"
  (joinWaitlist)="onJoinWaitlist($event)"
/>`,

  'page-success': `<gp-page-success-confirmation
  [title]="'Order Confirmed & Payment Succeeded!'"
  [description]="'Thank you for your order. A receipt and confirmation email have been dispatched.'"
  [orderNumber]="'#ORD-2026-9842'"
  [email]="'s.connor@acme.corp'"
  [primaryBtnLabel]="'Go to Dashboard'"
  [secondaryBtnLabel]="'Download PDF Receipt'"
  (primaryClick)="onGoToDashboard()"
  (secondaryClick)="onDownloadReceiptPDF()"
/>`
};
