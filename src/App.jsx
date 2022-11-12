import './App.css';
import TempInput from './Input';
import { useState } from 'react';
import TempOutput from './Output';

function App() {
	const [showDisplay, setShowDisplay] = useState(false);
	const [targetTemp, setTargetTemp] = useState(0);
	const [hotOrCold, setHotOrCold] = useState(false);
	const [CorF, setCorF] = useState(false);

	const handleTargetTemp = (num) => {
		setTargetTemp(num);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: 'React POST Request Example' }),
		};
		newUrl = `http://localhost:5000/setAlarm/${targetTemp}/${
			hotOrCold ? 1 : 0
		}`;
		fetch('http://localhost:5000/setAlarm', requestOptions)
			.then((response) => response.json())
			.then((data) => this.setState({ postId: data.id }));
		console.log(num);
	};

	const handleHotCold = (boolean) => {
		setHotOrCold(boolean);
		console.log(boolean);
	};

	const handleCorF = (boolean) => {
		setCorF(boolean);
		console.log(boolean);
	};

	let currDisplay;
	let button;
	if (showDisplay) {
		currDisplay = <TempOutput target={targetTemp} />;
		button = (
			<button onClick={() => setShowDisplay(false)}>change display</button>
		);
	} else {
		currDisplay = (
			<TempInput
				handleHotCold={handleHotCold}
				handleTargetTemp={handleTargetTemp}
				handleCorF={handleCorF}
			/>
		);
		button = (
			<button onClick={() => setShowDisplay(true)}>change display</button>
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
