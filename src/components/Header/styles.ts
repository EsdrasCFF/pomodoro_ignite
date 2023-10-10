import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;

    a {
      width: 3rem;
      height: 3rem;

      display: flex;
      justify-content: center;
      align-items: center;

      color: ${({theme}) => theme.COLORS.GRAY_100};

      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      &:hover {
        border-bottom: 3px solid ${({theme}) => theme.COLORS.GREEN_500};
      }

      &.active {
        color: ${({theme}) => theme.COLORS.GRAY_500};
      }
    }
  }
`;