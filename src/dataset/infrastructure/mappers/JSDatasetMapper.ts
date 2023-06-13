import {
  Dataset as JSDataset,
  DatasetMetadataBlock as JSDatasetMetadataBlock,
  DatasetMetadataFields as JSDatasetMetadataFields,
  DatasetVersionInfo as JSDatasetVersionInfo
} from '@IQSS/dataverse-client-javascript'
import { DatasetVersionState as JSDatasetVersionState } from '@IQSS/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import {
  Dataset,
  DatasetStatus,
  MetadataBlockName,
  DatasetMetadataBlock,
  DatasetVersion,
  DatasetMetadataFields,
  MetadataBlocks
} from '../../domain/models/Dataset'

export class JSDatasetMapper {
  static toDataset(jsDataset: JSDataset, citation: string, summaryFieldsNames: string[]): Dataset {
    console.log(jsDataset)
    return new Dataset.Builder(
      jsDataset.persistentId,
      JSDatasetMapper.toTitle(jsDataset.metadataBlocks),
      JSDatasetMapper.toVersion(jsDataset.versionInfo),
      citation,
      JSDatasetMapper.toSummaryFields(jsDataset.metadataBlocks, summaryFieldsNames),
      jsDataset.license,
      JSDatasetMapper.toMetadataBlocks(jsDataset.metadataBlocks) // TODO Add alternativePersistentId, publicationDate, citationDate
    )
  }

  static toTitle(jsDatasetMetadataBlocks: JSDatasetMetadataBlock[]): string {
    const citationFields = jsDatasetMetadataBlocks.find(
      (metadataBlock) => metadataBlock.name === MetadataBlockName.CITATION
    )?.fields

    if (citationFields && typeof citationFields.title === 'string') {
      return citationFields.title
    }

    throw new Error('Dataset title not found')
  }

  static toVersion(jsDatasetVersionInfo: JSDatasetVersionInfo): DatasetVersion {
    return new DatasetVersion(
      jsDatasetVersionInfo.majorNumber,
      jsDatasetVersionInfo.minorNumber,
      JSDatasetMapper.toStatus(jsDatasetVersionInfo.state)
    )
  }

  static toStatus(jsDatasetVersionState: JSDatasetVersionState): DatasetStatus {
    switch (jsDatasetVersionState) {
      case JSDatasetVersionState.DRAFT:
        return DatasetStatus.DRAFT
      case JSDatasetVersionState.DEACCESSIONED:
        return DatasetStatus.DEACCESSIONED
      case JSDatasetVersionState.RELEASED:
        return DatasetStatus.RELEASED
      default:
        return DatasetStatus.RELEASED
    }
  }

  static toSummaryFields(
    jsDatasetMetadataBlocks: JSDatasetMetadataBlock[],
    summaryFieldsNames: string[]
  ): DatasetMetadataBlock[] {
    return jsDatasetMetadataBlocks.map((jsDatasetMetadataBlock) => {
      const getSummaryFields = (metadataFields: JSDatasetMetadataFields): DatasetMetadataFields => {
        return Object.keys(metadataFields).reduce((acc, metadataFieldName) => {
          if (summaryFieldsNames.includes(metadataFieldName)) {
            return {
              ...acc,
              [metadataFieldName]: metadataFields[metadataFieldName]
            }
          }
          return acc
        }, {})
      }

      return {
        name: JSDatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name),
        fields: getSummaryFields(jsDatasetMetadataBlock.fields)
      }
    })
  }

  static toMetadataBlocks(
    jsDatasetMetadataBlocks: JSDatasetMetadataBlock[],
    alternativePersistentId?: string,
    publicationDate?: string,
    citationDate?: string
  ): MetadataBlocks {
    return jsDatasetMetadataBlocks.map((jsDatasetMetadataBlock) => {
      return {
        name: JSDatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name),
        fields: JSDatasetMapper.toMetadataFields(
          jsDatasetMetadataBlock,
          alternativePersistentId,
          publicationDate,
          citationDate
        )
      }
    }) as MetadataBlocks
  }

  static toMetadataBlockName(jsDatasetMetadataBlockName: string): MetadataBlockName {
    const metadataBlockNameKey = Object.values(MetadataBlockName).find((metadataBlockNameKey) => {
      return metadataBlockNameKey === jsDatasetMetadataBlockName
    })

    if (metadataBlockNameKey === undefined) {
      throw new Error('Incorrect Metadata block name key')
    }

    return metadataBlockNameKey
  }

  static toMetadataFields(
    jsDatasetMetadataBlock: JSDatasetMetadataBlock,
    alternativePersistentId?: string,
    publicationDate?: string,
    citationDate?: string
  ): DatasetMetadataFields {
    if (jsDatasetMetadataBlock.name === MetadataBlockName.CITATION) {
      return {
        ...JSDatasetMapper.getExtraFieldsForCitationMetadata(
          publicationDate,
          alternativePersistentId,
          citationDate
        ),
        ...jsDatasetMetadataBlock.fields
      }
    }

    return jsDatasetMetadataBlock.fields
  }

  static getExtraFieldsForCitationMetadata(
    publicationDate?: string,
    alternativePersistentId?: string,
    citationDate?: string
  ) {
    const extraFields: {
      alternativePersistentId?: string
      publicationDate?: string
      citationDate?: string
    } = {}

    if (alternativePersistentId) {
      extraFields.alternativePersistentId = alternativePersistentId
    }

    if (publicationDate) {
      extraFields.publicationDate = publicationDate
    }

    if (publicationDate && citationDate !== publicationDate) {
      extraFields.citationDate = citationDate
    }

    return extraFields
  }
}
