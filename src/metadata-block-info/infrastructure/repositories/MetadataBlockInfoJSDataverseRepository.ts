import { MetadataBlockInfoRepository } from '../../domain/repositories/MetadataBlockInfoRepository'
import {
  MetadataBlockInfoDisplayFormat,
  MetadataBlockInfo
} from '../../domain/models/MetadataBlockInfo'
import {
  getMetadataBlockByName,
  getCollectionMetadataBlocks,
  MetadataBlock as JSMetadataBlockInfo,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { JSMetadataBlockInfoMapper } from '../mappers/JSMetadataBlockInfoMapper'

export class MetadataBlockInfoJSDataverseRepository implements MetadataBlockInfoRepository {
  getByName(name: string): Promise<MetadataBlockInfoDisplayFormat | undefined> {
    return getMetadataBlockByName
      .execute(name)
      .then((jsMetadataBlockInfo: JSMetadataBlockInfo) =>
        JSMetadataBlockInfoMapper.toMetadataBlockInfo(jsMetadataBlockInfo)
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getByColecctionId(
    collectionIdOrAlias: number | string,
    onlyDisplayedOnCreate?: boolean
  ): Promise<MetadataBlockInfo[]> {
    return getCollectionMetadataBlocks
      .execute(collectionIdOrAlias, onlyDisplayedOnCreate)
      .then((metadataBlocks: MetadataBlockInfo[]) => {
        return metadataBlocks
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }
}
