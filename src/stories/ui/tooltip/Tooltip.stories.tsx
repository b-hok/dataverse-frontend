import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '../../../sections/ui/tooltip/Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => <Tooltip placement="right" message="Tooltip on right."></Tooltip>
}

export const AllVariantsAtAGlance: Story = {
  render: () => (
    <>
      <Tooltip placement="right" message="Tooltip on right."></Tooltip>
      <Tooltip placement="bottom" message="Tooltip on bottom."></Tooltip>
      <Tooltip placement="top" message="Tooltip on top."></Tooltip>
      <Tooltip placement="auto" message="Tooltip auto placement."></Tooltip>
      <Tooltip placement="left" message="Tooltip on left."></Tooltip>
    </>
  )
}
