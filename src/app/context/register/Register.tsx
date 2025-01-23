import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  allData: FormDataType;
  updateFormData: (newData: Partial<FormDataType>) => void;
}

interface FormDataType {
  name: string;
  dateOfBirth: string;
  country: string;
  state: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  sexIdent: string;
  sexPref: string;
  racialPref: string;
  meeting: string;
  hobbies: string;
  image: { url: string; publicId: string }[];
}

export const FormContext = createContext<FormContextType | any>(undefined);

export function useFormContext(): FormContextType {
  return useContext(FormContext);
}

export const FormRegister: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<Number>(1);
  const [allData, setAllData] = useState<FormDataType>({
    name: "",
    dateOfBirth: "",
    country: "",
    state: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    sexIdent: "",
    sexPref: "",
    racialPref: "",
    meeting: "",
    hobbies: "",
    image: [],
  });

  const updateFormData = (newData: Partial<FormDataType>) => {
    setAllData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <FormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        allData,
        updateFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
