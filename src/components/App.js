import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import AppRouter from './Router';
import { authService } from "fbase";

function App() {
  // 데이터가 로드됐는지 안됐는지 확인
  const [init, setInit] = useState(false);

  // 로그인했는지 안했는지 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트가 mount되면 실행됨. componentDidMount, componentDidUpdate, componentWillUnmount
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "initializing..."}
      <footer>&copy;  {new Date().getFullYear()} Nwitter</footer>
    </>
    );
}

export default App;
