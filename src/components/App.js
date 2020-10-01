import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import AppRouter from './Router';
import { authService } from "fbase";

function App() {
  // 데이터가 로드됐는지 안됐는지 확인
  const [init, setInit] = useState(false);
  // user 정보
  const [userObj, setUserObj] = useState(null);

  // 컴포넌트가 mount되면 실행됨. componentDidMount, componentDidUpdate, componentWillUnmount
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // user가 있다면 userObj에 user를 할당
      if(user) {
        setUserObj(user);
      }
      setInit(true);
    })
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "initializing..."}
      <footer>&copy;  {new Date().getFullYear()} Nwitter</footer>
    </>
    );
}

export default App;
