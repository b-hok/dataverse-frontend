import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement

interface FormInputProps extends React.HTMLAttributes<FormInputElement> {
  type?: 'text' | 'email' | 'password'
  readOnly?: boolean
  withinMultipleFieldsGroup?: boolean
  name?: string
  isValid?: boolean
  isInvalid?: boolean
}

export function FormInput({
  type = 'text',
  name,
  readOnly,
  isValid,
  isInvalid,
  withinMultipleFieldsGroup,
  ...props
}: FormInputProps) {
  return (
    <FormElementLayout
      withinMultipleFieldsGroup={withinMultipleFieldsGroup}
      isInvalid={isInvalid}
      isValid={isValid}>
      <FormBS.Control
        name={name}
        type={type}
        readOnly={readOnly}
        plaintext={readOnly}
        isValid={isValid}
        isInvalid={isInvalid}
        {...props}
      />
    </FormElementLayout>
  )
}
