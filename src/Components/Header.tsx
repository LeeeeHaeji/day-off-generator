import { useEffect, useRef } from "react";
import styled from "styled-components";
import logo from "../assets/images/logo.svg";
import { gsap } from "gsap";

interface HeaderProps {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateDarkMode = gsap
      .timeline({ paused: true })
      .to(".moon-mask", { y: 20, x: -10, duration: 0.2 }, 0)
      .to(".toggle-button", { x: 53, duration: 0.2 }, 0)
      .to(".toggle-button", { scale: 0.9, duration: 0.2 })
      .set(".circle", { display: "none" }, 0);

    const animateLightMode = gsap
      .timeline({ paused: true })
      .to(".moon-mask", { y: 0, x: 0, duration: 0.2 }, 0)
      .to(".toggle-button", { x: 0, duration: 0.2 }, 0)
      .to(".toggle-button", { scale: 0.8, duration: 0.2 })
      .set(".circle", { display: "block" }, 0); // circle을 다시 표시

    // 클릭 이벤트에서 애니메이션 제어
    const handleToggleAnimation = () => {
      if (isDark) {
        animateLightMode.restart();
      } else {
        animateDarkMode.restart();
      }
    };

    // 클릭 이벤트 리스너 등록
    const switchDiv = toggleRef.current;
    if (switchDiv) {
      switchDiv.addEventListener("click", handleToggleAnimation);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (switchDiv) {
        switchDiv.removeEventListener("click", handleToggleAnimation);
      }
    };
  }, [isDark]);

  const handleToggleClick = () => {
    setIsDark(!isDark);
  };

  return (
    <HeaderWrap>
      <Container>
        <h1>
          <img src={logo} alt="" />
        </h1>
        <Toggle>
          <div className="switch" onClick={handleToggleClick} ref={toggleRef}>
            <div className="toggle-button">
              <div className="toggle"></div>
              <div className="moon-mask"></div>
              <div className="circles-wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </Toggle>
      </Container>
    </HeaderWrap>
  );
}

const HeaderWrap = styled.header`
  background: white;
`;

const Container = styled.section`
  margin: auto;
  max-width: 1284px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
`;

const Toggle = styled.div`
  .switch {
    width: 110px;
    background-color: ${(props) => props.theme.accentColor};
    border-radius: 40px;
    cursor: pointer;
    outline: none;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  .toggle-button {
    transform: scale(0.8);
    transform-origin: center center;
  }

  .toggle {
    position: relative;
    width: 30px;
    height: 30px;
    margin: 12px;
    margin-top: 12px;
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 50%;
  }

  .moon-mask {
    position: absolute;
    width: 30px;
    height: 30px;
    margin: -71px 0 0px 32px;
    background-color: ${(props) => props.theme.accentColor};
    border-radius: 50%;
  }

  .circles-wrapper {
    .circle {
      position: absolute;
      width: 4px;
      height: 8px;
      background-color: white;
      border-radius: 10px;
      &:first-child {
        margin: -53px 0 0 25px;
      }
      &:nth-child(2) {
        margin: -8px 0 0 25px;
      }
      &:nth-child(3) {
        margin: -32px 0 0 48px;
        transform: rotate(90deg);
      }
      &:nth-child(4) {
        margin: -32px 0 0 2px;
        transform: rotate(90deg);
      }
      &:nth-child(5) {
        margin: -14px 0 0 8px;
        transform: rotate(45deg);
      }
      &:nth-child(6) {
        margin: -14px 0 0 43px;
        transform: rotate(320deg);
      }
      &:nth-child(7) {
        margin: -47px 0 0 8px;
        transform: rotate(135deg);
      }
      &:nth-child(8) {
        margin: -47px 0 0 43px;
        transform: rotate(235deg);
      }
    }
  }

  .text p {
    margin-left: 5px;
    font-size: 55px;
    line-height: 1.1;
    font-weight: 700;
  }

  .social-icons {
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 70px;
  }
`;
