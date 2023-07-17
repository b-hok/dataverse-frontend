import { createRowSelection, RowSelection } from '../useFilesTable'
import { Button } from 'dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface RowSelectionMessageProps {
  selectedFilesCount: number
  totalFilesCount: number
  setRowSelection: (rowSelection: RowSelection) => void
}

const MINIMUM_SELECTED_FILES_TO_SHOW_MESSAGE = 0
const MINIMUM_FILES_TO_SHOW_MESSAGE = 10

export function RowSelectionMessage({
  selectedFilesCount,
  totalFilesCount,
  setRowSelection
}: RowSelectionMessageProps) {
  const { t } = useTranslation('files')
  const showMessage =
    totalFilesCount > MINIMUM_FILES_TO_SHOW_MESSAGE &&
    selectedFilesCount > MINIMUM_SELECTED_FILES_TO_SHOW_MESSAGE
  const selectAllRowsHandler = () => {
    const rowSelectionAll = createRowSelection(totalFilesCount)
    setRowSelection(rowSelectionAll)
  }

  if (!showMessage) {
    return <></>
  }
  return (
    <span>
      {t('table.rowSelection.filesSelected', { count: selectedFilesCount })}.
      {selectedFilesCount < totalFilesCount && (
        <Button variant="link" onClick={selectAllRowsHandler}>
          {t('table.rowSelection.selectAll', { count: totalFilesCount })}.
        </Button>
      )}
      <Button variant="link">Clear selection</Button>
    </span>
  )
}
