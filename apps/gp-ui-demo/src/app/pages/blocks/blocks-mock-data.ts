export const BLOCKS_DEMO_DATA = {
  layouts: {
    twoCol: {
      splitRatio: '50/50' as const,
      primaryTitle: 'Project Backlog',
      primaryBadge: '12 Issues',
      primaryDescription: 'Active user stories and backlog items scheduled for future releases.',
      secondaryTitle: 'Active Sprint Workspace',
      secondaryDescription: 'Currently deployed deliverables undergoing verification.'
    },
    threeColWorkspace: {
      explorerTitle: 'WORKSPACE EXPLORER',
      activeFileName: 'blocks.component.ts'
    },
    threeColFluid: {
      leftTitle: 'Documentation Navigation',
      mainTitle: 'Component Specifications & Layouts',
      mainSubtitle: 'Explore responsive multi-column containers and dashboard panels.',
      rightTitle: 'Activity & Telemetry'
    },
    fourCol: {
      col1Title: 'Incoming Tasks',
      col1Badge: '5 New',
      col2Title: 'In Progress',
      col2Badge: '3 Active',
      col3Title: 'Review & QA',
      col3Badge: '2 Pending',
      col4Title: 'Completed',
      col4Badge: '18 Done'
    },
    sbDark: {
      brandName: 'Apex Control',
      title: 'Dark Themed System Console',
      navGroupLabel: 'Main Navigation',
      userName: 'Dr. Evelyn Reed',
      userEmail: 'evelyn@enterprise.io',
      activeNavId: 'dash',
      navItems: [
        { id: 'dash', icon: 'home', label: 'Dashboard', active: true },
        { id: 'analytics', icon: 'layer-group', label: 'Analytics', badge: 'Pro', badgeSeverity: 'primary' as const },
        { id: 'projects', icon: 'folder', label: 'Projects' },
        { id: 'team', icon: 'users', label: 'Team Members' },
        { id: 'settings', icon: 'sliders', label: 'System Settings' }
      ]
    },
    sbLight: {
      brandName: 'Cloud Portal',
      title: 'Workspace Home',
      activeNavId: 'dash',
      navItems: [
        { id: 'dash', icon: 'home', label: 'Dashboard', active: true },
        { id: 'analytics', icon: 'layer-group', label: 'Analytics', badge: 'Live', badgeSeverity: 'success' as const },
        { id: 'docs', icon: 'folder', label: 'Documents', badge: 'New', badgeSeverity: 'success' as const },
        { id: 'customers', icon: 'users', label: 'Customers' },
        { id: 'settings', icon: 'sliders', label: 'Settings' }
      ],
      upgradeTitle: 'Pro Plan',
      upgradeText: 'Unlock all components and unlimited exports.',
      upgradeBtnLabel: 'Upgrade Now'
    },
    sbMini: {
      title: 'Mini Rail Navigation',
      activeNavId: 'dash',
      userName: 'Graeme G.',
      navItems: [
        { id: 'dash', icon: 'home', label: 'Dashboard', active: true },
        { id: 'analytics', icon: 'layer-group', label: 'Analytics' },
        { id: 'projects', icon: 'folder', label: 'Projects' },
        { id: 'settings', icon: 'sliders', label: 'Settings' }
      ]
    },
    sbDual: {
      title: 'Dual Tier Navigation Hub',
      activeTier1Id: 'apps',
      tier1Items: [
        { id: 'apps', icon: 'layer-group', title: 'Applications', active: true },
        { id: 'users', icon: 'users', title: 'Users & Teams' },
        { id: 'settings', icon: 'sliders', title: 'System Settings' }
      ],
      subnavTitle: 'Application Modules',
      subnavBadge: '12 Active',
      activeTier2Id: 'crm',
      tier2Items: [
        { id: 'crm', label: 'CRM & Pipeline', active: true },
        { id: 'billing', label: 'Invoices & Billing' },
        { id: 'analytics', label: 'Customer Analytics' }
      ]
    },
    sbFloating: {
      brandName: 'Aura Studio',
      title: 'Dashboard Overview',
      activeNavId: 'dash',
      navItems: [
        { id: 'dash', icon: 'home', label: 'Dashboard', active: true },
        { id: 'metrics', icon: 'layer-group', label: 'Metrics' },
        { id: 'files', icon: 'folder', label: 'Files' },
        { id: 'settings', icon: 'sliders', label: 'Settings' }
      ]
    },
    sbGradient: {
      brandName: 'Nova Enterprise',
      title: 'Operations Hub',
      activeNavId: 'home',
      navItems: [
        { id: 'home', icon: 'home', label: 'Home', active: true },
        { id: 'discover', icon: 'layer-group', label: 'Discover' },
        { id: 'community', icon: 'users', label: 'Community' },
        { id: 'preferences', icon: 'sliders', label: 'Preferences' }
      ]
    },
    sbHeaderOver: {
      brandName: 'Global Apex',
      userName: 'Emma Watson',
      activeNavId: 'overview',
      navItems: [
        { id: 'overview', icon: 'home', label: 'Overview', active: true },
        { id: 'repo', icon: 'folder', label: 'Repository' },
        { id: 'collab', icon: 'users', label: 'Collaborators' },
        { id: 'config', icon: 'sliders', label: 'Configuration' }
      ]
    },
    sbWorkspace: {
      currentWorkspace: 'Acme Technologies',
      workspaceTier: 'Enterprise Pro',
      title: 'Workspace Overview',
      activeNavId: 'dash',
      navItems: [
        { id: 'dash', label: 'Dashboard Overview', icon: 'home', active: true },
        { id: 'k8s', label: 'Kubernetes Pods', icon: 'layer-group' },
        { id: 'audit', label: 'Compliance Audit', icon: 'sliders' }
      ]
    },
    sbSearchTree: {
      title: 'Components Documentation',
      catalogLabel: 'Catalog Categories',
      activeLeafId: 'buttons',
      treeData: [
        {
          id: 'ui-components',
          label: 'UI Components',
          icon: 'folder-open',
          expanded: true,
          children: [
            { id: 'buttons', label: 'Buttons & Actions', active: true },
            { id: 'inputs', label: 'Form Inputs' },
            { id: 'tables', label: 'Data Tables' }
          ]
        },
        {
          id: 'blocks',
          label: 'Layout Blocks',
          icon: 'folder',
          expanded: false,
          children: [
            { id: 'multicol', label: 'Multi-Column Layouts' },
            { id: 'sidebars', label: 'Sidebar Layouts' }
          ]
        }
      ]
    },
    sbPinnedStatus: {
      brandName: 'Sentinel Ops',
      systemStatus: 'All Systems Operational',
      uptimeText: '99.98% Uptime',
      title: 'Cluster Infrastructure',
      activeNavId: 'overview',
      navItems: [
        { id: 'overview', icon: 'home', label: 'Overview', active: true },
        { id: 'services', icon: 'layer-group', label: 'Services' },
        { id: 'settings', icon: 'sliders', label: 'Settings' }
      ]
    },
    sbOffcanvas: {
      brandName: 'Responsive Mobile',
      title: 'Offcanvas Drawer Layout',
      activeNavId: 'dash',
      navItems: [
        { id: 'dash', icon: 'home', label: 'Dashboard', active: true },
        { id: 'analytics', icon: 'layer-group', label: 'Analytics' },
        { id: 'projects', icon: 'folder', label: 'Projects' },
        { id: 'team', icon: 'users', label: 'Team' },
        { id: 'settings', icon: 'sliders', label: 'Settings' }
      ]
    },
    sbMinimal: {
      brandName: 'Minimal',
      title: 'General Account Settings',
      activeNavId: 'general',
      navItems: [
        { id: 'general', label: 'General', active: true },
        { id: 'team', label: 'Team Members' },
        { id: 'billing', label: 'Billing & Plans' },
        { id: 'api', label: 'API Keys' },
        { id: 'audit', label: 'Audit Logs' }
      ]
    },
    sbStepper: {
      brandName: 'Onboarding Flow',
      currentStep: 2,
      currentStepTitle: 'Organization Profile & Domain Setup',
      currentStepSubtitle: 'Configure your company namespace, custom domain, and regional data residency.',
      steps: [
        { number: 1, label: 'Account Credentials', completed: true },
        { number: 2, label: 'Organization & Workspace' },
        { number: 3, label: 'Billing Subscription Tier' },
        { number: 4, label: 'Team Invitations' }
      ]
    },
    sbAccordion: {
      brandName: 'Enterprise Admin',
      title: 'Traffic Metrics & Telemetry',
      activeSubLinkId: 'traffic',
      groups: [
        {
          id: 'g1',
          title: 'Overview & Analytics',
          icon: 'home',
          open: true,
          links: [
            { id: 'traffic', label: 'Traffic Metrics', active: true },
            { id: 'conversions', label: 'Conversion Funnels' },
            { id: 'events', label: 'Realtime Events' }
          ]
        },
        {
          id: 'g2',
          title: 'Access Management',
          icon: 'users',
          open: false,
          links: [
            { id: 'team', label: 'Team Members' },
            { id: 'roles', label: 'Roles & Policies' },
            { id: 'sso', label: 'SSO & SAML' }
          ]
        }
      ]
    },
    stClassic: {
      brandName: 'Orbit Portal',
      userName: 'Graeme Gorman',
      title: 'Dashboard Overview',
      activeNavId: 'dash',
      navItems: [
        { id: 'dash', label: 'Dashboard', active: true },
        { id: 'team', label: 'Team' },
        { id: 'projects', label: 'Projects' },
        { id: 'calendar', label: 'Calendar' }
      ]
    },
    stSubnav: {
      brandName: 'Nexus Hub',
      userName: 'Diana Prince',
      activeTabId: 'overview',
      tabs: [
        { id: 'overview', label: 'Overview', active: true },
        { id: 'members', label: 'Members' },
        { id: 'settings', label: 'Settings' },
        { id: 'usage', label: 'Usage & Invoices' }
      ]
    },
    stHero: {
      brandName: 'Quantum Cloud',
      heroTitle: 'Supercharge Your Enterprise Operations',
      heroSubtitle: 'Deploy scalable microservices and monitor real-time event pipelines with zero downtime.',
      primaryCta: 'Get Started Free',
      secondaryCta: 'Documentation',
      navLinks: [
        { id: 'overview', label: 'Overview', active: true },
        { id: 'features', label: 'Features' },
        { id: 'pricing', label: 'Pricing' }
      ]
    },
    stFloat: {
      brandName: 'Float System',
      userName: 'Graeme G.',
      title: 'Workspace Control Deck'
    },
    stSticky: {
      brandName: 'Catalog Engine',
      pageTitle: 'All Products & Variants',
      itemCount: 142,
      addBtnLabel: 'Add Record',
      activeNavId: 'inventory',
      navLinks: [
        { id: 'inventory', label: 'Inventory', active: true },
        { id: 'suppliers', label: 'Suppliers' },
        { id: 'reports', label: 'Reports' }
      ]
    },
    stDock: {
      brandName: 'Dock Space',
      activeTab: 'Live Grid',
      activeDockId: 'home',
      dockItems: [
        { id: 'home', icon: 'home', title: 'Home', active: true },
        { id: 'search', icon: 'search', title: 'Search' },
        { id: 'projects', icon: 'folder', title: 'Projects' },
        { id: 'team', icon: 'users', title: 'Team' },
        { id: 'settings', icon: 'sliders', title: 'Settings' }
      ]
    }
  },
  dashboards: {
    saas: {
      kpis: [
        {
          label: 'Monthly Recurring Revenue',
          value: '$84,250',
          icon: 'layer-group',
          iconBg: 'rgba(99, 102, 241, 0.12)',
          iconColor: 'var(--gp-primary)',
          trendText: '+18.4% from last month',
          trendType: 'positive' as const
        },
        {
          label: 'Active Subscribers',
          value: '1,429',
          icon: 'users',
          iconBg: 'rgba(16, 185, 129, 0.12)',
          iconColor: 'var(--gp-success)',
          trendText: '+92 this month',
          trendType: 'positive' as const
        },
        {
          label: 'Average Revenue Per User',
          value: '$58.95',
          icon: 'star',
          iconBg: 'rgba(59, 130, 246, 0.12)',
          iconColor: 'var(--gp-info)',
          trendText: '+4.2% vs target',
          trendType: 'positive' as const
        },
        {
          label: 'Net Revenue Churn',
          value: '0.8%',
          icon: 'sliders',
          iconBg: 'rgba(245, 158, 11, 0.12)',
          iconColor: 'var(--gp-warning)',
          trendText: '-0.3% churn reduction',
          trendType: 'positive' as const
        }
      ],
      chartTitle: 'Monthly Recurring Revenue (MRR)',
      chartBadge: '+24.8% YoY Growth',
      monthlyData: [
        { month: 'Jan', amt: '$52K', pct: 45 },
        { month: 'Feb', amt: '$58K', pct: 52 },
        { month: 'Mar', amt: '$64K', pct: 60 },
        { month: 'Apr', amt: '$71K', pct: 68 },
        { month: 'May', amt: '$77K', pct: 75 },
        { month: 'Jun', amt: '$84K', pct: 85 }
      ],
      goalsTitle: 'Target Conversion Quotas',
      goalsTarget: '88% of Q3 Target Achieved',
      quotas: [
        { label: 'Enterprise Plan Conversions', valText: '44 / 50', pct: 88 },
        { label: 'Self-Serve Pro Signups', valText: '380 / 400', pct: 95 },
        { label: 'Annual Contract Pre-pays', valText: '28 / 35', pct: 80 }
      ],
      tableTitle: 'Recent Organization Subscriptions',
      recentSignups: [
        {
          name: 'Acme Technologies Ltd',
          domain: 'acme-tech.com',
          plan: 'Enterprise Annual',
          cycle: 'Annually',
          mrr: '$12,000.00',
          status: 'Active'
        },
        {
          name: 'Starlight Media Studios',
          domain: 'starlight.media',
          plan: 'Team Pro Monthly',
          cycle: 'Monthly',
          mrr: '$299.00',
          status: 'Active'
        },
        {
          name: 'DevFlow Systems',
          domain: 'devflow.io',
          plan: 'Starter Monthly',
          cycle: 'Monthly',
          mrr: '$49.00',
          status: 'Active'
        }
      ]
    },
    ecommerce: {
      kpis: [
        { label: "Today's Gross Sales", value: '$18,940.00', meta: '+24.5% vs yesterday', trend: 'pos' as const },
        { label: 'Total Orders Placed', value: '412', meta: '+38 orders today', trend: 'pos' as const },
        { label: 'Average Order Value', value: '$45.97', meta: '-1.2% variance', trend: 'neg' as const },
        { label: 'Conversion Rate', value: '3.84%', meta: '+0.6% vs avg', trend: 'pos' as const }
      ],
      topProducts: [
        { name: 'Ultra-Wide Studio Display 34"', category: 'Hardware Displays', revenue: '$9,840.00', sales: 18 },
        { name: 'Mechanical Ergonomic Keyboard', category: 'Peripherals', revenue: '$4,280.00', sales: 29 },
        { name: 'Noise-Cancelling Studio Headset', category: 'Audio', revenue: '$3,120.00', sales: 16 }
      ],
      recentOrders: [
        { id: '9021', customer: 'Sophia Bennett', amount: '$142.50', status: 'Delivered' },
        { id: '9020', customer: 'Ethan Hunt', amount: '$89.00', status: 'Processing' },
        { id: '9019', customer: 'Olivia Wilde', amount: '$215.80', status: 'Delivered' }
      ]
    },
    analytics: {
      stats: [
        { title: 'Total Sessions', value: '482,900', change: '+14.2% vs prev period', trend: 'pos' as const },
        { title: 'Unique Visitors', value: '312,450', change: '+8.9% new users', trend: 'pos' as const },
        { title: 'Bounce Rate', value: '32.4%', change: '-2.1% improvement', trend: 'pos' as const },
        { title: 'Avg Session Duration', value: '3m 42s', change: '+12s vs avg', trend: 'neu' as const }
      ],
      channels: [
        { name: 'Organic Search (Google, Bing)', pct: 48, users: '231.8K' },
        { name: 'Direct Traffic', pct: 28, users: '135.2K' },
        { name: 'Referral & Backlinks', pct: 14, users: '67.6K' },
        { name: 'Social & Campaigns', pct: 10, users: '48.3K' }
      ],
      regions: [
        { country: 'United States', sessions: '198,400', pct: 41 },
        { country: 'Germany', sessions: '68,200', pct: 14 },
        { country: 'United Kingdom', sessions: '54,100', pct: 11 },
        { country: 'Japan', sessions: '38,900', pct: 8 },
        { country: 'Canada', sessions: '32,500', pct: 7 }
      ]
    },
    finance: {
      balanceLabel: 'Total Liquid Treasury',
      balanceAmount: '$5,498,600.40',
      balanceMeta: '+$142,000 net cashflow this month (+2.6%)',
      ledgerTitle: 'Recent Banking Ledger',
      ledgerBadge: 'Live Feed',
      ledger: [
        {
          id: '1',
          desc: 'Stripe SaaS Inflow Batch',
          date: 'Today at 3:15 PM',
          amount: '$42,500.00',
          type: 'in' as const
        },
        {
          id: '2',
          desc: 'Google Cloud Platform (GCP)',
          date: 'Yesterday at 11:20 AM',
          amount: '$8,450.20',
          type: 'out' as const
        },
        {
          id: '3',
          desc: 'Enterprise Wire - Apex Systems',
          date: 'Aug 26, 2026',
          amount: '$125,000.00',
          type: 'in' as const
        },
        { id: '4', desc: 'Deel Global Payroll Run', date: 'Aug 25, 2026', amount: '$68,400.00', type: 'out' as const }
      ],
      invoicesTitle: 'Pending Client Invoices',
      invoices: [
        { id: 'INV-4820', client: 'Acme Mega Corp', due: 'in 3 days', amount: '$34,500.00', status: 'Pending' },
        { id: 'INV-4819', client: 'Cyberdyne AI Ltd', due: 'in 5 days', amount: '$18,900.00', status: 'Pending' },
        { id: 'INV-4818', client: 'Stark Innovations', due: 'Paid Aug 27', amount: '$52,000.00', status: 'Paid' }
      ]
    },
    pm: {
      metrics: [
        { title: 'Sprint 42 Velocity', value: '94 pts', progress: 78 },
        { title: 'Open Tickets', value: '28 Tasks', subText: '12 In Progress, 6 Review' },
        { title: 'Sprint Days Left', value: '4 Days', subText: 'Ends Friday, Sep 04' }
      ],
      columns: [
        {
          title: 'In Progress',
          count: 2,
          badgeSeverity: 'primary' as const,
          tasks: [
            {
              tag: 'Feature',
              tagType: 'feat',
              title: 'Implement Webhook Signature Verification',
              assigneeLabel: 'J',
              points: '5 pts'
            },
            {
              tag: 'Bugfix',
              tagType: 'bug',
              title: 'Fix Safari SVG gradient clipping',
              assigneeLabel: 'S',
              points: '3 pts'
            }
          ]
        },
        {
          title: 'Code Review',
          count: 1,
          badgeSeverity: 'warning' as const,
          tasks: [
            {
              tag: 'Feature',
              tagType: 'feat',
              title: 'Add 2FA SMS Authentication Fallback',
              assigneeLabel: 'A',
              points: '8 pts'
            }
          ]
        },
        {
          title: 'Completed (This Sprint)',
          count: 1,
          badgeSeverity: 'success' as const,
          tasks: [
            {
              tag: 'Feature',
              tagType: 'feat',
              title: 'Export PDF Invoices with QR Code',
              assigneeLabel: 'M',
              points: '5 pts'
            }
          ]
        }
      ]
    },
    ops: {
      bannerText: 'All Global Edge Clusters Operational',
      uptimeBadge: '99.994% Uptime (30d)',
      nodes: [
        { name: 'us-east-cluster-01 (N. Virginia)', status: 'Healthy', cpu: 42, ram: 58, latency: 18, rps: '4.8K' },
        { name: 'eu-west-cluster-01 (Frankfurt)', status: 'Healthy', cpu: 38, ram: 49, latency: 24, rps: '3.2K' },
        { name: 'ap-southeast-cluster-01 (Tokyo)', status: 'Healthy', cpu: 64, ram: 72, latency: 35, rps: '5.1K' }
      ]
    }
  },
  settings: {
    profile: {
      userName: 'Jane Doe',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@enterprise.io',
      jobTitle: 'VP of Engineering',
      bio: 'Passionate about distributed systems, UI design systems, and frontend developer experience.'
    },
    security: {
      title: 'Security Settings',
      subtitle: 'Manage your password, two-factor authentication, and active browser sessions.',
      twoFaEnabled: true,
      sessions: [
        {
          device: 'MacBook Pro 16" (Sonoma 14.5)',
          location: 'San Francisco, CA',
          ip: '192.0.2.1',
          lastActive: 'Active now',
          isCurrent: true
        },
        {
          device: 'iPhone 15 Pro (iOS 18.0)',
          location: 'San Francisco, CA',
          ip: '192.0.2.45',
          lastActive: '2 hours ago',
          isCurrent: false
        },
        {
          device: 'Chrome on Windows 11',
          location: 'London, UK',
          ip: '198.51.100.24',
          lastActive: '3 days ago',
          isCurrent: false
        }
      ]
    },
    billing: {
      title: 'Billing & Subscriptions',
      subtitle: 'Manage your enterprise plan, payment method, and billing history.',
      planName: 'Enterprise Growth Tier',
      planStatus: 'Active',
      planPrice: '$499 / month • Billed annually (Renews Nov 15, 2026)',
      invoices: [
        { id: 'INV-2026-008', date: 'Aug 01, 2026', amount: '$499.00', status: 'Paid' },
        { id: 'INV-2026-007', date: 'Jul 01, 2026', amount: '$499.00', status: 'Paid' },
        { id: 'INV-2026-006', date: 'Jun 01, 2026', amount: '$499.00', status: 'Paid' }
      ]
    },
    notifications: {
      title: 'Notification Preferences',
      subtitle: 'Choose which email and push events you would like to receive.',
      preferences: [
        {
          id: 'security',
          title: 'Security & Login Alerts',
          desc: 'Get notified immediately whenever a new device signs into your account.',
          enabled: true
        },
        {
          id: 'deployments',
          title: 'Deployment & Build Triggers',
          desc: 'Receive real-time notifications for automated CI/CD pipeline completions and failures.',
          enabled: true
        },
        {
          id: 'billing',
          title: 'Invoice & Payment Receipts',
          desc: 'Monthly summary invoices and subscription renewal receipts.',
          enabled: true
        },
        {
          id: 'marketing',
          title: 'Product News & Feature Announcements',
          desc: 'Occasional updates on new component releases and performance enhancements.',
          enabled: false
        }
      ]
    },
    team: {
      title: 'Team Members & Permissions',
      subtitle: 'Manage team role access policies and invite new collaborators.',
      members: [
        { name: 'Jane Doe', email: 'jane.doe@enterprise.io', role: 'Owner', status: 'Active' },
        { name: 'Alex Rivera', email: 'alex.rivera@enterprise.io', role: 'Admin', status: 'Active' },
        { name: 'Sarah Chen', email: 'sarah.chen@enterprise.io', role: 'Developer', status: 'Active' },
        { name: 'Michael Scott', email: 'michael.s@enterprise.io', role: 'Viewer', status: 'Pending Invite' }
      ]
    },
    apiKeys: {
      title: 'API Authentication Tokens',
      subtitle: 'Create and manage secret API keys for programmatic access.',
      apiKeys: [
        {
          name: 'Production Telemetry Ingest',
          scope: 'Read/Write',
          token: 'gp_live_8942019482103984',
          created: 'Jul 12, 2026',
          lastUsed: '2 mins ago'
        },
        {
          name: 'Staging CI/CD Pipeline Worker',
          scope: 'Read Only',
          token: 'gp_test_3184918239018402',
          created: 'Aug 04, 2026',
          lastUsed: '4 hours ago'
        },
        {
          name: 'Legacy Data Exporter',
          scope: 'Admin',
          token: 'gp_live_0194829104820194',
          created: 'Jan 15, 2026',
          lastUsed: '24 days ago'
        }
      ]
    },
    dangerZone: {
      actions: [
        {
          id: 'transfer',
          title: 'Transfer Account Ownership',
          desc: 'Transfer ownership of this organization, billing subscriptions, and repositories to another admin.',
          buttonLabel: 'Transfer',
          buttonVariant: 'outlined' as const
        },
        {
          id: 'delete',
          title: 'Delete Entire Workspace & Data',
          desc: 'Permanently remove this organization and all associated database records. This action cannot be undone.',
          buttonLabel: 'Delete Account',
          buttonVariant: 'filled' as const
        }
      ]
    },
    customer: {
      customerName: 'Robert Downey',
      customerStatus: 'Active Partner',
      companyName: 'Downey Industries & Tech',
      location: 'San Francisco, CA',
      tags: ['Enterprise Tier', 'VIP Account', 'High Volume'],
      metaFields: [
        {
          label: 'Work Email',
          value: 'robert.d@downey-tech.com',
          isLink: true,
          href: 'mailto:robert.d@downey-tech.com'
        },
        { label: 'Direct Phone', value: '+1 (555) 234-8900', isLink: true, href: 'tel:+15552348900' },
        { label: 'Billing Address', value: '100 Innovation Way, Suite 400, San Francisco, CA' },
        { label: 'Assigned Executive', value: 'Elena Rostova (VP Customer Success)' }
      ],
      timelineEvents: [
        {
          id: '1',
          title: 'Contract Renewal Signed (Annual Enterprise Pro)',
          date: 'Today at 10:30 AM',
          bulletClass: 'bg-green'
        },
        { id: '2', title: 'Security Audit Check Completed', date: 'Yesterday at 3:15 PM', bulletClass: 'bg-blue' },
        { id: '3', title: '10 Additional Developer Seats Provisioned', date: 'Aug 24, 2026', bulletClass: 'bg-purple' }
      ]
    },
    order: {
      orderId: 'ORD-89421',
      orderStatus: 'Paid',
      orderDate: 'August 28, 2026',
      paymentMethod: 'Mastercard ending in 4242',
      subtotal: '$698.00',
      shipping: '$15.00',
      tax: '$57.58',
      grandTotal: '$770.58',
      items: [
        { name: 'Ultra-Wide Curved Studio Monitor 34"', sku: 'MON-34-UW', qty: 1, price: '$549.00', total: '$549.00' },
        {
          name: 'Ergonomic Mechanical Keyboard (Linear Red)',
          sku: 'KB-MECH-RED',
          qty: 1,
          price: '$149.00',
          total: '$149.00'
        }
      ]
    }
  },
  headings: {
    actions: {
      title: 'Production Clusters',
      badgeText: 'Live',
      badgeSeverity: 'success' as const,
      subtitle: 'Manage multi-region deployment nodes, automated failover triggers, and cluster health telemetry.',
      breadcrumbs: [
        { label: 'Infrastructure', url: '/infrastructure' },
        { label: 'Kubernetes', url: '/infrastructure/k8s' },
        { label: 'Production Clusters' }
      ],
      actions: [
        {
          id: 'scale',
          label: 'Scale Nodes',
          icon: 'sliders',
          variant: 'outlined' as const,
          severity: 'secondary' as const
        },
        {
          id: 'deploy',
          label: 'New Deployment',
          icon: 'plus',
          variant: 'filled' as const,
          severity: 'primary' as const
        }
      ]
    },
    filters: {
      title: 'API Security Audits',
      subtitle: 'Search and inspect encrypted request payloads, authorization tokens, and IP geolocations.',
      filterGroups: [
        {
          id: 'status',
          options: [
            { label: 'All Statuses', value: 'all' },
            { label: '200 OK', value: '200' },
            { label: '401 Unauthorized', value: '401' },
            { label: '500 Server Error', value: '500' }
          ]
        },
        {
          id: 'environment',
          options: [
            { label: 'Production (Edge)', value: 'prod' },
            { label: 'Staging (US-East)', value: 'staging' },
            { label: 'Development Sandbox', value: 'dev' }
          ]
        }
      ]
    },
    tabs: {
      title: 'Project Configurations',
      description: 'Manage your organization workspaces, team access policies, and automated webhook triggers.',
      tabs: [
        { id: 'general', label: 'General', count: '4', active: true },
        { id: 'integrations', label: 'Integrations', count: '12' },
        { id: 'webhooks', label: 'Webhooks', count: '2' },
        { id: 'audit', label: 'Audit Log' }
      ]
    },
    stats: {
      title: 'Infrastructure Telemetry',
      description: 'Real-time CPU compute utilization, memory footprint, and global edge throughput.',
      stats: [
        { label: 'Total Ingestion', value: '48.2 GB/s' },
        { label: 'P99 Latency', value: '18.4 ms' },
        { label: 'Error Budget', value: '99.99%' }
      ]
    },
    breadcrumb: {
      backLabel: 'Back to Projects',
      activeItem: 'Security & Credentials',
      editBtnLabel: 'Edit Policy',
      shareBtnLabel: 'Share Link'
    },
    profileBanner: {
      userName: 'Dr. Alexander Hayes',
      statusText: 'Online',
      statusSeverity: 'success' as const,
      userTitle: 'Principal Architect',
      location: 'Seattle, WA'
    }
  },
  dataDisplays: {
    kpi: {
      kpis: [
        {
          label: 'Total Revenue',
          value: '$128,430',
          change: '+14.2%',
          isUp: true,
          caption: 'vs last month',
          icon: 'layer-group',
          iconBg: 'rgba(99, 102, 241, 0.12)',
          iconColor: 'var(--gp-primary)'
        },
        {
          label: 'Active Customers',
          value: '3,842',
          change: '+124',
          isUp: true,
          caption: 'this week',
          icon: 'users',
          iconBg: 'rgba(16, 185, 129, 0.12)',
          iconColor: 'var(--gp-success)'
        },
        {
          label: 'Support Tickets',
          value: '18',
          change: '-6',
          isUp: false,
          caption: 'open issues',
          icon: 'sliders',
          iconBg: 'rgba(245, 158, 11, 0.12)',
          iconColor: 'var(--gp-warning)'
        },
        {
          label: 'Average Response Time',
          value: '1m 45s',
          change: '-15s',
          isUp: true,
          caption: 'SLA improvement',
          icon: 'star',
          iconBg: 'rgba(59, 130, 246, 0.12)',
          iconColor: 'var(--gp-info)'
        }
      ]
    },
    descList: {
      title: 'Cluster Instance Details',
      subtitle: 'Technical specifications and provisioning configuration.',
      items: [
        { label: 'Cluster Engine', value: 'Kubernetes v1.31.2' },
        { label: 'Health Status', value: 'Healthy & Balanced', badge: true, badgeSeverity: 'success' as const },
        { label: 'Node Pool Architecture', value: 'AMD64 EPYC (24 vCPUs / 96GB RAM)' },
        { label: 'Auto-Scaling Limit', value: 'Min 4 / Max 32 Nodes' },
        { label: 'VPC Subnet CIDR', value: '10.0.0.0/16 (Private Dedicated)' },
        { label: 'TLS Certificate Expiry', value: 'Nov 24, 2027 (Auto-Renewing)' }
      ]
    },
    timeline: {
      title: 'Infrastructure Deployment Stream',
      events: [
        {
          title: 'Production Release v2.4.0 deployed',
          time: 'Today at 14:20 UTC',
          desc: 'Deployed by automated GitHub Action runner. 42 microservices upgraded with zero downtime.',
          author: 'Graeme G.',
          icon: 'check',
          color: 'var(--gp-success)'
        },
        {
          title: 'Database Index Optimization completed',
          time: 'Yesterday at 22:15 UTC',
          desc: 'PostgreSQL automated vacuum and re-indexing executed across 18 partition tables.',
          author: 'Alex R.',
          icon: 'sliders',
          color: 'var(--gp-primary)'
        },
        {
          title: 'TLS Wildcard Certificate renewed',
          time: 'Aug 24, 2026',
          desc: "Let's Encrypt 90-day automated DNS challenge certificate renewal succeeded.",
          author: 'Cert Bot',
          icon: 'star',
          color: 'var(--gp-info)'
        }
      ]
    },
    meter: {
      title: 'Cluster Resource Allocation & Limits',
      subtitle: 'Real-time telemetry indicators across compute, memory, and networking.',
      meters: [
        { label: 'CPU Cores Allocation', current: '184', max: '256 Cores', pct: 72 },
        { label: 'RAM Memory Footprint', current: '680', max: '1024 GB', pct: 66 },
        { label: 'NVMe Storage Volume', current: '14.2', max: '16.0 TB', pct: 89 },
        { label: 'Global Bandwidth Quota', current: '94.2', max: '100 TB', pct: 94 }
      ]
    },
    badges: {
      title: 'Status & Tag Taxonomy',
      subtitle: 'Hierarchical tag grouping and badges for metadata categorization.',
      groups: [
        {
          title: 'Deployment Statuses',
          items: [
            { value: 'Live in Production', severity: 'success' as const },
            { value: 'Staging Candidate', severity: 'primary' as const },
            { value: 'QA Validation', severity: 'warning' as const },
            { value: 'Deprecated Build', severity: 'danger' as const }
          ]
        },
        {
          title: 'Technology Tags',
          items: [
            { value: 'Angular 19', severity: 'primary' as const, isTag: true },
            { value: 'TypeScript 5.6', severity: 'secondary' as const, isTag: true },
            { value: 'gp-css & SCSS', severity: 'info' as const, isTag: true },
            { value: 'WebAssembly', severity: 'success' as const, isTag: true },
            { value: 'GraphQL', severity: 'contrast' as const, isTag: true }
          ]
        }
      ]
    },
    statsCounter: {
      counters: [
        { number: '99.99%', label: 'Guaranteed SLA Uptime', desc: 'Backed by enterprise financial SLA guarantees.' },
        { number: '4.2B+', label: 'Monthly API Requests', desc: 'Processed with zero downtime.' },
        { number: '< 20ms', label: 'Global Edge Latency', desc: 'Across 140+ edge POP locations worldwide.' },
        { number: '140+', label: 'Edge POP Locations', desc: 'Active in 48 countries globally.' }
      ]
    }
  },
  lists: {
    grid: {
      searchPlaceholder: 'Filter orders by ID or customer...',
      rows: [
        {
          id: '1042',
          customer: 'Graeme Gorman',
          date: 'Aug 28, 2026',
          amount: '$1,420.00',
          payment: 'Paid',
          fulfillment: 'Delivered'
        },
        {
          id: '1043',
          customer: 'Sarah Connor',
          date: 'Aug 27, 2026',
          amount: '$845.00',
          payment: 'Paid',
          fulfillment: 'Shipped'
        },
        {
          id: '1044',
          customer: 'Alex Murphy',
          date: 'Aug 27, 2026',
          amount: '$2,100.00',
          payment: 'Pending',
          fulfillment: 'Processing'
        },
        {
          id: '1045',
          customer: 'Ellen Ripley',
          date: 'Aug 26, 2026',
          amount: '$4,800.00',
          payment: 'Paid',
          fulfillment: 'Delivered'
        }
      ]
    },
    feed: {
      title: 'Team Collaboration Feed',
      badgeText: 'Real-time',
      feedItems: [
        {
          author: 'Marcus Vance',
          action: 'opened pull request',
          target: '#402: Add Dark Mode Theme Presets',
          message: 'Ready for review. All unit tests and visual diffs passing.',
          time: '14 minutes ago'
        },
        {
          author: 'Elena Rostova',
          action: 'commented on issue',
          target: '#389: Performance optimization',
          message: 'Reduced initial bundle size by 34% by code-splitting heavy icon assets.',
          time: '1 hour ago'
        },
        { author: 'Graeme Gorman', action: 'deployed release tag', target: 'v0.2.1-production', time: '3 hours ago' }
      ]
    },
    cards: {
      title: 'Microservice Repositories',
      subtitle: 'Active backend services, microfrontends, and serverless jobs in this organization cluster.',
      cards: [
        {
          icon: 'box',
          title: 'auth-gateway-service',
          status: 'Active',
          desc: 'OAuth2/OIDC JWT authentication and session token validation proxy service.',
          meta: 'TypeScript • Updated 2h ago'
        },
        {
          icon: 'layer-group',
          title: 'billing-stripe-worker',
          status: 'Active',
          desc: 'Asynchronous event handler for webhooks, invoices, and automated subscription reconciliation.',
          meta: 'Go • Updated 1d ago'
        },
        {
          icon: 'sliders',
          title: 'telemetry-metrics-pipeline',
          status: 'Active',
          desc: 'High-throughput Prometheus and OpenTelemetry distributed log aggregation engine.',
          meta: 'Rust • Updated 3d ago'
        }
      ]
    },
    tx: {
      title: 'Recent Banking Transactions',
      badgeText: 'Live Sync',
      transactions: [
        {
          title: 'Stripe SaaS Subscription Batch',
          category: 'Customer Inflow',
          date: 'Today at 3:15 PM',
          amount: '$12,480.00',
          type: 'in' as const,
          status: 'Completed'
        },
        {
          title: 'Google Cloud Platform Hosting',
          category: 'Cloud Operations',
          date: 'Yesterday at 11:20 AM',
          amount: '$3,890.50',
          type: 'out' as const,
          status: 'Completed'
        },
        {
          title: 'Enterprise Contract (Apex Corp)',
          category: 'Direct Wire',
          date: 'Aug 24, 2026',
          amount: '$48,000.00',
          type: 'in' as const,
          status: 'Completed'
        }
      ]
    },
    users: {
      title: 'Engineering Core Team',
      users: [
        { name: 'Dr. Evelyn Reed', role: 'VP of Engineering', online: true },
        { name: 'James Wilson', role: 'Staff Frontend Architect', online: true },
        { name: 'Aaliyah Patel', role: 'Principal Security Analyst', online: false },
        { name: 'Kenji Sato', role: 'DevOps & SRE Lead', online: true }
      ]
    },
    files: {
      title: 'Brand Assets & Media Kit',
      files: [
        { name: 'generatedpixel-vector-logos.zip', size: '24.8 MB', date: 'Aug 15, 2026', by: 'Design Team' },
        { name: 'gp-blocks-architecture-specification.pdf', size: '4.2 MB', date: 'Aug 22, 2026', by: 'Graeme Gorman' },
        { name: 'figma-tokens-export-v2.json', size: '340 KB', date: 'Aug 28, 2026', by: 'Design System Team' }
      ]
    }
  },
  forms: {
    wizard: {
      steps: [
        { number: 1, label: 'Account Credentials' },
        { number: 2, label: 'Organization' },
        { number: 3, label: 'Confirmation' }
      ]
    },
    auth: {
      brandName: 'Generated Pixel',
      heroTitle: 'Welcome to Generated Pixel Blocks',
      heroDesc:
        'The most comprehensive, beautifully crafted UI component and application block library for Angular 19.',
      formTitle: 'Welcome Back',
      formSubtitle: 'Enter your enterprise credentials to access your console.'
    },
    userProfile: {
      title: 'Account & Organization Profile',
      subtitle: 'Manage your contact details, enterprise email, and timezone settings.'
    },
    checkout: {
      title: 'Secure Checkout & Payment',
      subtitle: 'Enter your billing card details to complete your enterprise subscription.',
      amount: '$499.00 / month'
    },
    contact: {
      title: 'Send Us Your Feedback',
      subtitle: "Have a question, feature idea, or component request? We'd love to hear from you."
    },
    filter: {
      title: 'Dynamic Query & Filter Builder'
    }
  },
  feedbacks: {
    alerts: {
      alerts: [
        {
          id: '1',
          severity: 'info' as const,
          title: 'Maintenance Window Scheduled',
          message: 'Database optimization is scheduled for Sunday at 02:00 UTC with expected downtime under 2 minutes.'
        },
        {
          id: '2',
          severity: 'success' as const,
          title: 'Cluster Scaled Successfully',
          message: 'Autoscaler provisioned 6 new edge replicas to accommodate current query throughput.'
        },
        {
          id: '3',
          severity: 'warning' as const,
          title: 'API Deprecation Warning',
          message: 'Legacy v1 REST endpoints will be sunset on December 31, 2026. Please upgrade to v2.'
        }
      ]
    },
    empty: {
      title: 'No Active Repositories Found',
      description: 'Get started by creating a new repository or importing an existing project from GitHub or GitLab.',
      primaryCta: 'Create New Repository',
      secondaryCta: 'Import Existing Project'
    },
    confirm: {
      title: 'Delete Production Database?',
      message:
        'Are you sure you want to permanently delete this production database cluster? All 12 tables and backups will be immediately erased. This action cannot be reversed.',
      confirmBtnLabel: 'Permanently Delete',
      cancelBtnLabel: 'Cancel'
    },
    toast: {
      toasts: [
        {
          id: '1',
          title: 'Deployment Succeeded',
          desc: 'Version 2.4.0 is now live across all 8 edge regions.',
          severity: 'success' as const
        },
        {
          id: '2',
          title: 'High CPU Utilization',
          desc: 'Worker node worker-03 reached 94% CPU quota threshold.',
          severity: 'warning' as const
        },
        {
          id: '3',
          title: 'New Team Invitation',
          desc: 'Sarah Chen accepted your organization invitation.',
          severity: 'info' as const
        }
      ]
    },
    rating: {
      title: 'Rate Your Experience',
      subtitle: 'How satisfied are you with the performance and quality of our component blocks?'
    }
  },
  navs: {
    topbar: {
      brandName: 'Generated Pixel',
      userName: 'Graeme G.',
      navLinks: [
        { id: 'dashboard', label: 'Dashboard', url: '/', active: true },
        { id: 'components', label: 'Components', url: '/components' },
        { id: 'blocks', label: 'Blocks', url: '/blocks' },
        { id: 'templates', label: 'Templates', url: '/templates' },
        { id: 'documentation', label: 'Documentation', url: '/docs' }
      ]
    },
    palette: {
      placeholder: 'Search documentation, jump to component...',
      groupLabel: 'Suggested Commands',
      commands: [
        { id: '1', icon: 'search', label: 'Search All Blocks', subLabel: 'Jump to block gallery', shortcut: '⌘K' },
        {
          id: '2',
          icon: 'sliders',
          label: 'Theme Customizer',
          subLabel: 'Switch light/dark accent presets',
          shortcut: '⌘T'
        },
        {
          id: '3',
          icon: 'layer-group',
          label: 'Schema Form Generator',
          subLabel: 'Open dynamic JSON renderer',
          shortcut: '⌘F'
        },
        { id: '4', icon: 'users', label: 'Manage Team Access', subLabel: 'Organization settings', shortcut: '⌘M' }
      ]
    },
    slideOver: {
      title: 'Cluster Node Configuration',
      description: 'Adjust runtime CPU quotas and worker instance allocation.'
    },
    dropdown: {
      signedInLabel: 'Signed in as',
      userEmail: 'graeme@enterprise.io',
      primaryItems: [
        { id: 'profile', icon: 'users', label: 'My Profile' },
        { id: 'billing', icon: 'layer-group', label: 'Billing & Plans' },
        { id: 'security', icon: 'sliders', label: 'Security & 2FA' }
      ],
      dangerItems: [{ id: 'logout', icon: 'close', label: 'Sign Out' }]
    },
    mega: {
      sections: [
        {
          title: 'Products & Platforms',
          links: [
            { title: 'Core UI Kit', desc: '80+ accessible primitives and rich widgets', url: '/components' },
            { title: 'Blocks Library', desc: 'Pre-assembled application shells and screens', url: '/blocks' },
            { title: 'Iconography Engine', desc: 'Over 1,200 vectorized scalable SVGs', url: '/icons' }
          ]
        },
        {
          title: 'Developer Resources',
          links: [
            { title: 'Documentation', desc: 'Getting started guides and API references', url: '/docs' },
            {
              title: 'Interactive Playground',
              desc: 'JSON schema sandbox and theme editor',
              url: '/blocks-playground'
            },
            { title: 'Community Discord', desc: 'Connect with fellow Angular engineers', url: '/community' }
          ]
        }
      ],
      promo: {
        badge: 'NEW RELEASE',
        title: 'Angular 19 Signal Engine',
        text: 'Zero-overhead reactivity with native Angular Signal inputs and outputs.',
        ctaText: 'Explore Signals Guide →'
      }
    },
    tabs: {
      underlineTabs: [
        { id: 'overview', label: 'Overview', badge: 'New' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'reports', label: 'Reports', badge: '12' },
        { id: 'settings', label: 'Settings' }
      ],
      activeUnderlineTab: 'overview',
      pillTabs: [
        { id: 'day', label: 'Daily View' },
        { id: 'week', label: 'Weekly View' },
        { id: 'month', label: 'Monthly View' },
        { id: 'year', label: 'Annual Summary' }
      ],
      activePillTab: 'week'
    }
  },
  pages: {
    p404: {
      code: '404',
      title: 'Page Not Found',
      description: "Sorry, the page you are looking for doesn't exist or has been relocated to another URL.",
      goBackBtnLabel: 'Go Back',
      returnHomeBtnLabel: 'Back to Home'
    },
    p500: {
      code: '500',
      title: 'Internal Server Error',
      description:
        'An unexpected error occurred while processing your request. Our automated SRE alerting system has been notified.',
      supportBtnLabel: 'Contact Support',
      retryBtnLabel: 'Try Again'
    },
    p403: {
      code: '403',
      title: 'Access Restricted',
      description:
        'You do not have permission to access this resource. Please contact your organization administrator for elevated role privileges.',
      returnHomeBtnLabel: 'Return to Dashboard',
      requestAccessBtnLabel: 'Request Access'
    },
    pMaint: {
      badgeText: 'Scheduled Upgrade in Progress',
      badgeSeverity: 'warning' as const,
      title: 'We’ll be right back!',
      description:
        'We are currently upgrading database nodes and index clusters to improve overall system throughput and query speed.',
      estimatedUptime: 'Today at 03:30 UTC (~25 mins remaining)'
    },
    pComing: {
      badgeText: 'SOMETHING BIG IS COMING',
      title: 'Next-Gen Workflow Engine',
      description:
        'We are putting the final touches on our real-time collaborative flow orchestrator. Join our priority access waitlist today.',
      countdown: [
        { label: 'Days', value: '14' },
        { label: 'Hours', value: '08' },
        { label: 'Minutes', value: '42' },
        { label: 'Seconds', value: '19' }
      ]
    },
    pSuccess: {
      title: 'Payment Successful!',
      description: 'Your enterprise subscription order has been confirmed. A receipt has been sent to your email.',
      orderNumber: 'GP-89241-TX',
      email: 'alex.rivera@enterprise.io',
      secondaryBtnLabel: 'View Dashboard',
      primaryBtnLabel: 'Download Receipt'
    }
  }
};
