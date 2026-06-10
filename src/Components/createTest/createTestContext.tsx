import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getApi } from "../../_api/_api";
import { ITestDetails } from "./helper";

const CreateTestContext = createContext({});

export const useCreateTestContext = () => {
  return useContext(CreateTestContext);
};

const CreateTestContextProvider = (props: any) => {
  const { testId } = useParams();
  const location = useLocation();
  const navState = (location.state ?? {}) as {
    activeStep?: number;
    isView?: boolean;
  };
  const [contextState, setContextState] = useState<any>({
    testId: testId || "",
    activeStep: 0,
    type: "createTest",
    testDetails: null as ITestDetails | null,
    questions: [],
    currentQuestionIndex: 0,
    isQuestionsCreatedAndSaved: false,
    isEdit: false,
    disabled: false,
  });

  useEffect(() => {
    setContextState((prev: any) => ({
      ...prev,
      type: navState.isView
        ? "publishTest"
        : navState.activeStep === 2
          ? "publishTest"
          : "createTest",
      isEdit: testId ? true : false,
      disabled: navState.isView ?? false,
      activeStep: navState.activeStep || 0,
    }));
  }, [testId, navState.isView]);

  useEffect(() => {
    if (!contextState.testId) return;
    fetchTestDetails(contextState.testId);
  }, [contextState.testId, contextState.type]);

  const fetchTestDetails = async (id: string) => {
    const { status, body } = await getApi(`/tests/${id}`);
    if (status >= 400) return;
    setContextState((prev: any) => ({
      ...prev,
      testDetails: body?.data,
    }));
  };

  console.log(".....contextState....", contextState);

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
