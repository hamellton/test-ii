import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 16px;

  h1 {
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
    letter-spacing: 0.05em;
    text-align: left;
    color: #231F20;
  }

  h2 {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.05em;
    text-align: left;
    color: #FC714E;
    margin-top: 40px;
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  ul {
    list-style-type: disc;
    padding-left: 15px;
  }

  li {
    font-size: 14px;
    font-weight: 400;
    line-height: 28px;
    letter-spacing: 0.05em;
    text-align: left;
    margin-bottom: 10px;
  }

  li:has(> ul) {
    list-style-type: none;
    padding-left: 0;
  }

  li > ul {
    list-style-type: disc;
    padding-left: 40px;
  }

  hr {
    margin: 40px 0;
    border: 1.5px solid #F7E6C3
  }
`;

const TabContent: React.FC<any> = ({ content }) => {
  return (
    <Container 
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TabContent;