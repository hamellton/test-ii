import styled from "styled-components";
import { TeamMember } from "@utils/contentfulTypes";

interface ITeamMembersProps {
  data: TeamMember[];
}

const TeamMembersContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 0 130px;
  margin-top: 120px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 0 20px;
    margin-top: 40px;
  }
`;

const TeamMemberCard = styled.div<{ imgUrl: string }>`
  background-image: url(${props => props.imgUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 366px;
  height: 480px;
  position: relative;
  overflow: hidden;
`;

const TeamMemberContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFEF4;
  text-align: center;
  margin: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
`;

const TeamMemberName = styled.div`
    font-size: 24px;
    font-weight: 500;
    line-height: 40px;
    letter-spacing: 0.05em;
    text-align: center;
    color: #FC714E;
`;

const TeamMemberDescription = styled.div`
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #231F20;
`;

export default function TeamMembers(props: ITeamMembersProps) {
  const { data } = props;

  return (
    <TeamMembersContainer>
      {data.map((member) => (
        <TeamMemberCard key={member.name} imgUrl={member.imgUrl}>
          <TeamMemberContent>
            <TeamMemberName>{member.name}</TeamMemberName>
            <TeamMemberDescription>{member.description}</TeamMemberDescription>
          </TeamMemberContent>
        </TeamMemberCard>
      ))}
    </TeamMembersContainer>
  );
}