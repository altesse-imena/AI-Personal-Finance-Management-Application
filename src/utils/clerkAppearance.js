// Custom appearance configuration for Clerk authentication components
const clerkAppearance = {
  layout: {
    socialButtonsVariant: 'iconButton',
    socialButtonsPlacement: 'bottom',
    termsPageUrl: 'https://clerk.com/terms',
    privacyPageUrl: 'https://clerk.com/privacy',
    showOptionalFields: false,
    helpPageUrl: 'https://clerk.com/support',
  },
  variables: {
    colorPrimary: '#0ea5e9',
    colorText: '#1e293b',
    colorTextSecondary: '#475569',
    colorBackground: '#ffffff',
    colorInputBackground: '#f8fafc',
    colorInputText: '#1e293b',
    colorSuccess: '#10b981',
    colorDanger: '#ef4444',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontFamilyButtons: 'Inter, system-ui, sans-serif',
  },
  elements: {
    card: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: '0.75rem',
    },
    formButtonPrimary: {
      backgroundColor: '#0ea5e9',
      '&:hover': {
        backgroundColor: '#0284c7',
      },
      fontWeight: 600,
    },
    formFieldLabel: {
      color: '#475569',
      fontWeight: 500,
    },
    formFieldInput: {
      borderRadius: '0.375rem',
      borderColor: '#e2e8f0',
      '&:focus': {
        borderColor: '#0ea5e9',
        boxShadow: '0 0 0 1px #0ea5e9',
      },
    },
    footerActionLink: {
      color: '#0ea5e9',
      '&:hover': {
        color: '#0284c7',
      },
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#1e293b',
    },
    headerSubtitle: {
      fontSize: '1rem',
      color: '#475569',
    },
    identityPreview: {
      borderRadius: '0.375rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    logoBox: {
      width: 'auto',
    },
    logoImage: {
      width: 'auto',
      height: '2.5rem',
    },
  },
};

export default clerkAppearance;
