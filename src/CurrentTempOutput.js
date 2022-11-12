import { Box, Modal, Space, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import React, { Component } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';
class CurrentTempOutput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			targetTemp: props.target,
			currentTemp: 0,
			eta: 0,
			alarm: false,
			fetch: false,
		};
	}

	componentDidMount() {
		this.timer = setInterval(() => this.getItems(), 1500);
	}
	componentWillUnmount() {
		this.timer = null; // here...
	}
	getItems() {
		try {
			fetch('http://localhost:5000/getInfo')
				.then((result) => result.json())
				.then((result) =>
					this.setState({
						currentTemp: result['currentTemperature'],
						// targetTemp: result['targetTemperature'],
						alarm: result['alarmActivated'],
						eta: result['eta'],
						data: result['tempHistory'],
					})
				);
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<>
				<Modal
					opened={this.state.alarm}
					onClose={() => this.setState({ alarm: !this.state.alarm })}
				>
					<Alert
						icon={<IconAlertCircle size={16} />}
						title="Bummer!"
						color="red"
					>
						Something terrible happened! You made a mistake and there is no
						going back, your data was lost forever!
					</Alert>
				</Modal>
				<Box
					sx={(theme) => ({
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[6]
								: theme.colors.gray[0],
						textAlign: 'center',
						padding: theme.spacing.xl,
						borderRadius: theme.radius.md,
						cursor: 'pointer',

						'&:hover': {
							backgroundColor:
								theme.colorScheme === 'dark'
									? theme.colors.dark[5]
									: theme.colors.gray[1],
						},
					})}
				>
					Current Temperature: {this.state.currentTemp}
				</Box>
				<Space h="md" />
				<Box
					sx={(theme) => ({
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[6]
								: theme.colors.gray[0],
						textAlign: 'center',
						padding: theme.spacing.xl,
						borderRadius: theme.radius.md,
						cursor: 'pointer',

						'&:hover': {
							backgroundColor:
								theme.colorScheme === 'dark'
									? theme.colors.dark[5]
									: theme.colors.gray[1],
						},
					})}
				>
					Target Temperature: {this.state.targetTemp}
				</Box>
				<Space h="md" />
				<Box
					sx={(theme) => ({
						backgroundColor:
							theme.colorScheme === 'dark'
								? theme.colors.dark[6]
								: theme.colors.gray[0],
						textAlign: 'center',
						padding: theme.spacing.xl,
						borderRadius: theme.radius.md,
						cursor: 'pointer',

						'&:hover': {
							backgroundColor:
								theme.colorScheme === 'dark'
									? theme.colors.dark[5]
									: theme.colors.gray[1],
						},
					})}
				>
					ETA Before Reaching Temp:{' '}
					{/* {this.state.eta > 10 ? this.state.eta.toFixed(0) : '<10 seconds'} */}
					{this.state.eta.toFixed(0)}
				</Box>
				<Space h="md" />
				<LineChart
					width={500}
					height={300}
					data={this.state.data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis domain={[10, 50]} />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="temp"
						stroke="#8884d8"
						activeDot={{ r: 8 }}
					/>
				</LineChart>
			</>
		);
	}
}

export default CurrentTempOutput;
