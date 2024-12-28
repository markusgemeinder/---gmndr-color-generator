// /app/components/Button/ColorPageToggleButton.js

'use client';

import { useContext } from 'react';
import styled from 'styled-components';
import LanguageContext from '@/app/components/LanguageProvider';
import { getText } from '@/lib/languageLibrary';

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin-top: 0.4rem;
  margin-bottom: 0.8rem;
  gap: 1rem;
`;

const ToggleText = styled.span`
  font-size: 0.8rem;
  color: var(--color-text);
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleFrame = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 32px;
  width: 52px;
  border-radius: 16px;
  background-color: var(--color-toggle-background);
  border: 2px solid var(--color-toggle-border);
  transition: background-color 0.3s ease;
  cursor: pointer;
`;

const ToggleButton = styled.div`
  position: absolute;
  background-color: var(--color-toggle-button);
  height: 24px;
  width: 24px;
  border-radius: 16px;
  left: ${({ isActive }) => (isActive ? 'calc(100% - 26px)' : '2px')};
  transition: left 0.3s ease;
`;

export default function ColorPageToggleButton({ isPageColorActive, onToggle }) {
  const { language } = useContext(LanguageContext);

  // ===== Sprachtext-Abfrage
  const getLanguageText = (key) => {
    return getText('color_page_toggle_button', key, language);
  };

  return (
    <ToggleContainer>
      <ToggleText>{getLanguageText('color_page_toggle_text')}</ToggleText>
      <ToggleWrapper>
        <ToggleText>{getLanguageText('color_page_toggle_off')}</ToggleText>
        <ToggleFrame onClick={onToggle}>
          <ToggleButton isActive={isPageColorActive} />
        </ToggleFrame>
        <ToggleText>{getLanguageText('color_page_toggle_on')}</ToggleText>
      </ToggleWrapper>
    </ToggleContainer>
  );
}
