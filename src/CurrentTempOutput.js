import './CurrentTempOutput.css';
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
			cOrF: props.CorF,
			hotOrCold: props.hotOrCold,
		};
	}

	componentDidMount() {
		// refresh interval for retrieving from esp32
		this.timer = setInterval(() => this.getItems(), 1500);
	}
	componentWillUnmount() {
		this.timer = null; // here...
	}
	getItems() {
		// try to fetch temperature from esp32
		try {
			fetch('http://localhost:5000/getInfo')
				.then((result) => result.json())
				.then((result) => {
					let fResult = result['currentTemperature'];
					if (this.state.cOrF) {
						fResult = fResult * (9 / 5) + 32;
					}
					this.setState({
						currentTemp: result['currentTemperature'],
						alarm: this.state.hotOrCold
							? result['currentTemperature'] <= this.state.targetTemp
							: fResult >= this.state.targetTemp,
						eta: result['eta'],
						data: result['tempHistory'],
					});
				});
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<>
				{/* Modal popup for notification that target temperature was reached */}
				<Modal
					opened={this.state.alarm}
					onClose={() => this.setState({ alarm: !this.state.alarm })}
				>
					<Alert icon={<IconAlertCircle size={16} />} color="green">
						Reached Target Temperature
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
					Current Temperature:{' '}
					{this.state.cOrF
						? `${(this.state.currentTemp * (9 / 5) + 32).toFixed(2)} °F`
						: `${this.state.currentTemp} °C`}
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
					Target Temperature:{' '}
					{this.state.cOrF
						? `${this.state.targetTemp} °F`
						: `${this.state.targetTemp} °C`}
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
					ETA Before Reaching Temp:{'  '}
					{`${this.state.eta.toFixed(0)} minutes`}
				</Box>
				<Space h="md" />
				<div
					id="graph"
					margin={{
						top: 5,
						right: 0,
						left: 20,
						bottom: 5,
					}}
				>
					{/* Live data chart of temp vs time */}
					<LineChart
						width={500}
						height={300}
						data={this.state.data}
						margin={{
							top: 5,
							right: 20,
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
				</div>
			</>
		);
	}
}

export default CurrentTempOutput;
