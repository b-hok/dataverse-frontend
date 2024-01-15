import { File } from '../../../../../src/files/domain/models/File'
import { faker } from '@faker-js/faker'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import FileTypeToFriendlyTypeMap from '../../../../../src/files/domain/models/FileTypeToFriendlyTypeMap'
import { FileType } from '../../../../../src/files/domain/models/FilePreview'

export class FileMother {
  static create(props?: Partial<File>): File {
    return {
      name: faker.system.fileName(),
      datasetVersion: DatasetVersionMother.create(),
      type: new FileType(faker.helpers.arrayElement(Object.keys(FileTypeToFriendlyTypeMap))),
      restricted: faker.datatype.boolean(),
      permissions: {
        canDownloadFile: faker.datatype.boolean()
      },
      thumbnail: faker.datatype.boolean() ? faker.image.imageUrl() : undefined,
      ...props
    }
  }

  static createRealistic(props?: Partial<File>): File {
    return this.create({
      name: 'file.csv',
      datasetVersion: DatasetVersionMother.createRealistic(),
      restricted: false,
      permissions: {
        canDownloadFile: true
      },
      ...props
    })
  }

  static createRestricted(props?: Partial<File>): File {
    return this.createRealistic({
      restricted: true,
      permissions: {
        canDownloadFile: false
      },
      ...props
    })
  }

  static createRestrictedWithAccessGranted(props?: Partial<File>): File {
    return this.createRestricted({
      permissions: {
        canDownloadFile: true
      },
      ...props
    })
  }

  static createWithThumbnail(props?: Partial<File>): File {
    return this.create({
      thumbnail: faker.image.imageUrl(),
      ...props
    })
  }

  static createWithoutThumbnail(props?: Partial<File>): File {
    return this.create({
      thumbnail: undefined,
      ...props
    })
  }
}
