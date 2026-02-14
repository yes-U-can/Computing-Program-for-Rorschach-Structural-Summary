export type PrivacySection = {
  slug: string;
  title: string;
  body: string[];
};

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    slug: 'data-collected',
    title: '1. Personal Data Collected',
    body: [
      'Google OAuth may collect name, email, and profile image for authentication.',
    ],
  },
  {
    slug: 'purpose-of-use',
    title: '2. Purpose of Collection',
    body: [
      'Collected data is used for login/session management, API key management, and AI chat features.',
    ],
  },
  {
    slug: 'api-key-encryption',
    title: '3. API Key Encryption',
    body: [
      'Saved API keys are encrypted before storage and are not stored as plaintext.',
    ],
  },
  {
    slug: 'chat-history',
    title: '4. Chat History Storage',
    body: [
      'Chat messages can be stored to provide session history and continuity.',
    ],
  },
  {
    slug: 'user-rights',
    title: '5. User Rights',
    body: [
      'Users may request access, correction, and deletion of account-related data within available product flows.',
    ],
  },
  {
    slug: 'contact',
    title: '6. Contact',
    body: [
      'For privacy-related inquiries, contact the service operator.',
    ],
  },
];

export function getPrivacySection(slug: string) {
  return PRIVACY_SECTIONS.find((section) => section.slug === slug);
}
