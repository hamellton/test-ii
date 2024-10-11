import styled from "styled-components";

export const EpisodeListWrapper = styled.div`
    margin-top: 40px;

.list-title {
    font-family: "Abhaya Libre";
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
    text-align: left;
    margin-bottom: 16px;
    margin-top: 16px;

    @media (max-width: 768px) {
      padding: 32px 0 20px 0;
    }
}

.list-main {
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      gap: 20px;
    }

    .list-item:not(:first-child) {
        padding: 20px 0;
        border-bottom: none;
    }

    .list-item {
        display: flex;
        gap: 28px;
        padding: 4px 0 5px 0;
        border-bottom: 1px solid #0000001F;

        .list-item__date {
            min-width: 103px;
            font-size: 15px;
            line-height: 23px;
            color: #231F20;
            font-weight: 400;
        }

        .list-item__info {
            font-weight: 700;
            width: 100%;

            &__title {
                width: 100%;
                font-size: 15px;
                line-height: 23px;
                color: #231F20;
                font-weight: 400;
            }

            &__description {
                margin-top: 8px;
                font-size: 16px;
                line-height: 26px;
                letter-spacing: 0.01em;
                color: #231F20;
            }
        }
    }

    .list-item.main-list {
        display: flex;
        gap: 28px;
        padding: 20px 0;
        border-bottom: 1px solid #0000001F;

        @media (max-width: 768px) {
          flex-direction: column;
          gap: 8px;
          padding: 0;
        }

        .list-item__date {
            min-width: 103px;
            font-size: 12px;
            font-weight: 400;
            line-height: 18px;
        }

        .list-item__info {
            font-weight: 700;
            width: 100%;
            font-family: "Abhaya Libre";

            @media (max-width: 768px) {
              padding-bottom: 20px;
            }

            &__title {
                font-size: 20px;
                line-height: 30px;
                color: #460B24;
                font-weight: 700;

                @media (max-width: 768px) {
                  font-size: 17px;
                }
            }

            &__description {
                margin-top: 8px;
                font-size: 16px;
                line-height: 26px;
                letter-spacing: 0.01em;
                color: #231F20;

                @media (max-width: 768px) {
                  font-size: 17px;
                }
            }
        }
    }
}
`;