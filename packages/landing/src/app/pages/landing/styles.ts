import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  overflow: hidden;
  background-color: #FFBF86;
  grid-template-columns: 35% 1fr 35%;
  grid-template-rows: 15% 1fr 35%;
  grid-template-areas:
    "top top top"
    "leftaside content rightaside"
    "aside aside aside";
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-area: content;
`;

export const Logo = styled.img`
  width: 100%;
`;

export const Name = styled.p`
  font-weight: 500;
  font-smooth: auto;
  font-size: 3.5rem;
  padding-top: 20px;
`;
