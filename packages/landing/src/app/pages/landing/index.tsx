import React from 'react';
import { Helmet } from 'react-helmet';
import { Container, Content, Logo, Name } from './styles';
import Bear from '../../../assets/bear.png'

export const Landing = (): JSX.Element => {
  // main return
  return (
    <>
      <Helmet>
        <title>Webare - Connecting stories</title>
      </Helmet>
      <Container>
        <Content>
          <Logo width="100%" src={Bear} />
          <Name>Webare</Name>
        </Content>
      </Container>
    </>
  );
};
