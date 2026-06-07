import { createContext, useContext } from "react";

const CreateTestContext = createContext({});

export const useCreateTestContext = () => {
  return useContext(CreateTestContext);
};

const CreateTestContextProvider = (props: any) => {
  const value = {};

  return (
    <CreateTestContext.Provider value={value}>
      {props.children}
    </CreateTestContext.Provider>
  );
};

export default CreateTestContextProvider;
