import { createContext, useContext, useState, useMemo } from "react";

const CreateTestContext = createContext({});

export const useCreateTestContext = () => {
  return useContext(CreateTestContext);
};

const CreateTestContextProvider = (props: any) => {
  const [contextState, setContextState] = useState<any>({
    testId:"",
    activeStep:0
  })
  const value = useMemo(
    () => ({
      contextState,
      setContextState,
      
    }),
    [contextState]
  );

  return (
    <CreateTestContext.Provider value={value}>
      {props.children}
    </CreateTestContext.Provider>
  );
};

export default CreateTestContextProvider;
