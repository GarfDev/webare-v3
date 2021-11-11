import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: grid;
  height: inherit;
  min-height: 100vh;
  font-size: 4.5rem;
  background-color: #FED2AA;
  grid-template-columns: 35% 1fr 35%;
  grid-template-rows: 15% 1fr 35%;
  grid-template-areas:
    'top top top'
    'leftaside content rightaside'
    'aside aside aside';

  @media (max-width: 768px) {
    font-size: 3rem;
    grid-template-columns: 10% 1fr 10%;

    @media (max-height: 400px) {
      grid-template-rows: 10% 1fr 35%;
    }
  }
`;

export const Content = styled.div`
  padding: 40px;
  display: flex;
  grid-area: content;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.img`
  width: 100%;
  border-radius: 50%;
`;

export const Name = styled.p`
  line-height: 1;
  font-weight: 500;
  font-smooth: auto;
  padding: 20px;
`;
