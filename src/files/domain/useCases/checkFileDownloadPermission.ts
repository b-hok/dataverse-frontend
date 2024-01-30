import { FileRepository } from '../repositories/FileRepository'
import { FilePreview, FilePublishingStatus } from '../models/FilePreview'

export async function checkFileDownloadPermission(
  fileRepository: FileRepository,
  file: FilePreview
): Promise<boolean> {
  if (file.version.publishingStatus === FilePublishingStatus.DEACCESSIONED) {
    return fileRepository.getUserPermissionsById(file.id).then((permissions) => {
      return permissions.canEditDataset
    })
  }

  const isRestricted = file.access.restricted || file.access.latestVersionRestricted
  if (!isRestricted && !file.isActivelyEmbargoed) {
    return true
  }

  return fileRepository.getUserPermissionsById(file.id).then((permissions) => {
    return permissions.canDownloadFile
  })
}
