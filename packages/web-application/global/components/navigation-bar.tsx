import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

export const NavigationBar = (): JSX.Element => {
  // main return
  return (
    <Container>
      <Group>
        <LogoText href="/">Webare</LogoText>
      </Group>

      <Group>
        <Link
          target="_blank"
          rel="noreferrer"
          href="https://facebook.com/webareapp"
        >
          <Image
            alt="Facebook"
            objectFit="contain"
            src="/assets/icons/facebook.svg"
            layout="fixed"
            height="24px"
            width="24px"
          />
        </Link>

        <Link
          target="_blank"
          rel="noreferrer"
          href="https://dsc.gg/webare"
        >
          <Image
            alt="Discord"
            objectFit="contain"
            src="/assets/icons/discord.svg"
            layout="fixed"
            height="24px"
            width="24px"
          />
        </Link>

        <Link
          target="_blank"
          rel="noreferrer"
          href="https://github.com/garfdev/webare-v3"
        >
          <Image
            alt="Github"
            objectFit="contain"
            src="/assets/icons/github.svg"
            layout="fixed"
            height="24px"
            width="24px"
          />
        </Link>
      </Group>
    </Container>
  );
};

/* Styles */
const Container = styled.div`
  width: 100vw;
  display: flex;
  padding: 10px 60px;
  justify-content: space-between;
  position: fixed;
  height: 100px;
  top: 0;
`;

const Group = styled.div`
  display: flex;
  align-items: flex-end;
`;

const LogoText = styled.a`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: black;
`;

const Link = styled.a`
  margin-right: 9px;
`;
