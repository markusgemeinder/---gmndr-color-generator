// /app/components/Layout/Footer.js

'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--color-header-footer);
  color: var(--color-header-footer-text);
  position: fixed;
  bottom: 0;
  left: 0;
  height: 2rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 99;
`;

const FooterContent = styled.div`
  text-align: center;
  margin: 0.4rem;
`;

const FooterText = styled.p`
  font-size: 0.8rem;
`;

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  // Set mounted to true when the component is mounted in the client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration errors
  if (!mounted) return null;

  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>&copy; 2024 #GMNDR</FooterText>
      </FooterContent>
    </FooterContainer>
  );
}
