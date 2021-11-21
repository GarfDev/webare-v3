import styled from 'styled-components';
import Image from 'next/image';

import { NavigationBar } from '../global/components';

export function Index(): JSX.Element {
  // main return
  return (
    <>
      <Main />
    </>
  )
}

export default Index;

function Main() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.styled-components file.
   */
  return (
    <MainSection>
      <NavigationBar />
      <Content>
        <Text>
          Bằng cách đóng vai trò là một trung gian và kết nối những câu chuyện
          từ những mạng xã hội khác nhau, một cách ẩn danh. Webare tin rằng đây
          là một hình thức tốt để khơi gợi những cuộc trò chuyện cởi mở hơn.
        </Text>
        <Button>mời bot về discord</Button>
      </Content>

    </MainSection>
  );
}

const MainSection = styled.section`
  display: grid;
  min-height: 100vh;
  background-color: #cdd4c4;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 1fr 1fr;
  user-select: none;
`;

const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column-start: 3;
  grid-column-end: 11;
`;

const Text = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 20px;
`;

const Button = styled.button`
  border: none;
  font-weight: bold;
  padding: 20px 40px;
  border-radius: 5px;
  text-transform: uppercase;
  background-color: #DEB47D;
  max-width: 400px;

`

