import AddQuestions from "./AddQuestions";
import BasicDetails from "./BasicDetails";
import { useCreateTestContext } from "./createTestContext";

function CreateTestLanding() {
  const {contextState}: any = useCreateTestContext() 
  return (
    contextState?.activeStep === 0 ? (<BasicDetails/>) : (<AddQuestions/>)
  );
}

export default CreateTestLanding;
