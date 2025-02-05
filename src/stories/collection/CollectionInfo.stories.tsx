import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { CollectionInfo } from '../../sections/collection/CollectionInfo'
import { CollectionMother } from '../../../tests/component/collection/domain/models/CollectionMother'

const meta: Meta<typeof CollectionInfo> = {
  title: 'Sections/Collection Page/CollectionInfo',
  component: CollectionInfo,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof CollectionInfo>

export const Default: Story = {
  render: () => <CollectionInfo collection={CollectionMother.createWithOnlyRequiredFields()} />
}

export const Complete: Story = {
  render: () => <CollectionInfo collection={CollectionMother.createComplete()} />
}

export const WithAffiliation: Story = {
  render: () => <CollectionInfo collection={CollectionMother.createWithAffiliation()} />
}

export const WithDescription: Story = {
  render: () => <CollectionInfo collection={CollectionMother.createWithDescription()} />
}
