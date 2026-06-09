import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getApi } from "../../_api/_api";
import { ITestDetails } from "./helper";

const CreateTestContext = createContext({});

export const useCreateTestContext = () => {
  return useContext(CreateTestContext);
};

const CreateTestContextProvider = (props: any) => {
  const { testId } = useParams();
  const [contextState, setContextState] = useState<any>({
    // testId: "f4e504a6-7088-4729-ba8f-1c8e15f917e8" || testId,
    testId: "",
    activeStep: 0,
    type: "createTest",
    // type: "addQuestion",
    testDetails: null as ITestDetails | null,
    questions: [],
    currentQuestionIndex: 0,
  });

  useEffect(() => {
    if (!contextState.testId) return;
    fetchTestDetails(contextState.testId);
  }, [contextState.testId]);

  const fetchTestDetails = async (id: string) => {
    const { status, body } = await getApi(`/tests/${id}`);
    if (status >= 400) return;
    setContextState((prev: any) => ({
      ...prev,
      testDetails: body?.data,
    }));
  };

  console.log(".....contextState....", contextState)

  const value = useMemo(
    () => ({
      contextState,
      setContextState,
    }),
    [contextState],
  );

  return (
    <CreateTestContext.Provider value={value}>
      {props.children}
    </CreateTestContext.Provider>
  );
};

export default CreateTestContextProvider;
