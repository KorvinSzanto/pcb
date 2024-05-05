import {Schematic} from '@tscircuit/schematic-viewer'
import {Buttons} from '../lib/garage/Buttons'
import type { Meta, StoryFn } from '@storybook/react';

const s = (elem: React.Component|JSX.Element) => (
    <Schematic style={{height: 600, outline: 'solid 1px black'}}>{elem}</Schematic>
)

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Garage Door',
} satisfies Meta;

export default meta;

export const GarageButtons: StoryFn = () => s(<Buttons />)