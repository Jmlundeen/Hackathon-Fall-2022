import './App.css';
import TempInput from './Input';
import { useState } from 'react';
import CurrentTempOutput from './CurrentTempOutput';
import { Space } from '@mantine/core';
function App() {
	const [showDisplay, setShowDisplay] = useState(false);
	const [targetTemp, setTargetTemp] = useState(30);
	const [hotOrCold, setHotOrCold] = useState(false);
	const [CorF, setCorF] = useState(false);

	const handleTargetTemp = (num) => {
		setTargetTemp(num);
	};

	const handleHotCold = (boolean) => {
		setHotOrCold(boolean);
	};

	const handleCorF = (boolean) => {
		setCorF(boolean);
	};

	let currDisplay;
	let button;
	if (showDisplay) {
		currDisplay = (
			<div>
				<CurrentTempOutput target={targetTemp} CorF={CorF} />
				<Space h="md" />
			</div>
		);

		button = (
			<button
				onClick={() => {
					setShowDisplay(false);
				}}
			>
				Change display
			</button>
		);
	} else {
		currDisplay = (
			<TempInput
				handleHotCold={handleHotCold}
				handleTargetTemp={handleTargetTemp}
				handleCorF={handleCorF}
				targetTemp={targetTemp}
				hotOrCold={hotOrCold}
				CorF={CorF}
			/>
		);
		button = (
			<button
				onClick={() => {
					setShowDisplay(true);
				}}
			>
				Change display
			</button>
		);
	}
	return (
		<>
			<header className="">
				<div className="App">
					{currDisplay}

					{button}
				</div>
			</header>
		</>
	);
}

export default App;
