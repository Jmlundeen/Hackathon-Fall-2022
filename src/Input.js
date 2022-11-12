import { useState } from 'react';

import './input.css';

import {
	Button,
	createStyles,
	TextInput,
	SegmentedControl,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
	root: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
		boxShadow: theme.shadows.md,
		border: `1px solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
		}`,
	},

	active: {
		backgroundImage: theme.fn.gradient({ from: 'pink', to: 'orange' }),
	},

	control: {
		border: '0 !important',
	},

	labelActive: {
		color: `${theme.white} !important`,
	},
}));

export default function TempInput({
	handleTargetTemp,
	handleHotCold,
	handleCorF,
	targetTemp,
	hotOrCold,
	CorF,
}) {
	const { classes } = useStyles();
	return (
		<>
			<div id = "all">
				
			<TextInput 
					style={{
						display: 'flex',
        				alignItems: 'center',
        				justifyContent: 'center',
					}}
					value={targetTemp}
					size = "md"
					label= "Temperature"
					placeholder="30"
					onChange={(event) => handleTargetTemp(event.currentTarget.value)}
				/> 
				<SegmentedControl
					title="Degree Format"
					value={CorF}
					onChange={(value) => handleCorF(value)}
					radius="xl"
					size="md"
					data={[
						{ label: 'C°', value: false },
						{ label: 'F°', value: true },
					]}
					className={classes}
				/>
			</div>
			<div>
				<p>Heating or Cooling?</p>
			</div>
			<div>
				<SegmentedControl
					title="Heating up or Cooling down?"
					value={hotOrCold}
					onChange={(value) => handleHotCold(value)}
					radius="xl"
					size="md"
					data={[
						{ label: 'Heat🔥', value: false },
						{ label: 'Cool❄', value: true },
					]}
					className={classes}
				/>
			</div>
		</>
	);
}
