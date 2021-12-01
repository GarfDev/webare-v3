import styled from "styled-components";

export default function Privacy(): JSX.Element {
  // main return
  return (
    <Container>
      <Content>
        <Title>Privacy Policy</Title>
        <Text>
          This page informs you of our policies regarding the collection, use,
          and disclosure of personal data when you use our Service and the
          choices you have associated with that data.
        </Text>
        <Text>
          We use your data to provide and improve the Service. By using the
          Service, you agree to the collection and use of information in
          accordance with this policy. Unless otherwise defined in this Privacy
          Policy, terms used in this Privacy Policy have the same meanings as in
          our Terms and Conditions.
        </Text>
        <Title>Information Collection And Use</Title>
        <Text>
          The Company collects the following minimum information in order to
          exchange service between user of the app and Dynnsoft Device
          Identifer: to identify user uniquely. Which helps us improving the app
          by blocking any malicious user. The company does not user device
          identifer for any other purpose
        </Text>
        <Subtitle>Sharing personal information</Subtitle>
        <Text>
          Webare never shares you data with third parties. In principle, the
          company does not disclose your personal information to other companies
          or organizations that are not related to the service. However, we may
          provide personal information without exception, in the following
          cases:
        </Text>
        <Text>
          - If you believe that you must disclose personal information in order
          to take legal action against a person who violates the Company's Terms
          of Use, uses the Company's services, or has committed an offense that
          offends others
        </Text>
        <Text>
          - In accordance with the provisions of the Act or for the purpose of
          investigation, according to the procedure and method prescribed by the
          Act, if the request of the investigating agency
        </Text>
        <Subtitle>Transferring the Data</Subtitle>
        <Text>
          Your information, including Personal Data, may be transferred and
          maintained on the computers located outside of your state, province,
          country or other governmental jurisdiction where the data protection
          laws may differ than those from your jurisdiction.
        </Text>
        <Text>
          If you are located outside India and choose to provide information to
          us, please note that we transfer the data, including Personal Data, to
          India and process it there.
        </Text>
        <Text>
          Your consent to this Privacy Policy followed by your submission of
          such information represents your agreement to that transfer.
        </Text>
        <Text>
          Dynnsoft will take all steps reasonably necessary to ensure that your
          data is treated securely and in accordance with this Privacy Policy
          and no transfer of your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of your data and other personal information.
        </Text>
        <Subtitle>Security & Storing of the data</Subtitle>
        <Text>
          Random Chat stores only the data it needs to function properly. All
          the messages are self-destructing right after it delivered We store
          all important personal information of member information in an
          encrypted form, and are prepared to take out and abuse from the
          outside.
        </Text>
        <Text>
          In addition, we are responding to information leaks caused by internal
          intrusions through a system that distinguishes access rights to member
          information and security education.
        </Text>
        <Text>
          <b>Anonymous Messages</b>: Random Chat stores messages anonymously for
          a limited time. Those messages gets deleted after random moderation.
        </Text>
        <Text>
          <b>Contacts</b>: we do not ask for any contacts data.
        </Text>
        <Text>
          <b>Message self-destruction</b>: All the messages in Random Chat app
          are self-destructing. Those are deleted forever.
        </Text>
        <Subtitle>Children's Privacy</Subtitle>
        <Text>
          Our Service does not address anyone under the age of 18 ("Children").
          We do not knowingly collect personally identifiable information from
          anyone under the age of 18. If you are a parent or guardian and you
          are aware that your Children has provided us with Personal Data,
          please contact us. If we become aware that we have collected Personal
          Data from children without verification of parental consent, we take
          steps to remove that information from our servers.
        </Text>
        <Subtitle>Changes To This Privacy Policy</Subtitle>
        <Text>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. We will
          let you know via email and/or a prominent notice on our Service, prior
          to the change becoming effective and update the "effective date" at
          the top of this Privacy Policy. You are advised to review this Privacy
          Policy periodically for any changes. Changes to this Privacy Policy
          are effective when they are posted on this page.
        </Text>
        <Subtitle>Contact Us</Subtitle>
        <Text>
          If you have any questions about this Privacy Policy, please contact
          us: contact@webare.app
        </Text>
      </Content>
    </Container>
  );
}

export const Container = styled.div`
  width: 100%;
  display: grid;
  height: inherit;
  min-height: 100vh;
  overflow: hidden;
  background-color: #cdd4c4;
  grid-template-columns: 25% 1fr 25%;
  grid-template-rows: 1% 1fr 1%;
  grid-template-areas:
    'top top top'
    'leftaside content rightaside'
    'aside aside aside';
  @media (max-width: 900px) {
    grid-template-columns: 10% 1fr 10%;
  }
`;

export const Content = styled.div`
  padding: 40px;
  display: flex;
  grid-area: content;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.h3`
  font-size: 2rem;
  margin-top: 10px;
  margin-bottom: 15px;
`;

export const Subtitle = styled.h4`
  font-size: 1.7rem;
  margin-top: 10px;
  margin-bottom: 15px;
`;

export const Text = styled.p`
  line-height: 1.2;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;
