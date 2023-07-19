import { FileCriteriaControls } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-controls/FileCriteriaControls'
import {
  FileAccessOption,
  FileCriteria,
  FileTag
} from '../../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../../../src/files/domain/models/File'

let onCriteriaChange = () => {}
const filesCountInfo = FilesCountInfoMother.create({
  perFileType: [
    {
      type: new FileType('image'),
      count: 5
    },
    {
      type: new FileType('text'),
      count: 10
    }
  ],
  perAccess: [
    {
      access: FileAccessOption.PUBLIC,
      count: 5
    },
    {
      access: FileAccessOption.RESTRICTED,
      count: 10
    }
  ],
  perFileTag: [
    {
      tag: new FileTag('document'),
      count: 5
    },
    {
      tag: new FileType('data'),
      count: 10
    }
  ]
})
describe('FileCriteriaControls', () => {
  beforeEach(() => {
    onCriteriaChange = cy.stub().as('onCriteriaChange')
  })

  it('does not render the files criteria inputs when there are less than 2 files', () => {
    cy.customMount(
      <FileCriteriaControls
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={FilesCountInfoMother.create({ total: 1 })}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).should('not.exist')
    cy.findByRole('button', { name: 'Filter Type: All' }).should('not.exist')
  })

  it('renders the SortBy input', () => {
    cy.customMount(
      <FileCriteriaControls
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={FilesCountInfoMother.create()}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).should('exist')
  })

  it('renders the Filters input', () => {
    cy.customMount(
      <FileCriteriaControls
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: All' }).should('exist')
    cy.findByText('Filter by').should('exist')
  })

  it('saves global criteria when the sort by option changes', () => {
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')

    cy.customMount(
      <FileCriteriaControls
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Oldest').click()

    cy.findByRole('button', { name: 'Filter Type: Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Document' }).should('exist')
  })

  it('saves global criteria when the filter by type option changes', () => {
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')

    cy.customMount(
      <FileCriteriaControls
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: Image' }).click()
    cy.findByText('Text (10)').click()

    cy.findByRole('button', { name: 'Filter Type: Text' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Document' }).should('exist')
  })

  it('saves global criteria when the filter by access option changes', () => {
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')

    cy.customMount(
      <FileCriteriaControls
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Access: Public' }).click()
    cy.findByText('Restricted (10)').click()

    cy.findByRole('button', { name: 'Filter Type: Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Restricted' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Document' }).should('exist')
  })

  it('saves global criteria when the filter by tag option changes', () => {
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')

    cy.customMount(
      <FileCriteriaControls
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: Document' }).click()
    cy.findByText('Data (10)').click()

    cy.findByRole('button', { name: 'Filter Type: Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Data' }).should('exist')
  })
})
