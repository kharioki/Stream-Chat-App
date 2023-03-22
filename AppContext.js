import { createContext, useState, useContext } from 'react';

export const AppContext = createContext({
  channel: null,
  setChannel: (channel) => { },
  thread: null,
  setThread: (thread) => { },
});

export const AppProvider = ({ children }) => {
  const [channel, setChannel] = useState();
  const [thread, setThread] = useState();

  return (
    <AppContext.Provider value={{ channel, setChannel, thread, setThread }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
