import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { useDefineRules } from './useDefineRules'
import {
  MetadataField2,
  TypeClassMetadataFieldOptions,
  TypeMetadataFieldOptions
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DateField,
  EmailField,
  FloatField,
  IntField,
  TextBoxField,
  TextField,
  UrlField,
  Vocabulary,
  VocabularyMultiple
} from './Fields'
import styles from './index.module.scss'

interface Props {
  metadataFieldInfo: MetadataField2
  withinMultipleFieldsGroup?: boolean
}

export const MetadataFormField = ({
  metadataFieldInfo,
  withinMultipleFieldsGroup = false
}: Props) => {
  const {
    name,
    type,
    title,
    multiple,
    typeClass,
    isRequired,
    description,
    watermark,
    childMetadataFields,
    controlledVocabularyValues
  } = metadataFieldInfo

  const { control } = useFormContext()

  const isSafeCompound =
    typeClass === TypeClassMetadataFieldOptions.Compound &&
    childMetadataFields !== undefined &&
    Object.keys(childMetadataFields).length > 0

  const isSafeControlledVocabulary =
    typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary &&
    controlledVocabularyValues !== undefined &&
    controlledVocabularyValues.length > 0

  const isSafePrimitive = typeClass === TypeClassMetadataFieldOptions.Primitive

  const rulesToApply = useDefineRules({ metadataFieldInfo, isSafePrimitive })

  if (isSafeCompound) {
    return (
      <Form.GroupWithMultipleFields
        title={title}
        message={description}
        required={isRequired}
        withDynamicFields={false}>
        <div className={styles['multiple-fields-grid']}>
          {Object.entries(childMetadataFields).map(
            ([childMetadataFieldKey, childMetadataFieldInfo]) => {
              return (
                <MetadataFormField
                  metadataFieldInfo={childMetadataFieldInfo}
                  withinMultipleFieldsGroup
                  key={childMetadataFieldKey}
                />
              )
            }
          )}
        </div>
      </Form.GroupWithMultipleFields>
    )
  }

  if (isSafeControlledVocabulary) {
    if (multiple) {
      return (
        <VocabularyMultiple
          title={title}
          mainName={name}
          description={description}
          options={controlledVocabularyValues}
          isRequired={isRequired}
          disabled={false}
          control={control}
        />
      )
    }
    return (
      <Controller
        name={name}
        control={control}
        rules={rulesToApply}
        render={({ field: { onChange, ref }, fieldState: { invalid, error } }) => (
          <Form.Group
            controlId={name}
            required={isRequired}
            as={withinMultipleFieldsGroup ? Col : Row}>
            <Form.Group.Label message={description}>{title}</Form.Group.Label>
            <Vocabulary
              name={name}
              onChange={onChange}
              disabled={false}
              isInvalid={invalid}
              options={controlledVocabularyValues}
              ref={ref}
            />
            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </Form.Group>
        )}
      />
    )
  }

  if (isSafePrimitive) {
    return (
      <Controller
        name={name}
        control={control}
        rules={rulesToApply}
        render={({ field: { onChange, ref }, fieldState: { invalid, error } }) => (
          <Form.Group
            controlId={name}
            required={isRequired}
            as={withinMultipleFieldsGroup ? Col : undefined}>
            <Form.Group.Label message={description}>{title}</Form.Group.Label>

            <>
              {type === TypeMetadataFieldOptions.Text && (
                <TextField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Textbox && (
                <TextBoxField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.URL && (
                <UrlField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Email && (
                <EmailField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Int && (
                <IntField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Float && (
                <FloatField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
              {type === TypeMetadataFieldOptions.Date && (
                <DateField
                  name={name}
                  onChange={onChange}
                  disabled={false}
                  isInvalid={invalid}
                  placeholder={watermark}
                  ref={ref}
                />
              )}
            </>

            <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
          </Form.Group>
        )}
      />
    )
  }

  return null
}
