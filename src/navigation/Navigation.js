import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {openDatabaseAction} from '../redux/actions/database.action';
import RootStack from './RootStack';
import {Loader} from '../components';

const Navigation = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(openDatabaseAction())
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch]);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  return (
    <>
      <RootStack theme={'light'} />
    </>
  );
};

export default Navigation;
