// /app/components/Common/CommonStyles.js

import styled from 'styled-components';
import Link from 'next/link';

export const Main = styled.main`
  margin: 3.4rem auto;
  padding: 1.6rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: yellow; */

  /* Smartphones im Querformat */
  @media (min-width: 600px) and (max-width: 999px) and (orientation: landscape) {
    margin: 3.8rem auto;
    padding: 1.2rem 1rem;
  }

  /* Tablets im Hochformat */
  @media (min-width: 600px) and (max-width: 999px) and (orientation: portrait) {
    margin: 4.6rem auto;
    padding: 3rem 1rem;
  }

  /* Desktop & Tablets im Querformat */
  @media (min-width: 1000px) {
    margin: 5.6rem auto;
    padding: 2rem 1rem;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 95%;
  max-width: 32rem;
  /* background-color: magenta; */
`;

export const NarrowContainer = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75%;
  max-width: 22rem;
  /* background-color: purple; */
`;

export const Spacer = styled.div`
  height: ${({ height }) => height || '1rem'};
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem;
  color: var(--color-title);
`;

export const Subtitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  margin: 1.5rem 0 0.5rem 0;
  color: var(--color-title);
`;

export const Headline = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin: 0.5rem;
  color: var(--color-title);
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  text-align: center;
  margin: 0.5rem;
  color: var(--color-text);
  /* hyphens: auto; */
  word-wrap: break-word;
`;

export const StyledLink = styled(Link)`
  text-align: center;
  font-weight: 700;
  color: var(--color-link);
  text-decoration: none;

  &:hover {
    color: var(--color-link-hover);
    text-decoration: underline;
  }
`;

export const ListContainer = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  width: 90%;

  @media (min-width: 768px) and (min-height: 768px) {
    width: 80%;
    max-width: 30rem;
  }
`;

export const List = styled.li`
  margin: 0;
  padding: 0.8rem 0;
  color: var(--color-title);
  font-weight: 500;
  width: 100%;
  border-top: 1px solid var(--color-border);
  /* hyphens: auto; */
  word-wrap: break-word;

  &:last-child {
    border-bottom: 1px solid var(--color-border);
  }
`;
