import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from '../../../../../src/sections/home/datasets-list/DatasetsList'
import { DatasetPaginationInfo } from '../../../../../src/dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)
describe('Datasets List', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
  })

  it('renders skeleton while loading', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} />)

    cy.findByTestId('datasets-list-skeleton').should('exist')
    datasets.forEach((dataset) => {
      cy.findByRole('link', { name: dataset.version.title }).should('not.exist')
    })
  })

  it('renders no datasets message when there are no datasets', () => {
    datasetRepository.getAll = cy.stub().resolves([])
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} />)

    cy.findByText(/This dataverse currently has no datasets./).should('exist')
  })

  it('renders the datasets list', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} />)

    cy.wrap(datasetRepository.getAll).should(
      'be.calledOnceWith',
      new DatasetPaginationInfo(1, 10, totalDatasetsCount)
    )

    cy.findByText('1 to 10 of 200 Datasets').should('exist')
    datasets.forEach((dataset) => {
      cy.findByText(dataset.version.title)
        .should('exist')
        .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    })
  })

  it('renders the datasets list with the correct header on a page different than the first one ', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} />)

    cy.findByRole('button', { name: '6' }).click()

    cy.wrap(datasetRepository.getAll).should(
      'be.calledWith',
      new DatasetPaginationInfo(1, 10, totalDatasetsCount).goToPage(6)
    )
    cy.findByText('51 to 60 of 200 Datasets').should('exist')
  })

  it('renders the datasets list correct page when passing the page number as a query param', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} page={5} />)

    cy.wrap(datasetRepository.getAll).should(
      'be.calledWith',
      new DatasetPaginationInfo(1, 10, totalDatasetsCount).goToPage(5)
    )
    cy.findByText('41 to 50 of 200 Datasets').should('exist')
  })

  it('renders the page not found message when the page number is not found', () => {
    cy.customMount(<DatasetsList datasetRepository={datasetRepository} page={100} />)

    cy.findByText('Page Number Not Found').should('exist')
  })
})
