import React from 'react';
import { usePersonalization } from './PersonalizationContext';

interface BilingualContentProps {
  en: React.ReactNode;
  ur: React.ReactNode;
}

/**
 * Component that shows English or Urdu content based on user's language preference.
 * Usage in MDX:
 * <BilingualContent
 *   en="Hello, this is English text"
 *   ur="ہیلو، یہ اردو متن ہے"
 * />
 */
export const BilingualContent: React.FC<BilingualContentProps> = ({ en, ur }) => {
  const { language } = usePersonalization();

  return (
    <div style={{ direction: language === 'ur' ? 'rtl' : 'ltr' }}>
      {language === 'ur' ? ur : en}
    </div>
  );
};

export default BilingualContent;
