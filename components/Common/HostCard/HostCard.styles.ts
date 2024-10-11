import styled from "styled-components";

export const HostContainer = styled.div`
  width: 372px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  @media (max-width: 768px) {
    width: 246px;
  }
`;

export const HostImgContainer = styled.div`
    width: 200px;
    padding: 10px;
`;

export const HostInfo = styled.div`
    width: 100%;
    padding: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
`;

export const HostMainInfo = styled.div`
    width: 100%;
    
    .host-name {
        font-family: "Abhaya Libre";
        font-size: 20px;
        font-weight: 700;
        line-height: 30px;
        text-align: center;
        color: #231F20;
    }

    .host-bio {
        font-family: "Abhaya Libre";
        font-size: 15px;
        font-weight: 700;
        line-height: 22.5px;
        text-align: center;
        color: #827A7A;

        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const HostQuote = styled.div`
    width: 100%;
    padding: 8px;
    font-family: "Abhaya Libre";
    font-size: 16px;
    font-weight: 700;
    line-height: 25.6px;
    letter-spacing: 0.01em;
    text-align: center;
    color: #605054;
`;