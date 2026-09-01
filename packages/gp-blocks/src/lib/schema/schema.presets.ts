import { GpBlockMetadata, GpFormSchema } from './schema.types';

export const GP_SCHEMA_PRESETS: Record<string, GpBlockMetadata> = {
  userProfileSettings: {
    id: 'user-profile-settings',
    title: 'User Profile & Settings',
    category: 'settings-details',
    header: {
      title: 'Profile Settings',
      subtitle: 'Manage your public profile information, company affiliations, and account credentials.',
      badge: { text: 'Pro Tier', severity: 'primary' },
      actions: [
        {
          id: 'view-public',
          label: 'View Public Profile',
          variant: 'outlined',
          severity: 'secondary',
          icon: 'external-link'
        },
        { id: 'save-changes', label: 'Save Changes', variant: 'filled', severity: 'primary', icon: 'check' }
      ]
    },
    stats: {
      title: 'Account Usage Overview',
      columns: 3,
      items: [
        {
          id: 'storage',
          label: 'Storage Used',
          value: '42.8',
          suffix: 'GB / 100GB',
          progress: 43,
          icon: 'folder',
          iconBackground: 'rgba(59, 130, 246, 0.1)',
          iconColor: 'var(--gp-primary)'
        },
        {
          id: 'api-calls',
          label: 'API Requests',
          value: '84.2K',
          suffix: '/ 100K',
          change: '+14.6%',
          changeDirection: 'up',
          changeLabel: 'vs last month',
          icon: 'refresh',
          iconBackground: 'rgba(16, 185, 129, 0.1)',
          iconColor: 'var(--gp-success-500, #10b981)'
        },
        {
          id: 'team-seats',
          label: 'Team Seats',
          value: '8 / 10',
          badge: '2 Available',
          icon: 'users',
          iconBackground: 'rgba(245, 158, 11, 0.1)',
          iconColor: 'var(--gp-warning-500, #f59e0b)'
        }
      ]
    },
    form: {
      id: 'profile-form',
      title: 'Personal Information',
      subtitle: 'Update your personal details and contact preferences.',
      gridColumns: 12,
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'inset-label',
          placeholder: 'Jane',
          required: true,
          colSpan: 6
        },
        { name: 'lastName', label: 'Last Name', type: 'inset-label', placeholder: 'Doe', required: true, colSpan: 6 },
        {
          name: 'email',
          label: 'Email Address',
          type: 'float-label',
          placeholder: 'jane.doe@example.com',
          required: true,
          colSpan: 6,
          validation: { email: true }
        },
        {
          name: 'phone',
          label: 'Phone Number',
          type: 'mask',
          mask: '(999) 999-9999',
          placeholder: '(555) 000-0000',
          colSpan: 6
        },
        {
          name: 'role',
          label: 'Primary Role',
          type: 'select',
          colSpan: 6,
          options: [
            { label: 'Engineering Lead', value: 'eng_lead' },
            { label: 'Product Manager', value: 'pm' },
            { label: 'UI/UX Designer', value: 'designer' },
            { label: 'DevOps Engineer', value: 'devops' }
          ]
        },
        {
          name: 'skills',
          label: 'Core Competencies',
          type: 'multi-select',
          colSpan: 6,
          options: [
            { label: 'Angular Signals', value: 'angular' },
            { label: 'TypeScript', value: 'ts' },
            { label: 'Design Systems', value: 'design_sys' },
            { label: 'Cloud Architecture', value: 'cloud' }
          ]
        },
        {
          name: 'bio',
          label: 'Biography',
          type: 'textarea',
          placeholder: 'Write a brief description about yourself...',
          rows: 3,
          colSpan: 12
        },
        {
          name: 'newsletter',
          label: 'Email Notifications',
          placeholder: 'Subscribe to weekly product digest',
          type: 'checkbox',
          colSpan: 6,
          defaultValue: true
        },
        {
          name: 'twoFactor',
          label: 'Two-Factor Authentication',
          placeholder: 'Require 2FA code on login',
          type: 'switch',
          colSpan: 6,
          defaultValue: true
        }
      ],
      submitButton: { id: 'submit', label: 'Update Profile', severity: 'primary', icon: 'check' },
      resetButton: { id: 'reset', label: 'Discard Changes' }
    },
    descriptions: {
      title: 'Subscription & Security Details',
      columns: 2,
      items: [
        { label: 'Account Tier', value: 'Enterprise Pro (Annual)', type: 'badge', badgeSeverity: 'success' },
        { label: 'Renewal Date', value: 'Nov 15, 2026', type: 'text' },
        { label: 'Assigned Workspace', value: 'Acme Global Corp / Primary', type: 'text' },
        { label: 'Primary Contact', value: 'admin@acme.corp', type: 'text' }
      ]
    },
    timeline: {
      title: 'Recent Security & Activity Log',
      items: [
        {
          title: 'Password Changed',
          date: '2 hours ago',
          description: 'Updated security password from IP 192.168.1.42 (San Francisco, CA)',
          color: '#3b82f6',
          icon: 'lock'
        },
        {
          title: 'API Key Generated',
          date: 'Yesterday at 4:32 PM',
          description: 'Generated new read-only API key for CI/CD deployment runner.',
          color: '#10b981',
          icon: 'code'
        },
        {
          title: 'Team Member Invited',
          date: '3 days ago',
          description: 'Invited Sarah Connor (s.connor@acme.corp) with Developer role.',
          color: '#f59e0b',
          icon: 'user'
        }
      ]
    }
  },

  enterpriseOnboarding: {
    id: 'enterprise-onboarding',
    title: 'Enterprise Vendor & KYC Onboarding',
    category: 'forms',
    header: {
      title: 'Vendor Verification & Compliance',
      subtitle: 'Complete all corporate compliance criteria and upload verification documents.',
      badge: { text: 'Compliance 2.0', severity: 'info' }
    },
    form: {
      id: 'onboarding-form',
      title: 'Corporate Organization Details',
      subtitle: 'Please provide certified legal entity data.',
      gridColumns: 12,
      fields: [
        {
          name: 'legalName',
          label: 'Legal Entity Name',
          type: 'inset-label',
          placeholder: 'Acme Technologies LLC',
          required: true,
          colSpan: 6
        },
        {
          name: 'taxId',
          label: 'Tax Identification Number (EIN)',
          type: 'mask',
          mask: '99-9999999',
          placeholder: '12-3456789',
          required: true,
          colSpan: 6
        },
        { name: 'operatingDomain', label: 'Primary Domain', type: 'float-label', placeholder: 'acme.com', colSpan: 6 },
        {
          name: 'industryCategory',
          label: 'Primary Industry Sector',
          type: 'cascade-select',
          colSpan: 6,
          cascadeOptions: [
            {
              name: 'Technology',
              code: 'tech',
              children: [
                { name: 'Enterprise SaaS', code: 'saas' },
                { name: 'Cybersecurity', code: 'cyber' },
                { name: 'Artificial Intelligence', code: 'ai' }
              ]
            },
            {
              name: 'Financial Services',
              code: 'fin',
              children: [
                { name: 'Banking', code: 'bank' },
                { name: 'Payment Gateway', code: 'payments' }
              ]
            }
          ]
        },
        {
          name: 'complianceDateRange',
          label: 'Fiscal Audit Period',
          type: 'date-range',
          colSpan: 6,
          placeholder: 'Select start & end date'
        },
        {
          name: 'dailyClosingTime',
          label: 'Operations Closing Time',
          type: 'time',
          colSpan: 6,
          hourFormat: '24'
        },
        {
          name: 'brandPrimaryColor',
          label: 'Corporate Brand Color',
          type: 'color',
          colSpan: 4,
          defaultValue: '#6366f1'
        },
        {
          name: 'satisfactionTarget',
          label: 'Service Quality Tier',
          type: 'rating',
          colSpan: 4,
          stars: 5,
          defaultValue: 4
        },
        {
          name: 'allocatedBandwidth',
          label: 'SLA Capacity (GB/s)',
          type: 'slider',
          colSpan: 4,
          min: 10,
          max: 500,
          step: 10,
          defaultValue: 100
        },
        {
          name: 'certificateUpload',
          label: 'Incorporation & ISO Certificates',
          type: 'file-upload',
          colSpan: 12,
          multiple: true,
          accept: '.pdf,.png,.jpg'
        },
        {
          name: 'termsAgreed',
          label: 'Enterprise Terms Agreement',
          placeholder: 'I certify that all provided documents and records are accurate.',
          type: 'checkbox',
          required: true,
          colSpan: 12
        }
      ],
      submitButton: { id: 'submit-compliance', label: 'Submit Compliance Packet', severity: 'primary', icon: 'check' },
      resetButton: { id: 'reset-compliance', label: 'Clear Form' }
    }
  },

  ecommerceCheckout: {
    id: 'ecommerce-checkout',
    title: 'Checkout & Order Finalization',
    category: 'forms',
    header: {
      title: 'Order Checkout',
      subtitle: 'Complete your shipping information and payment method.',
      breadcrumbs: [
        { label: 'Store', url: '/' },
        { label: 'Cart', url: '/cart' },
        { label: 'Checkout', current: true }
      ]
    },
    form: {
      id: 'checkout-form',
      title: 'Shipping Address',
      subtitle: 'Where should we deliver your order?',
      gridColumns: 12,
      fields: [
        {
          name: 'fullName',
          label: 'Full Recipient Name',
          type: 'inset-label',
          placeholder: 'Alex Smith',
          required: true,
          colSpan: 6
        },
        { name: 'company', label: 'Company (Optional)', type: 'inset-label', placeholder: 'Acme Inc.', colSpan: 6 },
        {
          name: 'address',
          label: 'Street Address',
          type: 'text',
          placeholder: '123 Innovation Way, Suite 400',
          required: true,
          colSpan: 12
        },
        { name: 'city', label: 'City', type: 'text', placeholder: 'Austin', required: true, colSpan: 4 },
        { name: 'state', label: 'State / Province', type: 'text', placeholder: 'TX', required: true, colSpan: 4 },
        {
          name: 'postalCode',
          label: 'Postal Code',
          type: 'mask',
          mask: '99999',
          placeholder: '78701',
          required: true,
          colSpan: 4
        },
        { type: 'divider', name: 'd1', colSpan: 12 },
        {
          type: 'heading',
          name: 'h1',
          label: 'Payment Method',
          helperText: 'All transactions are 256-bit encrypted and tokenized.',
          colSpan: 12
        },
        {
          name: 'paymentType',
          label: 'Select Payment Mode',
          type: 'radio',
          colSpan: 12,
          defaultValue: 'card',
          options: [
            { label: 'Credit / Debit Card', value: 'card' },
            { label: 'PayPal Instant', value: 'paypal' },
            { label: 'Bank Wire Transfer', value: 'wire' }
          ]
        },
        {
          name: 'cardNumber',
          label: 'Card Number',
          type: 'mask',
          mask: '9999 9999 9999 9999',
          placeholder: '4000 1234 5678 9010',
          required: true,
          colSpan: 6
        },
        {
          name: 'cardExpiry',
          label: 'Expiration Date (MM/YY)',
          type: 'mask',
          mask: '99/99',
          placeholder: '12/28',
          required: true,
          colSpan: 3
        },
        {
          name: 'cardCvc',
          label: 'CVC / CVV',
          type: 'mask',
          mask: '999',
          placeholder: '321',
          required: true,
          colSpan: 3
        }
      ],
      submitButton: { id: 'pay', label: 'Authorize & Pay $499.00', severity: 'success', icon: 'lock' },
      resetButton: { id: 'cancel', label: 'Back to Cart' }
    }
  },

  saasKpiDashboard: {
    id: 'saas-kpi-dashboard',
    title: 'Executive SaaS Analytics',
    category: 'dashboards',
    header: {
      title: 'Executive Revenue Dashboard',
      subtitle: 'Real-time performance metrics and subscription health for Q3.',
      badge: { text: 'Live Feed', severity: 'success' },
      actions: [
        {
          id: 'download-pdf',
          label: 'Export PDF Report',
          variant: 'outlined',
          severity: 'secondary',
          icon: 'download'
        },
        { id: 'create-campaign', label: 'New Campaign', variant: 'filled', severity: 'primary', icon: 'plus' }
      ]
    },
    stats: {
      columns: 4,
      items: [
        {
          id: 'arr',
          label: 'Annual Run Rate',
          value: '$2.48M',
          change: '+22.4%',
          changeDirection: 'up',
          changeLabel: 'YoY Growth',
          icon: 'star',
          iconBackground: 'rgba(59, 130, 246, 0.1)',
          iconColor: '#3b82f6'
        },
        {
          id: 'mrr',
          label: 'Monthly Recurring',
          value: '$218,400',
          change: '+8.2%',
          changeDirection: 'up',
          changeLabel: 'vs last month',
          icon: 'refresh',
          iconBackground: 'rgba(16, 185, 129, 0.1)',
          iconColor: '#10b981'
        },
        {
          id: 'churn',
          label: 'Net Churn Rate',
          value: '0.84%',
          change: '-0.3%',
          changeDirection: 'up',
          changeLabel: 'Lowest in 12m',
          icon: 'check',
          iconBackground: 'rgba(139, 92, 246, 0.1)',
          iconColor: '#8b5cf6'
        },
        {
          id: 'nps',
          label: 'Customer NPS',
          value: '76 / 100',
          badge: 'World Class',
          icon: 'user',
          iconBackground: 'rgba(245, 158, 11, 0.1)',
          iconColor: '#f59e0b'
        }
      ]
    }
  }
};
