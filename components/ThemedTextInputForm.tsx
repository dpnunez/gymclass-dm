import React, { ComponentProps } from "react";
import { useController } from "react-hook-form";
import { TextInput } from "./ThemedTextInput";

interface ThemedTextInputFormProps extends ComponentProps<typeof TextInput> {
  name: string;
  control: any;
  defaultValue?: string;
}

const ThemedTextInputForm = ({
  name,
  control,
  defaultValue = "",
  ...props
}: ThemedTextInputFormProps) => {
  const { field } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <TextInput
      {...props}
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
    />
  );
};

export { ThemedTextInputForm };
