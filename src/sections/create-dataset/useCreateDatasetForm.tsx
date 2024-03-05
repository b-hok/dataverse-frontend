import { useState } from 'react'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export function useCreateDatasetForm(
  repository: DatasetRepository,
  datasetIsValid: (formData: DatasetDTO) => boolean
): {
  submissionStatus: SubmissionStatus
  submitForm: (formData: DatasetDTO) => void
} {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )

  const submitForm = (formData: DatasetDTO): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    console.log(datasetIsValid(formData))
    if (!datasetIsValid(formData)) {
      setSubmissionStatus(SubmissionStatus.Errored)
      return
    }

    createDataset(repository, formData)
      .then(() => setSubmissionStatus(SubmissionStatus.SubmitComplete))
      .catch(() => setSubmissionStatus(SubmissionStatus.Errored))
  }

  return {
    submissionStatus,
    submitForm
  }
}
