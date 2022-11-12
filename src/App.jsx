import './App.css';
import TempInput from './Input';
import { useState } from 'react';
import CurrentTempOutput from './CurrentTempOutput';
import { Space } from '@mantine/core';
function App() {
	const [showDisplay, setShowDisplay] = useState(false);
	const [targetTemp, setTargetTemp] = useState(0);
	const [hotOrCold, setHotOrCold] = useState(false);
	const [CorF, setCorF] = useState(false);

	const handleTargetTemp = (num) => {
		setTargetTemp(num);
		// const requestOptions = {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify({ title: 'React POST Request Example' }),
		// };
		// var newUrl = `http://localhost:5000/setAlarm/${num}/${
		// 	hotOrCold ? 1 : 0
		// }`;
		// fetch(newUrl, requestOptions)
		// 	.then((data) => console.log(data));
		console.log(num);
	};

	const handleHotCold = (boolean) => {
		setHotOrCold(boolean);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: 'React POST Request Example' }),
		};
		var newUrl = `http://localhost:5000/setAlarm/${targetTemp}/${
			hotOrCold ? 1 : 0
		}`;
		fetch(newUrl, requestOptions)
			.then((data) => console.log(data));
		console.log(num);
		console.log(boolean);
	};

	const handleCorF = (boolean) => {
		setCorF(boolean);
		console.log(boolean);
	};

	let currDisplay;
	let button;
	if (showDisplay) {
		// currDisplay = <TempOutput target={targetTemp} />;
		currDisplay = (
			<div>
				<CurrentTempOutput target={targetTemp} />
				<Space h="md" />
			</div>
		);

		button = (
			<button onClick={() => setShowDisplay(false)}>Change display</button>
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
			<button onClick={() => setShowDisplay(true)}>Change display</button>
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
