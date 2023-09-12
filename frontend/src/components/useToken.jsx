
import { useState } from 'react';
import secureLocalStorage from 'react-secure-storage';


export default function useToken() {
  const [token, setToken] = useState(secureLocalStorage.getItem('token'));
  // const [isSuper, setIsSuper] = useState(secureLocalStorage.getItem('is_super'));

  const saveToken = (userToken, userIsSuper) => {
    secureLocalStorage.setItem('token', userToken);
    // secureLocalStorage.setItem('is_super', userIsSuper);
    setToken(userToken);
    // setIsSuper(userIsSuper);
  };

  return {
    token: token || '',
    // isSuper: isSuper || '',
    setToken: saveToken,
  };
}